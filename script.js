// ===============================
// GLOBAL VARIABLES & CONFIGURATION
// ===============================
const CONFIG = {
    TYPING_SPEED: 100,
    TYPING_DELAY: 2000,
    PARTICLE_COUNT: 50,
    PARALLAX_FACTOR: 0.5,
    SCROLL_OFFSET: 100
};

// Typing text configuration
const TYPING_TEXTS = [
    'AWS Student Ambassador',
    'Cloud Engineer',
    'Infrastructure Specialist', 
    'Technical Speaker',
    'Cloud Enthusiast'
];

// ===============================
// UTILITY FUNCTIONS
// ===============================
const utils = {
    // Throttle function for performance optimization
    throttle: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Debounce function for performance optimization  
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Random number generator
    random: (min, max) => Math.random() * (max - min) + min,

    // Smooth ease-out animation function
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),

    // Get scroll percentage
    getScrollPercentage: () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    }
};

// ===============================
// DOM ELEMENTS CACHE
// ===============================
const elements = {
    navbar: null,
    hamburger: null,
    navMenu: null,
    navLinks: null,
    scrollProgress: null,
    typingText: null,
    particles: null,
    parallaxLayers: null,
    skillBars: null,
    galleryMain: null,
    galleryThumbs: null,
    contactForm: null,
    magneticBtns: null,
    revealElements: null
};

// Cache DOM elements
const cacheElements = () => {
    elements.navbar = document.getElementById('navbar');
    elements.hamburger = document.getElementById('hamburger');
    elements.navMenu = document.getElementById('navMenu');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.scrollProgress = document.getElementById('scrollProgress');
    elements.typingText = document.getElementById('typingText');
    elements.particles = document.getElementById('particles');
    elements.parallaxLayers = document.querySelectorAll('.parallax-layer');
    elements.skillBars = document.querySelectorAll('.skill-progress');
    elements.galleryMain = document.getElementById('galleryMain');
    elements.galleryThumbs = document.querySelectorAll('.gallery-thumb');
    elements.contactForm = document.getElementById('contactForm');
    elements.magneticBtns = document.querySelectorAll('.magnetic-btn');
    elements.revealElements = document.querySelectorAll('[class*="reveal-"]');
};

// ===============================
// SCROLL PROGRESS BAR
// ===============================
const updateScrollProgress = () => {
    const scrollPercent = utils.getScrollPercentage();
    if (elements.scrollProgress) {
        elements.scrollProgress.style.width = `${scrollPercent}%`;
    }
};

// ===============================
// NAVIGATION FUNCTIONALITY
// ===============================
const navigationController = {
    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
    },

    setupEventListeners() {
        // Hamburger menu toggle
        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', this.toggleMobileMenu);
        }

        // Smooth scrolling for navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', this.handleOutsideClick);

        // Handle scroll for navbar styling
        window.addEventListener('scroll', utils.throttle(this.handleScroll, 10));
    },

    toggleMobileMenu() {
        elements.hamburger.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    },

    handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu after clicking
        elements.hamburger.classList.remove('active');
        elements.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleOutsideClick(e) {
        if (!elements.navMenu.contains(e.target) && !elements.hamburger.contains(e.target)) {
            elements.hamburger.classList.remove('active');
            elements.navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    handleScroll() {
        // Add/remove scrolled class for navbar styling
        if (window.scrollY > 50) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    },

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Update active nav link
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }
};

// ===============================
// TYPING ANIMATION
// ===============================
const typingAnimation = {
    currentTextIndex: 0,
    currentCharIndex: 0,
    isDeleting: false,
    typeSpeed: CONFIG.TYPING_SPEED,

    init() {
        if (elements.typingText) {
            this.type();
        }
    },

    type() {
        const currentText = TYPING_TEXTS[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            elements.typingText.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            this.typeSpeed = CONFIG.TYPING_SPEED / 2;
        } else {
            // Adding characters
            elements.typingText.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            this.typeSpeed = CONFIG.TYPING_SPEED;
        }

        let nextDelay = this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            // Finished typing current text
            nextDelay = CONFIG.TYPING_DELAY;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            // Finished deleting current text
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % TYPING_TEXTS.length;
            nextDelay = 500;
        }

        setTimeout(() => this.type(), nextDelay);
    }
};

