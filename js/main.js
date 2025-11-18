/* Minimal, reliable JS for nav, smooth scroll, forms (FormSubmit + success handling) */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    headerInit();
    smoothScrollInit();
    mobileMenuInit();
    logoFallbackInit();
    formsInit();
    debugLogoMetrics();
    console.log('Solix initialized');
    
    // Handle form success redirects
    handleFormSuccess();
  }

  /* Handle form success from FormSubmit redirect */
  function handleFormSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Check if we came from quote form
      if (window.location.hash.includes('quote')) {
        const form = document.getElementById('quote-form');
        const success = document.getElementById('quote-success');
        if (form && success) {
          form.classList.add('hidden');
          success.classList.remove('hidden');
          setTimeout(() => {
            form.classList.remove('hidden');
            success.classList.add('hidden');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          }, 5000);
        }
      }
      // Check if we came from contact form
      if (window.location.hash.includes('contact')) {
        const form = document.getElementById('contact-form');
        const success = document.getElementById('contact-success');
        if (form && success) {
          form.classList.add('hidden');
          success.classList.remove('hidden');
          setTimeout(() => {
            form.classList.remove('hidden');
            success.classList.add('hidden');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          }, 3000);
        }
      }
    }
  }

  /* Ensure header logo loads; fall back to alternate assets if primary fails */
  function logoFallbackInit() {
    var img = document.getElementById('site-logo');
    if (!img) return; // logo removed per request
    var candidates = [];
    var idx = 0;
    function tryNext() {
      if (idx >= candidates.length) return;
      img.src = candidates[idx++];
    }
    // If current src isn't in candidates, put it first
    var current = img.getAttribute('src');
    if (current && candidates.indexOf(current) !== 0) {
      candidates.unshift(current);
    }
    img.addEventListener('error', function () {
      tryNext();
    });
    // If the image loaded but zero naturalWidth (rare), try fallback
    if (!img.complete) return; // will trigger load/error later
    if (img.naturalWidth === 0) tryNext();
  }

  /* Header scroll class (no blur, just a subtle state if needed) */
  function headerInit() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 8) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  }

  /* Smooth scroll via CSS; JS only closes the mobile menu after click */
  function smoothScrollInit() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        // Let the browser handle scrolling (CSS: html { scroll-behavior: smooth })
        // We only close the mobile menu.
        closeMobileMenu();
      });
    });
  }

  /* Mobile menu */
  function mobileMenuInit() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-popover');
    var backdrop = document.getElementById('mobile-backdrop');
    if (!btn || !menu) return;

    function toggleMenu() {
      var isHidden = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
      var icon = btn.querySelector('i');
      if (icon) icon.className = isHidden ? 'fas fa-bars text-lg' : 'fas fa-xmark text-lg';
      if (backdrop) {
        if (isHidden) backdrop.classList.add('hidden');
        else backdrop.classList.remove('hidden');
      }
    }

    // Toggle on button click, but don't let the click bubble to the outside-click handler
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Prevent clicks inside the menu from closing it via the document handler
    menu.addEventListener('click', function (e) { e.stopPropagation(); });

    // Backdrop click/tap closes the menu
    if (backdrop) {
      ['click', 'touchstart', 'pointerdown'].forEach(function (evt) {
        backdrop.addEventListener(evt, function (e) {
          e.preventDefault();
          closeMobileMenu();
        }, { passive: true });
      });
    }

    // Fallback: Click/tap outside closes the menu
    ['click', 'touchstart', 'pointerdown'].forEach(function (evt) {
      document.addEventListener(evt, function (e) {
        if (menu.classList.contains('hidden')) return;
        var target = e.target;
        if (menu.contains(target) || btn.contains(target)) return;
        closeMobileMenu();
      }, true); // capture to beat other handlers
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Close when focus moves outside the button or menu (keyboard users)
    document.addEventListener('focusin', function (e) {
      if (menu.classList.contains('hidden')) return;
      var t = e.target;
      if (menu.contains(t) || btn.contains(t)) return;
      closeMobileMenu();
    });

    // Auto-close after selecting a link
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function(){ closeMobileMenu(); });
    });
  }

  function closeMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-popover');
    var backdrop = document.getElementById('mobile-backdrop');
    if (!btn || !menu) return;
    menu.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    var icon = btn.querySelector('i');
    if (icon) icon.className = 'fas fa-bars text-lg';
  }

  /* Forms - FormSubmit handles submission, we just handle dynamic fields */
  function formsInit() {
    quoteFormInit();
    contactFormInit();
  }

  function quoteFormInit() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var deliveryFrequency = form.querySelector('#delivery_frequency');
    var monthlyDurationWrap = document.getElementById('monthly-duration');
    var monthlyDuration = form.querySelector('#monthly_duration');

    if (deliveryFrequency && monthlyDurationWrap && monthlyDuration) {
      deliveryFrequency.addEventListener('change', function () {
        if (this.value === 'monthly') {
          monthlyDurationWrap.classList.remove('hidden');
          monthlyDuration.required = true;
        } else {
          monthlyDurationWrap.classList.add('hidden');
          monthlyDuration.required = false;
          monthlyDuration.value = '';
        }
      });
    }
  }

  function contactFormInit() {
    // No special handling needed for contact form
  }

  function debugLogoMetrics() {
    try {
      var img = document.getElementById('site-logo');
      if (!img) { console.log('LOGO metrics: no #site-logo element'); return; }
      function report(){
        var cs = getComputedStyle(img);
        var rect = img.getBoundingClientRect();
        console.log('LOGO metrics:', {
          src: img.currentSrc || img.src,
          natural: { w: img.naturalWidth, h: img.naturalHeight },
          css: { height: cs.height, width: cs.width },
          box: { w: Math.round(rect.width), h: Math.round(rect.height) }
        });
      }
      if (img.complete) report(); else img.addEventListener('load', report);
    } catch (e) { console.log('LOGO metrics error:', e && e.message); }
  }
})();