// NutriTrack - Tema Yönetimi (Capacitor uyumlu)
// Bu script tüm sayfalarda kullanılır

(function() {
    'use strict';
    
    // Sayfa yüklendiğinde tema uygula (transition olmadan)
    function initTheme() {
        try {
            const savedTheme = localStorage.getItem('nutritrack_theme') || 'light';
            if (document.documentElement) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                // Transition'ı kapat - sadece kullanıcı etkileşiminde açılacak
                document.documentElement.classList.remove('theme-transition');
            }
        } catch(e) {
            console.warn('Tema yükleme hatası:', e);
            if (document.documentElement) {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    }
    
    // Tema değiştir (transition ile)
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme, true);
    }
    
    // Tema ayarla
    function setTheme(theme, enableTransition = false) {
        // Önce transition'ı kapat
        document.documentElement.classList.remove('theme-transition');
        
        if (enableTransition) {
            // Kısa bir gecikme ile transition'ı aktif et
            requestAnimationFrame(() => {
                document.documentElement.classList.add('theme-transition');
            });
            
            // Transition bittikten sonra class'ı kaldır
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 350); // 300ms transition + 50ms buffer
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nutritrack_theme', theme);
        
        // Icon'u güncelle
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Global fonksiyonlar
    window.toggleTheme = toggleTheme;
    window.setTheme = setTheme;
    
    // Sayfa yüklendiğinde çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Capacitor için ek kontrol
    if (window.Capacitor) {
        document.addEventListener('DOMContentLoaded', function() {
            document.documentElement.classList.remove('theme-transition');
        });
    }
})();

