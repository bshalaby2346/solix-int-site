/* Simplified email functionality using FormSubmit - no limits, no registration */

/* FormSubmit handles email sending automatically - just point to your Hostinger email */

/* Initialize all functionality when DOM is ready */
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ FormSubmit forms initialized - unlimited emails, no registration required!');
  console.log('📊 Logo version: Using optical logo with improved cropping');
  
  // Add delay to ensure logo loads for metrics
  setTimeout(function() {
    debugLogoMetrics();
  }, 1000);
  
  headerInit();
  smoothScrollInit();
  mobileMenuInit();
  formsInit();
});

/* Header scroll class */
function headerInit() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

/* Smooth scroll via CSS; JS only closes the mobile menu */
function smoothScrollInit() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
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

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  menu.addEventListener('click', function (e) { e.stopPropagation(); });

  if (backdrop) {
    ['click', 'touchstart', 'pointerdown'].forEach(function (evt) {
      backdrop.addEventListener(evt, function (e) {
        e.preventDefault();
        closeMobileMenu();
      }, { passive: true });
    });
  }

  ['click', 'touchstart', 'pointerdown'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (menu.classList.contains('hidden')) return;
      var target = e.target;
      if (menu.contains(target) || btn.contains(target)) return;
      closeMobileMenu();
    }, true);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  document.addEventListener('focusin', function (e) {
    if (menu.classList.contains('hidden')) return;
    var t = e.target;
    if (menu.contains(t) || btn.contains(t)) return;
    closeMobileMenu();
  });

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

/* Forms - Now using FormSubmit for unlimited emails */
function formsInit() {
  // Monthly dropdown functionality for quote form
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    var deliveryFrequency = quoteForm.querySelector('#delivery_frequency');
    var monthlyDurationWrap = document.getElementById('monthly-duration');
    var monthlyDuration = quoteForm.querySelector('#monthly_duration');
    
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
  
  console.log('✅ Forms initialized with FormSubmit - unlimited emails!');
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