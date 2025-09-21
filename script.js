// Navigation functionality
class InteractiveNavigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupSectionAnimations();
        this.setupSmoothScrolling();
    }

    // Handle scroll effects
    setupScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class based on scroll position
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Update active navigation link
            this.updateActiveLink();

            // Animate sections on scroll
            this.animateSections();

            lastScrollTop = scrollTop;
        });
    }

    // Setup mobile menu toggle
    setupMobileMenu() {
        this.mobileMenu.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (this.navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.mobileMenu.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Update active navigation link based on scroll position
    updateActiveLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Setup active link highlighting
    setupActiveLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                this.navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
            });

            // Add hover effects with enhanced animations
            link.addEventListener('mouseenter', () => {
                this.animateHover(link, true);
            });

            link.addEventListener('mouseleave', () => {
                this.animateHover(link, false);
            });
        });
    }

    // Enhanced hover animations
    animateHover(element, isEntering) {
        if (isEntering) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(59, 130, 246, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            ripple.style.pointerEvents = 'none';

            element.style.position = 'relative';
            element.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        }
    }

    // Animate sections on scroll
    animateSections() {
        this.sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
    }

    // Setup section animations
    setupSectionAnimations() {
        // Intersection Observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate cards within the section
                    const cards = entry.target.querySelectorAll('.feature-card, .service-item, .portfolio-item');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Initialize card animations
        const cards = document.querySelectorAll('.feature-card, .service-item, .portfolio-item');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
        });
    }

    // Setup smooth scrolling
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Color theme changer based on scroll position
class ColorThemeChanger {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.changeNavbarTheme();
        });
    }

    changeNavbarTheme() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Different color schemes for different scroll positions
        const themes = [
            { position: 0, class: 'theme-hero' },
            { position: windowHeight, class: 'theme-about' },
            { position: windowHeight * 2, class: 'theme-services' },
            { position: windowHeight * 3, class: 'theme-portfolio' },
            { position: windowHeight * 4, class: 'theme-contact' }
        ];

        // Remove all theme classes
        this.navbar.classList.remove('theme-hero', 'theme-about', 'theme-services', 'theme-portfolio', 'theme-contact');

        // Add appropriate theme class
        for (let i = themes.length - 1; i >= 0; i--) {
            if (scrollPosition >= themes[i].position - 100) {
                this.navbar.classList.add(themes[i].class);
                break;
            }
        }
    }
}

// Enhanced scroll effects
class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupScrollProgress();
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3B82F6, #8B5CF6);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .navbar.theme-about {
            background: rgba(16, 185, 129, 0.95) !important;
        }

        .navbar.theme-services {
            background: rgba(139, 92, 246, 0.95) !important;
        }

        .navbar.theme-portfolio {
            background: rgba(249, 115, 22, 0.95) !important;
        }

        .navbar.theme-contact {
            background: rgba(236, 72, 153, 0.95) !important;
        }

        .nav-link {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveNavigation();
    new ColorThemeChanger();
    new ScrollEffects();
    addDynamicStyles();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});