// ===============================
// PARTICLE BACKGROUND SYSTEM
// ===============================
const particleSystem = {
    particles: [],

    init() {
        if (!elements.particles) return;
        
        this.createParticles();
        this.animateParticles();
    },

    createParticles() {
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = utils.random(2, 6);
            const x = utils.random(0, window.innerWidth);
            const y = utils.random(0, window.innerHeight);
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDelay = `${utils.random(0, 6)}s`;
            particle.style.animationDuration = `${utils.random(4, 8)}s`;
            
            elements.particles.appendChild(particle);
            
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: utils.random(-0.5, 0.5),
                vy: utils.random(-0.5, 0.5)
            });
        }
    },

    animateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= window.innerWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= window.innerHeight) {
                particle.vy *= -1;
            }

            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
        });

        requestAnimationFrame(() => this.animateParticles());
    }
};

// ===============================
// PARALLAX SCROLLING
// ===============================
const parallaxController = {
    init() {
        window.addEventListener('scroll', utils.throttle(this.updateParallax.bind(this), 16));
    },

    updateParallax() {
        const scrolled = window.pageYOffset;
        
        elements.parallaxLayers.forEach(layer => {
            const speed = layer.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
};

// ===============================
// SCROLL REVEAL ANIMATIONS
// ===============================
const scrollRevealController = {
    init() {
        this.setupIntersectionObserver();
    },

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || index * 100;
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.revealElements.forEach(element => {
            observer.observe(element);
        });
    }
};

// ===============================
// SKILLS PROGRESS ANIMATION
// ===============================
const skillsController = {
    init() {
        this.setupSkillObserver();
    },

    setupSkillObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    },

    animateSkillBars(category) {
        const skillBars = category.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.dataset.progress;
                bar.style.width = `${progress}%`;
                
                // Animate percentage counter
                this.animateCounter(category, bar, progress);
            }, index * 200);
        });
    },

    animateCounter(category, bar, targetValue) {
        const percentageElement = bar.closest('.skill-item').querySelector('.skill-percentage');
        let currentValue = 0;
        const increment = targetValue / 60; // 60 frames for smooth animation
        
        const counterInterval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counterInterval);
            }
            percentageElement.textContent = `${Math.round(currentValue)}%`;
        }, 16); // ~60fps
    }
};

// ===============================
// IMAGE GALLERY FUNCTIONALITY
// ===============================
const galleryController = {
    currentIndex: 0,

    init() {
        this.setupGalleryEvents();
        this.startAutoRotation();
    },

    setupGalleryEvents() {
        elements.galleryThumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.switchImage(index);
                this.resetAutoRotation();
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    },

    switchImage(index) {
        // Remove active class from all thumbnails
        elements.galleryThumbs.forEach(thumb => thumb.classList.remove('active'));
        
        // Add active class to current thumbnail
        elements.galleryThumbs[index].classList.add('active');
        
        // Switch main image with fade effect
        const newSrc = elements.galleryThumbs[index].dataset.src;
        const newAlt = elements.galleryThumbs[index].alt;
        
        elements.galleryMain.style.opacity = '0';
        
        setTimeout(() => {
            elements.galleryMain.src = newSrc;
            elements.galleryMain.alt = newAlt;
            elements.galleryMain.style.opacity = '1';
        }, 200);
        
        this.currentIndex = index;
    },

    nextImage() {
        const nextIndex = (this.currentIndex + 1) % elements.galleryThumbs.length;
        this.switchImage(nextIndex);
    },

    previousImage() {
        const prevIndex = (this.currentIndex - 1 + elements.galleryThumbs.length) % elements.galleryThumbs.length;
        this.switchImage(prevIndex);
    },

    startAutoRotation() {
        this.autoRotateInterval = setInterval(() => {
            this.nextImage();
        }, 4000);
    },

    resetAutoRotation() {
        clearInterval(this.autoRotateInterval);
        this.startAutoRotation();
    }
};

