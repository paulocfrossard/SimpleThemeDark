/**
 * SimpleThemeDark — Material Design 3 Animations
 * Vanilla JS animation system for Jellyfin themes.
 * @version 1.0.0
 * @license MIT
 */
(function () {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        selectors: {
            ripple: '.emby-button, .paper-icon-button-light, .fab, .detailButton, .listItem',
            card: '.card',
            header: '.skinHeader',
            mainDrawer: '.mainDrawer',
            scrollContainer: '#reactRoot, main, .mainDrawerContent',
            themeToggle: '[data-theme-toggle], .theme-toggle',
        },
        ripple: {
            className: 'std-ripple',
            activeClass: 'std-ripple-active',
            duration: 500,
        },
        cardHover: {
            translateY: '-4px',
            duration: 200,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
        },
        scrollHeader: {
            hideThreshold: 10,
            debounceMs: 16,
        },
        scrollReveal: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            visibleClass: 'std-visible',
        },
        headerHiddenClass: 'std-header-hidden',
        headerVisibleClass: 'std-header-visible',
    };

    // --- Utilities ---

    /**
     * Check if the user prefers reduced motion, at init AND on change.
     */
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
        reducedMotion = e.matches;
    });

    /**
     * Throttle: limits function calls to at most once per `delay` ms.
     */
    function throttle(fn, delay) {
        var lastCall = 0;
        var timerId = null;
        return function () {
            var now = Date.now();
            var remaining = delay - (now - lastCall);
            var context = this;
            var args = arguments;
            if (remaining <= 0) {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                lastCall = now;
                fn.apply(context, args);
            } else if (!timerId) {
                timerId = setTimeout(function () {
                    lastCall = Date.now();
                    timerId = null;
                    fn.apply(context, args);
                }, remaining);
            }
        };
    }

    /**
     * Debounce: delays function call until `delay` ms after the last invocation.
     */
    function debounce(fn, delay) {
        var timerId = null;
        return function () {
            var context = this;
            var args = arguments;
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(function () {
                timerId = null;
                fn.apply(context, args);
            }, delay);
        };
    }

    /**
     * Safely query-selector wrapper that returns empty NodeList on missing root.
     */
    function qsa(selector, root) {
        return (root || document).querySelectorAll(selector);
    }

    // --- Ripple Effect (MD3 signature) ---

    function initRipple() {
        var container = document.body;
        if (!container) return;

        container.addEventListener('pointerdown', function (e) {
            if (reducedMotion) return;

            var target = e.target.closest(CONFIG.selectors.ripple);
            if (!target) return;

            // Ensure the target can contain positioned children
            var position = window.getComputedStyle(target).position;
            if (position === 'static') {
                target.style.position = 'relative';
            }
            target.style.overflow = 'hidden';

            var rect = target.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var size = Math.max(rect.width, rect.height) * 2;

            var ripple = document.createElement('span');
            ripple.className = CONFIG.ripple.className;
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            target.appendChild(ripple);

            // Force reflow so the initial state is rendered before adding the active class
            void ripple.offsetWidth;
            ripple.classList.add(CONFIG.ripple.activeClass);

            setTimeout(function () {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, CONFIG.ripple.duration);
        });
    }

    // --- Card Hover Lift ---

    function initCardHover() {
        if (reducedMotion) return;

        var cardStyle = 'translateY(' + CONFIG.cardHover.translateY + ')';
        var duration = CONFIG.cardHover.duration + 'ms';
        var easing = CONFIG.cardHover.easing;

        function applyTransition(card) {
            card.style.transition = 'transform ' + duration + ' ' + easing;
        }

        function clearTransition(card) {
            card.style.transition = '';
        }

        document.addEventListener(
            'mouseenter',
            function (e) {
                var card = e.target.closest(CONFIG.selectors.card);
                if (!card) return;
                applyTransition(card);
                card.style.transform = cardStyle;
            },
            true
        );

        document.addEventListener(
            'mouseleave',
            function (e) {
                var card = e.target.closest(CONFIG.selectors.card);
                if (!card) return;
                applyTransition(card);
                card.style.transform = '';
                // Remove transition style after it completes to not interfere with other transforms
                setTimeout(function () {
                    clearTransition(card);
                }, CONFIG.cardHover.duration);
            },
            true
        );

        // Keyboard focus support
        document.addEventListener(
            'focusin',
            function (e) {
                var card = e.target.closest(CONFIG.selectors.card);
                if (!card) return;
                applyTransition(card);
                card.style.transform = cardStyle;
            },
            true
        );

        document.addEventListener(
            'focusout',
            function (e) {
                var card = e.target.closest(CONFIG.selectors.card);
                if (!card) return;
                applyTransition(card);
                card.style.transform = '';
                setTimeout(function () {
                    clearTransition(card);
                }, CONFIG.cardHover.duration);
            },
            true
        );
    }

    // --- Page Transition (View Transitions API) ---

    function initPageTransition() {
        var viewTransitionSupported = typeof document.startViewTransition === 'function';

        // Intercept link clicks for SPA-style transitions
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href]');
            if (!link) return;

            // Skip external links, new-tab links, modifier-key clicks
            if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (link.origin !== location.origin) return;
            if (link.hash && link.pathname === location.pathname) return;

            // Skip download links
            if (link.hasAttribute('download')) return;

            e.preventDefault();

            function navigate() {
                history.pushState(null, '', link.href);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }

            if (viewTransitionSupported && !reducedMotion) {
                document.startViewTransition(navigate);
            } else {
                navigate();
            }
        });

        // Handle back/forward
        window.addEventListener('popstate', function () {
            if (viewTransitionSupported && !reducedMotion) {
                document.startViewTransition(function () {
                    // Jellyfin handles the route change on popstate internally
                });
            }
        });
    }

    // --- Scroll-Linked Header ---

    function initScrollHeader() {
        if (reducedMotion) return;

        var lastScrollY = 0;
        var ticking = false;

        var header = document.querySelector(CONFIG.selectors.header);
        if (!header) return;

        function updateHeader() {
            var scrollContainer =
                document.querySelector(CONFIG.selectors.scrollContainer.split(',')[0]) ||
                document.scrollingElement;
            var currentScrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
            var delta = currentScrollY - lastScrollY;

            if (delta > CONFIG.scrollHeader.hideThreshold && currentScrollY > 80) {
                // Scrolling down
                header.classList.add(CONFIG.headerHiddenClass);
                header.classList.remove(CONFIG.headerVisibleClass);
            } else if (delta < -CONFIG.scrollHeader.hideThreshold) {
                // Scrolling up
                header.classList.remove(CONFIG.headerHiddenClass);
                header.classList.add(CONFIG.headerVisibleClass);
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        var throttledScroll = throttle(function () {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateHeader);
            }
        }, CONFIG.scrollHeader.debounceMs);

        // Try the main scroll container first, fallback to window
        var scrollTarget = document.querySelector(CONFIG.selectors.scrollContainer.split(',')[0]);
        if (scrollTarget) {
            scrollTarget.addEventListener('scroll', throttledScroll, { passive: true });
        } else {
            window.addEventListener('scroll', throttledScroll, { passive: true });
        }
    }

    // --- Intersection Observer: Fade-In on Scroll ---

    function initScrollReveal() {
        if (reducedMotion) return;

        var options = {
            threshold: CONFIG.scrollReveal.threshold,
            rootMargin: CONFIG.scrollReveal.rootMargin,
        };

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    entry.target.classList.add(CONFIG.scrollReveal.visibleClass);
                } else {
                    // Remove class to allow re-animation when scrolling back
                    entry.target.classList.remove(CONFIG.scrollReveal.visibleClass);
                }
            }
        }, options);

        function observeCards() {
            var cards = qsa(CONFIG.selectors.card);
            for (var i = 0; i < cards.length; i++) {
                if (!cards[i].hasAttribute('data-std-observed')) {
                    cards[i].setAttribute('data-std-observed', '1');
                    observer.observe(cards[i]);
                }
            }
        }

        // Initial observation
        observeCards();

        // MutationObserver for dynamically added cards (Jellyfin loads async)
        var mutationObserver = new MutationObserver(
            debounce(function () {
                observeCards();
            }, 100)
        );

        mutationObserver.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    // --- Theme Toggle with View Transition ---

    function initThemeToggle() {
        var toggle = document.querySelector(CONFIG.selectors.themeToggle);
        if (!toggle) return;

        var viewTransitionSupported = typeof document.startViewTransition === 'function';

        toggle.addEventListener('click', function (e) {
            e.preventDefault();

            function toggleTheme() {
                var html = document.documentElement;
                var current = html.getAttribute('data-theme');
                var next = current === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                try {
                    localStorage.setItem('std-theme', next);
                } catch (_) {
                    /* storage unavailable */
                }
            }

            if (viewTransitionSupported && !reducedMotion) {
                document.startViewTransition(toggleTheme);
            } else {
                toggleTheme();
            }
        });

        // Restore saved theme
        try {
            var saved = localStorage.getItem('std-theme');
            if (saved) {
                document.documentElement.setAttribute('data-theme', saved);
            }
        } catch (_) {
            /* storage unavailable */
        }
    }

    // --- Init ---

    function init() {
        initRipple();
        initCardHover();
        initPageTransition();
        initScrollHeader();
        initScrollReveal();
        initThemeToggle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
