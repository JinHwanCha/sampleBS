// BSTONES Portfolio Website - Interactive Features

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeScrollEffects();
    initializeTimeline();
    initializePortfolioCards();
    initializeSmoothScroll();
    initializeAccessibility();
});

// Initialize scroll-triggered animations
function initializeAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate children with stagger
                const children = entry.target.querySelectorAll('.feature-card, .portfolio-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.about-section, .timeline-section, .portfolio-section');
    sections.forEach(section => observer.observe(section));
}

// Initialize scroll effects for header
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }

        // Hide/show header on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Initialize timeline interactions
function initializeTimeline() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const timelineProgress = document.querySelector('.timeline-progress');

    // Animate progress on scroll
    const timelineSection = document.querySelector('.timeline-section');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateTimelineProgress();
            }
        });
    }, { threshold: 0.5 });

    if (timelineSection) {
        timelineObserver.observe(timelineSection);
    }

    // Timeline point interactions
    timelinePoints.forEach((point, index) => {
        point.addEventListener('click', () => {
            // Remove active class from all points
            timelinePoints.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked point
            point.classList.add('active');
            
            // Update progress bar
            const progressWidth = ((index + 1) / timelinePoints.length) * 100;
            if (timelineProgress) {
                timelineProgress.style.width = `${progressWidth}%`;
            }

            // Add haptic feedback (if supported)
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        // Add keyboard support
        point.setAttribute('tabindex', '0');
        point.setAttribute('role', 'button');
        point.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                point.click();
            }
        });
    });
}

// Animate timeline progress
function animateTimelineProgress() {
    const timelineProgress = document.querySelector('.timeline-progress');
    if (timelineProgress) {
        let width = 0;
        const targetWidth = 30;
        const interval = setInterval(() => {
            if (width >= targetWidth) {
                clearInterval(interval);
            } else {
                width++;
                timelineProgress.style.width = width + '%';
            }
        }, 20);
    }
}

// Initialize portfolio card interactions
function initializePortfolioCards() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });

        // Click handler with animation
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        });
    });
}

// Initialize smooth scroll for navigation
function initializeSmoothScroll() {
    const ctaButton = document.querySelector('.cta-button');
    const companyButton = document.querySelector('.company-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    if (companyButton) {
        companyButton.addEventListener('click', () => {
            // Add your company website URL here
            console.log('Navigate to company website');
            // window.open('https://your-company-website.com', '_blank');
        });
    }
}

// Initialize accessibility features
function initializeAccessibility() {
    // Add ARIA labels dynamically
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Handle focus for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '3px solid var(--primary-color)';
        });

        element.addEventListener('blur', () => {
            element.style.outline = '';
        });
    });

    // Add skip to main content link
    addSkipToMainContent();
}

// Add skip to main content for accessibility
function addSkipToMainContent() {
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 0;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGraphic = document.querySelector('.hero-graphic');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (heroGraphic) {
        heroGraphic.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.5}px)`;
    }

    floatingElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Feature link interactions
document.querySelectorAll('.feature-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(108, 142, 255, 0.5);
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        const rect = link.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;

        link.style.position = 'relative';
        link.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Add animation for ripple
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Log page load performance
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);

    if (konamiCode.join(',').includes(konamiPattern.join(','))) {
        document.body.style.animation = 'rainbow 2s infinite';
        
        if (!document.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAnimations,
        initializeScrollEffects,
        initializeTimeline,
        initializePortfolioCards,
        initializeSmoothScroll,
        initializeAccessibility
    };
}
