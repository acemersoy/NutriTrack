// NutriTrack - Smooth Scroll Enhancement
// Gelişmiş smooth scroll özellikleri

class SmoothScrollManager {
    constructor() {
        this.scrollThreshold = 300; // "Scroll to top" butonu için scroll mesafesi
        this.init();
    }

    init() {
        this.createScrollToTopButton();
        this.setupScrollListeners();
        this.setupAnchorLinks();
    }

    // "Scroll to Top" butonu oluştur
    createScrollToTopButton() {
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'Yukarı kaydır');
        button.title = 'Yukarı kaydır';
        
        // CSS stilleri
        const style = document.createElement('style');
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 998;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
            }

            .scroll-to-top:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
            }

            .scroll-to-top:active {
                transform: translateY(-3px) scale(1.05);
            }

            [data-theme="dark"] .scroll-to-top {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.6);
            }

            /* Animasyon */
            @keyframes bounceUp {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }

            .scroll-to-top.bounce {
                animation: bounceUp 1s ease;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 80px;
                    right: 15px;
                    width: 45px;
                    height: 45px;
                    font-size: 1rem;
                }
            }
        `;
        
        if (!document.getElementById('scrollToTopStyles')) {
            style.id = 'scrollToTopStyles';
            document.head.appendChild(style);
        }
        
        // Click event
        button.addEventListener('click', () => this.scrollToTop());
        
        document.body.appendChild(button);
    }

    // Scroll event listener'ları
    setupScrollListeners() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            // Debounce scroll event (performans için)
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 100);
        }, { passive: true });
    }

    // Scroll durumunu kontrol et
    handleScroll() {
        const button = document.getElementById('scrollToTop');
        if (!button) return;

        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrolled > this.scrollThreshold) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }

    // Yukarı kaydır (smooth)
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Haptic feedback (destekleyen cihazlarda)
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }

        // Bounce animasyonu
        const button = document.getElementById('scrollToTop');
        if (button) {
            button.classList.add('bounce');
            setTimeout(() => button.classList.remove('bounce'), 1000);
        }
    }

    // Anchor linkleri için smooth scroll
    setupAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Sadece # ile başlayanlar (sayfa içi linkler)
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    this.scrollToTop();
                    return;
                }
                
                // Diğer anchor linkler için
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Programatik scroll to element
    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Scroll reveal animasyonları (opsiyonel)
    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // .reveal class'ına sahip elementleri gözlemle
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

// Smooth scroll manager'ı başlat
window.addEventListener('DOMContentLoaded', () => {
    const smoothScroll = new SmoothScrollManager();
    console.log('✨ Smooth scroll aktif!');
    
    // Global erişim için (opsiyonel)
    window.smoothScroll = smoothScroll;
});

// Scroll reveal için CSS
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    /* Hareket azaltma tercihi */
    @media (prefers-reduced-motion: reduce) {
        .reveal {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;
document.head.appendChild(revealStyle);

