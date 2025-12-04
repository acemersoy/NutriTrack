// NutriTrack - Swipe Navigation (Mobil Geçiş Sistemi)
// Touch events ile sayfalar arası kaydırma

class SwipeNavigation {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.minSwipeDistance = 50; // Minimum kaydırma mesafesi (px)
        this.maxVerticalDistance = 100; // Maksimum dikey hareket
        
        // Sayfa sırası (navigation menüsündeki sıra)
        this.pages = [
            { name: 'index', path: 'index.html', title: 'Ana Sayfa' },
            { name: 'nutrition', path: 'nutrition.html', title: 'Besin Takibi' },
            { name: 'recipes', path: 'recipes.html', title: 'Tariflerim' },
            { name: 'profile', path: 'profile.html', title: 'Profil' },
            { name: 'progress', path: 'progress.html', title: 'İlerleme' }
        ];
        
        this.init();
    }

    init() {
        // Touch event listener'ları ekle
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Swipe indicator'ı ekle
        this.createSwipeIndicator();
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        // Swipe indicator göster
        const currentX = e.touches[0].clientX;
        const diffX = currentX - this.startX;
        
        if (Math.abs(diffX) > 30) {
            this.showSwipeIndicator(diffX > 0 ? 'right' : 'left');
        }
    }

    handleTouchEnd(e) {
        this.endX = e.changedTouches[0].clientX;
        this.endY = e.changedTouches[0].clientY;
        
        this.handleSwipe();
        this.hideSwipeIndicator();
    }

    handleSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;
        
        // Dikey hareket çok fazlaysa, kaydırma olarak sayma (scroll olabilir)
        if (Math.abs(deltaY) > this.maxVerticalDistance) {
            return;
        }
        
        // Yatay hareket yeterince büyük mü?
        if (Math.abs(deltaX) < this.minSwipeDistance) {
            return;
        }
        
        // Şu anki sayfa
        const currentPage = this.getCurrentPage();
        const currentIndex = this.pages.findIndex(p => p.name === currentPage);
        
        if (currentIndex === -1) return;
        
        // Sağa kaydırma (önceki sayfa)
        if (deltaX > 0 && currentIndex > 0) {
            this.navigateToPage(this.pages[currentIndex - 1]);
        }
        // Sola kaydırma (sonraki sayfa)
        else if (deltaX < 0 && currentIndex < this.pages.length - 1) {
            this.navigateToPage(this.pages[currentIndex + 1]);
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        
        // Dosya adından sayfa adını al
        if (filename.includes('nutrition')) return 'nutrition';
        if (filename.includes('recipes')) return 'recipes';
        if (filename.includes('profile')) return 'profile';
        if (filename.includes('progress')) return 'progress';
        return 'index';
    }

    navigateToPage(page) {
        // Vibration feedback
        this.vibrate();
        
        // Smooth transition efekti
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';
        
        // Bildirim göster
        this.showNavigationToast(page.title);
        
        setTimeout(() => {
            window.location.href = page.path;
        }, 200);
    }

    showNavigationToast(pageTitle) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(102, 126, 234, 0.95);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            animation: slideUpFade 0.3s ease;
        `;
        toast.textContent = `📱 ${pageTitle} sayfasına gidiliyor...`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 300);
    }

    createSwipeIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'swipeIndicator';
        indicator.className = 'swipe-indicator';
        
        // CSS stilleri
        const style = document.createElement('style');
        style.textContent = `
            .swipe-indicator {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(102, 126, 234, 0.95);
                color: white;
                padding: 15px 20px;
                border-radius: 50px;
                font-size: 1.2rem;
                font-weight: 600;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                pointer-events: none;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                display: flex;
                align-items: center;
                gap: 10px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            [data-theme="dark"] .swipe-indicator {
                background: rgba(138, 158, 255, 0.95);
                box-shadow: 0 8px 24px rgba(138, 158, 255, 0.5);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .swipe-indicator.active {
                opacity: 1;
            }

            .swipe-indicator-icon {
                font-size: 1.5rem;
                animation: swipeArrow 0.8s ease-in-out infinite;
            }

            @keyframes swipeArrow {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(5px); }
            }

            .swipe-indicator.left .swipe-indicator-icon {
                animation: swipeArrowLeft 0.8s ease-in-out infinite;
            }

            @keyframes swipeArrowLeft {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(-5px); }
            }

            @keyframes slideUpFade {
                from { 
                    opacity: 0; 
                    transform: translate(-50%, 20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translate(-50%, 0); 
                }
            }

            /* Mobil için optimize edilmiş */
            @media (max-width: 768px) {
                .swipe-indicator {
                    font-size: 1rem;
                    padding: 12px 18px;
                }
            }

            /* Desktop'ta gizle - sadece mobilde göster */
            @media (min-width: 1025px) {
                .swipe-indicator {
                    display: none !important;
                }
            }
        `;
        
        if (!document.getElementById('swipeIndicatorStyles')) {
            style.id = 'swipeIndicatorStyles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(indicator);
    }

    showSwipeIndicator(direction) {
        const indicator = document.getElementById('swipeIndicator');
        if (!indicator) return;
        
        const currentPage = this.getCurrentPage();
        const currentIndex = this.pages.findIndex(p => p.name === currentPage);
        
        let targetPage = null;
        let icon = '';
        
        if (direction === 'right' && currentIndex > 0) {
            targetPage = this.pages[currentIndex - 1];
            icon = '<i class="fas fa-arrow-left swipe-indicator-icon"></i>';
            indicator.style.left = '20px';
            indicator.style.right = 'auto';
            indicator.classList.remove('right');
            indicator.classList.add('left');
        } else if (direction === 'left' && currentIndex < this.pages.length - 1) {
            targetPage = this.pages[currentIndex + 1];
            icon = '<i class="fas fa-arrow-right swipe-indicator-icon"></i>';
            indicator.style.right = '20px';
            indicator.style.left = 'auto';
            indicator.classList.remove('left');
            indicator.classList.add('right');
        }
        
        if (targetPage) {
            if (direction === 'right') {
                indicator.innerHTML = `${icon} <span>${targetPage.title}</span>`;
            } else {
                indicator.innerHTML = `<span>${targetPage.title}</span> ${icon}`;
            }
            indicator.classList.add('active');
        }
    }

    hideSwipeIndicator() {
        const indicator = document.getElementById('swipeIndicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    // Vibration feedback (destekleyen cihazlarda)
    vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // 50ms titreşim
        }
    }
}

// Sadece mobil cihazlarda aktif et
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Sayfa yüklendiğinde swipe navigation'ı başlat
    window.addEventListener('DOMContentLoaded', () => {
        new SwipeNavigation();
        console.log('📱 Swipe Navigation aktif! Sağa/sola kaydırarak sayfalar arası geçiş yapabilirsiniz.');
    });
}

