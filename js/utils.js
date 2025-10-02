// Back-to-top button logic (small, safe)
(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.setAttribute('aria-label','Back to top');
    btn.style.position = 'fixed';
    btn.style.right = '16px';
    btn.style.bottom = '16px';
    btn.style.width = '42px';
    btn.style.height = '42px';
    btn.style.borderRadius = '9999px';
    btn.style.background = '#0ea5e9';
    btn.style.color = '#fff';
    btn.style.border = '0';
    btn.style.boxShadow = '0 10px 20px rgba(2,6,23,.2)';
    btn.style.display = 'none';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.zIndex = '1200';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function(){
      if (window.scrollY > 600) btn.style.display = 'flex';
      else btn.style.display = 'none';
    });
    btn.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  });
})();

// Desktop logo sizing: default to a stable, visually dominant size on PC.
// Dynamic auto-matching can be enabled later if desired (see notes below).
(function(){
  'use strict';
  function isDesktop(){ return window.matchMedia('(min-width:1024px)').matches; }

  // Safety: lock a stable desktop logo height immediately on load
  // to avoid any residual overrides from previous sessions/builds.
  window.addEventListener('load', function(){
    if (isDesktop()) {
      document.documentElement.style.setProperty('--logo-desktop', '260px');
    }
  });

  // Optional robust dynamic sizing (disabled by default)
  // If you want the header logo to scale relative to the first hero line,
  // set ENABLE_DYNAMIC_LOGO = true. We wait for fonts, measure reliably,
  // and clamp with a perceptual scale so it never becomes tiny.
  var ENABLE_DYNAMIC_LOGO = false; // set to true to enable

  if (ENABLE_DYNAMIC_LOGO) {
    var MIN = 160;          // never smaller than this
    var MAX = 280;          // soft ceiling
    var SCALE = 2.75;       // perceptual multiplier from line-height to logo height
    var OFFSET = 0;         // small bias if needed
    var resizeTimer = null;

    function measureAndSet() {
      if (!isDesktop()) return;
      var firstLine = document.querySelector('.hero-title span:first-child');
      if (!firstLine) return;
      var apply = function(){
        var rect = firstLine.getBoundingClientRect();
        var h = Math.max(1, Math.round(rect.height));
        // Convert line-height into perceived logo height
        var target = Math.round(h * SCALE + OFFSET);
        var clamped = Math.max(MIN, Math.min(MAX, target));
        document.documentElement.style.setProperty('--logo-desktop', clamped + 'px');
      };
      // Double RAF to ensure layout settled
      requestAnimationFrame(function(){ requestAnimationFrame(apply); });
    }

    function initDynamic() {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function(){ measureAndSet(); });
      } else {
        // Fallback: try shortly after load
        setTimeout(measureAndSet, 120);
      }
      window.addEventListener('resize', function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(measureAndSet, 140);
      });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initDynamic();
    } else {
      window.addEventListener('DOMContentLoaded', initDynamic);
    }
  }
})();