// ===============================
// MAGNETIC BUTTON EFFECTS
// ===============================
const magneticEffects = {
    init() {
        elements.magneticBtns.forEach(btn => {
            btn.addEventListener('mouseenter', this.handleMouseEnter);
            btn.addEventListener('mousemove', this.handleMouseMove);
            btn.addEventListener('mouseleave', this.handleMouseLeave);
        });
    },

    handleMouseEnter(e) {
        this.style.transition = 'transform 0.1s ease-out';
    },

    handleMouseMove(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px)`;
    },

    handleMouseLeave(e) {
        this.style.transition = 'transform 0.3s ease-out';
        this.style.transform = 'translate(0, 0)';
    }
};

// ===============================
// CONTACT FORM FUNCTIONALITY
// ===============================
const contactController = {
    init() {
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', this.handleSubmit);
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        if (!contactController.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Create mailto link
        const subject = encodeURIComponent('Portfolio Contact Form Submission');
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        );
        
        const mailtoLink = `mailto:zhouanqi@example.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        contactController.showSuccessMessage();
        
        // Reset form
        this.reset();
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showSuccessMessage() {
        const submitBtn = elements.contactForm.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        submitBtn.style.background = '#4ade80';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
};

// ===============================
// PERFORMANCE OPTIMIZATIONS
// ===============================
const performanceOptimizer = {
    init() {
        this.setupLazyLoading();
        this.setupPreloadCriticalResources();
    },

    setupLazyLoading() {
        // Lazy load non-critical images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    setupPreloadCriticalResources() {
        // Preload critical fonts and images
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
};

// ===============================
// EASTER EGG & CONSOLE MESSAGE
// ===============================
const easterEgg = {
    init() {
        this.showConsoleMessage();
        this.setupKonamiCode();
    },

    showConsoleMessage() {
        const styles = [
            'color: #9fb4c7',
            'font-size: 16px',
            'font-weight: bold',
            'text-shadow: 2px 2px 0px rgba(0,0,0,0.3)'
        ].join(';');

        console.log('%c👋 Hello there, fellow developer!', styles);
        console.log('%cThanks for checking out my portfolio code!', 'color: #c8b8a8; font-size: 14px;');
        console.log('%c🚀 Built with vanilla JavaScript, CSS3, and lots of ☕', 'color: #d4a89a; font-size: 12px;');
    },

    setupKonamiCode() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        let userInput = [];

        document.addEventListener('keydown', (e) => {
            userInput.push(e.code);
            
            if (userInput.length > konamiCode.length) {
                userInput.shift();
            }
            
            if (userInput.join('') === konamiCode.join('')) {
                this.triggerEasterEgg();
                userInput = [];
            }
        });
    },

    triggerEasterEgg() {
        // Create rainbow animation
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        // Add rainbow keyframe if not exists
        if (!document.querySelector('#rainbow-keyframes')) {
            const style = document.createElement('style');
            style.id = 'rainbow-keyframes';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('%c🎉 KONAMI CODE ACTIVATED! 🌈', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
};

// ===============================
// MAIN APPLICATION INITIALIZATION
// ===============================
class PortfolioApp {
    constructor() {
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Cache DOM elements
            cacheElements();

            // Initialize all modules
            await Promise.all([
                this.initializeCore(),
                this.initializeAnimations(),
                this.initializeInteractions(),
                this.initializeOptimizations()
            ]);

            this.isInitialized = true;
            console.log('Portfolio app initialized successfully! 🚀');
            
        } catch (error) {
            console.error('Error initializing portfolio app:', error);
        }
    }

    async initializeCore() {
        navigationController.init();
        updateScrollProgress();
        window.addEventListener('scroll', utils.throttle(updateScrollProgress, 10));
    }

    async initializeAnimations() {
        typingAnimation.init();
        particleSystem.init();
        parallaxController.init();
        scrollRevealController.init();
        skillsController.init();
    }

    async initializeInteractions() {
        galleryController.init();
        magneticEffects.init();
        contactController.init();
    }

    async initializeOptimizations() {
        performanceOptimizer.init();
        easterEgg.init();
    }

    // Public method to handle window resize
    handleResize() {
        // Recalculate particle positions
        if (particleSystem.particles.length > 0) {
            particleSystem.particles.forEach(particle => {
                particle.x = Math.min(particle.x, window.innerWidth);
                particle.y = Math.min(particle.y, window.innerHeight);
            });
        }
    }
}

// ===============================
// APPLICATION STARTUP
// ===============================
const app = new PortfolioApp();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Handle window resize
window.addEventListener('resize', utils.debounce(() => {
    app.handleResize();
}, 250));

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Export app instance for potential external use
window.PortfolioApp = app;

// ===============================
// SERVICE WORKER REGISTRATION
// ===============================
if ('serviceWorker' in navigator && 'caches' in window) {
    window.addEventListener('load', () => {
        // Service worker would go here for PWA functionality
        console.log('Service worker registration ready (not implemented in this demo)');
    });
}