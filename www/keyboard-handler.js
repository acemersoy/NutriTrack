/**
 * Keyboard Handler - Navbar'ı klavye açılınca gizler
 * Hem Capacitor hem de Pure JS fallback desteği
 */

(function() {
    'use strict';

    // Capacitor Keyboard Plugin ile (Profesyonel Yöntem)
    function initCapacitorKeyboard() {
        // Capacitor'un yüklenip yüklenmediğini kontrol et
        if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.Keyboard) {
            const Keyboard = Capacitor.Plugins.Keyboard;

            // Klavye açılınca
            Keyboard.addListener('keyboardWillShow', (info) => {
                document.body.classList.add('keyboard-open');
                console.log('Keyboard opened (Capacitor)', info);
            });

            // Klavye kapanınca
            Keyboard.addListener('keyboardWillHide', () => {
                document.body.classList.remove('keyboard-open');
                console.log('Keyboard closed (Capacitor)');
            });

            return true; // Capacitor başarıyla yüklendi
        }
        return false; // Capacitor yok, fallback kullan
    }

    // Pure JS Fallback (Amele Yöntemi)
    function initPureJSKeyboard() {
        let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        let isKeyboardOpen = false;

        // Visual Viewport API (Modern tarayıcılar)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', function() {
                const currentHeight = window.visualViewport.height;
                const heightDifference = initialViewportHeight - currentHeight;

                // Klavye genellikle 150px'den fazla yükseklik azaltır
                if (heightDifference > 150 && !isKeyboardOpen) {
                    isKeyboardOpen = true;
                    document.body.classList.add('keyboard-open');
                    console.log('Keyboard opened (Visual Viewport)', heightDifference);
                } else if (heightDifference <= 50 && isKeyboardOpen) {
                    isKeyboardOpen = false;
                    document.body.classList.remove('keyboard-open');
                    console.log('Keyboard closed (Visual Viewport)');
                }
            });
        } else {
            // Fallback: window resize + focus/blur events
            let lastWindowHeight = window.innerHeight;
            let activeElement = null;

            // Input focus olduğunda
            document.addEventListener('focusin', function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    activeElement = e.target;
                    setTimeout(() => {
                        const currentHeight = window.innerHeight;
                        if (currentHeight < lastWindowHeight - 150) {
                            isKeyboardOpen = true;
                            document.body.classList.add('keyboard-open');
                            console.log('Keyboard opened (Focus)', currentHeight);
                        }
                    }, 300); // Klavye animasyonu için bekle
                }
            });

            // Input blur olduğunda
            document.addEventListener('focusout', function(e) {
                if (e.target === activeElement) {
                    setTimeout(() => {
                        const currentHeight = window.innerHeight;
                        if (currentHeight >= lastWindowHeight - 50) {
                            isKeyboardOpen = false;
                            document.body.classList.remove('keyboard-open');
                            console.log('Keyboard closed (Blur)', currentHeight);
                        }
                        lastWindowHeight = currentHeight;
                    }, 300);
                }
            });

            // Window resize fallback
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const currentHeight = window.innerHeight;
                    const heightDifference = lastWindowHeight - currentHeight;

                    if (heightDifference > 150 && !isKeyboardOpen) {
                        isKeyboardOpen = true;
                        document.body.classList.add('keyboard-open');
                        console.log('Keyboard opened (Resize)', heightDifference);
                    } else if (heightDifference <= 50 && isKeyboardOpen) {
                        isKeyboardOpen = false;
                        document.body.classList.remove('keyboard-open');
                        console.log('Keyboard closed (Resize)');
                    }

                    lastWindowHeight = currentHeight;
                }, 100);
            });
        }
    }

    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Önce Capacitor'ı dene
            if (!initCapacitorKeyboard()) {
                // Capacitor yoksa Pure JS kullan
                initPureJSKeyboard();
            }
        });
    } else {
        // Sayfa zaten yüklü
        if (!initCapacitorKeyboard()) {
            initPureJSKeyboard();
        }
    }

    // Export for manual initialization if needed
    window.KeyboardHandler = {
        init: function() {
            if (!initCapacitorKeyboard()) {
                initPureJSKeyboard();
            }
        }
    };
})();

