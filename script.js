/**
 * WANDERLIGHT - Main JavaScript
 * A modern, accessible, and responsive website
 * 
 * @author Sicilean
 * @version 1.0.0
 */

'use strict';

// ============================================
// DOM Elements
// ============================================
const elements = {
    header: document.getElementById('header'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    backToTop: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    currentYear: document.getElementById('current-year'),
    statNumbers: document.querySelectorAll('.stat__number'),
    revealElements: document.querySelectorAll('.service-card, .feature, .contact__item')
};

// ============================================
// Configuration
// ============================================
const config = {
    scrollThreshold: 100,
    animationDuration: 600,
    countAnimationDuration: 2000,
    intersectionThreshold: 0.1
};

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Smooth scroll to element
 * @param {string} targetId - Target element ID
 */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const headerOffset = elements.header.offsetHeight;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Animate counting numbers
 * @param {HTMLElement} element - Element to animate
 * @param {number} target - Target number
 */
function animateCount(element, target) {
    const duration = config.countAnimationDuration;
    const start = 0;
    const startTime = performance.now();

    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeProgress);
        
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCount);
}

// ============================================
// Header Scroll Effect
// ============================================
function handleHeaderScroll() {
    if (window.scrollY > config.scrollThreshold) {
        elements.header.classList.add('scrolled');
    } else {
        elements.header.classList.remove('scrolled');
    }
}

// ============================================
// Mobile Navigation
// ============================================
function initMobileNav() {
    if (!elements.navToggle || !elements.navMenu) return;

    elements.navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking a link
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.navMenu.classList.contains('open') && 
            !elements.navMenu.contains(e.target) && 
            !elements.navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const isOpen = elements.navMenu.classList.toggle('open');
    elements.navToggle.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
}

function closeMobileMenu() {
    elements.navMenu.classList.remove('open');
    elements.navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

// ============================================
// Active Navigation Link
// ============================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - elements.header.offsetHeight - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    elements.navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', debounce(updateActiveLink, 50));
}

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    if (!elements.backToTop) return;

    function toggleBackToTop() {
        if (window.scrollY > config.scrollThreshold * 3) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', debounce(toggleBackToTop, 50));

    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Scroll Reveal Animation
// ============================================
function initScrollReveal() {
    // Add reveal class to elements
    elements.revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: config.intersectionThreshold,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.revealElements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Statistics Counter Animation
// ============================================
function initStatsCounter() {
    if (!elements.statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'), 10);
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    elements.statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    if (!elements.contactForm) return;

    const form = elements.contactForm;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector('.form__success');

    // Form validation patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: /^.{10,1000}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Inserisci un nome valido (almeno 2 caratteri)',
        email: 'Inserisci un indirizzo email valido',
        message: 'Il messaggio deve contenere almeno 10 caratteri'
    };

    /**
     * Validate a single field
     * @param {HTMLInputElement|HTMLTextAreaElement} field - Field to validate
     * @returns {boolean} - Validation result
     */
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = field.parentElement.querySelector('.form__error');
        
        // Skip optional fields if empty
        if (fieldName === 'subject') return true;
        
        let isValid = true;

        if (patterns[fieldName]) {
            isValid = patterns[fieldName].test(value);
        } else if (field.required && !value) {
            isValid = false;
        }

        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessages[fieldName] || 'Campo non valido';
                errorElement.classList.add('visible');
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('visible');
            }
        }

        return isValid;
    }

    /**
     * Validate entire form
     * @returns {boolean} - Form validation result
     */
    function validateForm() {
        const fields = form.querySelectorAll('.form__input, .form__textarea');
        let isFormValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // Real-time validation on blur
    form.querySelectorAll('.form__input, .form__textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Focus first invalid field
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            successMessage.classList.add('visible');
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('visible');
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Si è verificato un errore. Riprova più tardi.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// Current Year in Footer
// ============================================
function setCurrentYear() {
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNav() {
    // Allow arrow key navigation in the menu
    elements.navLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % elements.navLinks.length;
                elements.navLinks[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + elements.navLinks.length) % elements.navLinks.length;
                elements.navLinks[prevIndex].focus();
            }
        });
    });
}

// ============================================
// Reduced Motion Detection
// ============================================
function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
}

// ============================================
// Parallax Effect (Subtle)
// ============================================
function initParallax() {
    const heroParticles = document.querySelector('.hero__particles');
    if (!heroParticles) return;

    // Only apply parallax if user doesn't prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                heroParticles.style.transform = `translateY(${scrolled * 0.3}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// Initialize Everything
// ============================================
function init() {
    // Check for reduced motion preference
    checkReducedMotion();
    
    // Set current year
    setCurrentYear();
    
    // Initialize components
    initMobileNav();
    initSmoothScroll();
    initActiveNavLink();
    initBackToTop();
    initScrollReveal();
    initStatsCounter();
    initContactForm();
    initKeyboardNav();
    initParallax();
    
    // Header scroll effect
    window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
    handleHeaderScroll(); // Initial check
}

// ============================================
// Run on DOM Ready
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// Service Worker Registration (Optional - for PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
