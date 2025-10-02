/* Minimal, reliable JS for nav, smooth scroll, forms (EmailJS + mailto fallback) */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    headerInit();
    smoothScrollInit();
    mobileMenuInit();
    logoFallbackInit();
    formsInit();
    console.log('Solix initialized');
  }

  /* Ensure header logo loads; fall back to alternate assets if primary fails */
  function logoFallbackInit() {
    var img = document.getElementById('site-logo');
    if (!img) return;
    var candidates = [
      (document.getElementById('site-logo')?.getAttribute('data-preferred') || 'images/solix-logo-header.png'),
      'images/solix-logo-standard.png',
      'images/solix-logo.png',
      'images/solix-logo-dark.png'
    ];
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

  /* Forms */
  function formsInit() {
    // Initialize EmailJS (safe even if key missing)
    try {
      emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });
    } catch (_) {}

    quoteFormInit();
    contactFormInit();
  }

  function quoteFormInit() {
    var form = document.getElementById('quote-form');
    var success = document.getElementById('quote-success');
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

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var original = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;

      var data = new FormData(form);
      var payload = {
        company: data.get('company'),
        contactPerson: data.get('contact_person'),
        email: data.get('email'),
        phone: data.get('phone') || 'Not provided',
        productType: data.get('product_type'),
        cementGrade: data.get('cement_grade') || 'Not specified',
        packagingType: data.get('packaging_type'),
        quantity: data.get('quantity'),
        deliveryFrequency: data.get('delivery_frequency'),
        monthlyDuration: data.get('monthly_duration') || 'N/A',
        destination: data.get('destination'),
        timeline: data.get('timeline') || 'Not specified',
        notes: data.get('notes') || 'No additional notes',
        timestamp: new Date().toLocaleString(),
      };

      var qty = parseInt(payload.quantity || '0', 10) || 0;
      var months = parseInt(payload.monthlyDuration || '0', 10) || 0;
      var total = payload.deliveryFrequency === 'monthly' && months > 0 ? qty * months : qty;

      var templateParams = {
        to_email: 'Info@solixtrd.com',
        from_name: payload.contactPerson,
        from_email: payload.email,
        company_name: payload.company,
        phone: payload.phone,
        product_type: payload.productType,
        cement_grade: payload.cementGrade,
        packaging_type: payload.packagingType,
        quantity: qty.toLocaleString(),
        delivery_frequency: payload.deliveryFrequency,
        monthly_duration: payload.monthlyDuration,
        total_quantity: total.toLocaleString(),
        destination: payload.destination,
        timeline: payload.timeline,
        notes: payload.notes,
        timestamp: payload.timestamp,
        subject: 'Quote Request from ' + payload.company + ' - ' + qty.toLocaleString() + ' tons',
        message_type: 'Quote Request',
      };

      emailjs
        .send('YOUR_SERVICE_ID', 'YOUR_QUOTE_TEMPLATE_ID', templateParams)
        .then(function () {
          form.classList.add('hidden');
          success.classList.remove('hidden');
          setTimeout(reset, 5000);
        })
        .catch(function () {
          // Fallback: mailto
          var subject = 'Quote Request from ' + payload.company + ' - ' + qty.toLocaleString() + ' tons';
          var body = buildQuoteEmailBody(payload, total);
          var mailto = 'mailto:Info@solixtrd.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          if (confirm('Connection issue. Click OK to send via your email client.')) {
            window.location.href = mailto;
          }
          form.classList.add('hidden');
          success.classList.remove('hidden');
          setTimeout(reset, 6000);
        });

      function reset() {
        form.reset();
        form.classList.remove('hidden');
        success.classList.add('hidden');
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
        if (monthlyDurationWrap) monthlyDurationWrap.classList.add('hidden');
      }
    });
  }

  function contactFormInit() {
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var original = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      var data = new FormData(form);
      var payload = {
        name: data.get('name'),
        email: data.get('email'),
        subject: data.get('subject') || 'General Inquiry',
        message: data.get('message'),
        timestamp: new Date().toLocaleString(),
      };

      var templateParams = {
        to_email: 'Info@solixtrd.com',
        from_name: payload.name,
        from_email: payload.email,
        subject: payload.subject,
        message: payload.message,
        timestamp: payload.timestamp,
        message_type: 'Contact Inquiry',
      };

      emailjs
        .send('YOUR_SERVICE_ID', 'YOUR_CONTACT_TEMPLATE_ID', templateParams)
        .then(function () {
          form.classList.add('hidden');
          success.classList.remove('hidden');
          setTimeout(reset, 3000);
        })
        .catch(function () {
          var subject = 'Website Contact: ' + payload.subject;
          var body = 'MESSAGE FROM: ' + payload.name + ' <' + payload.email + '>\n\nSUBJECT: ' + payload.subject + '\n\nMESSAGE:\n' + payload.message + '\n\nSubmitted: ' + payload.timestamp + '\n---\nSent via Solix website.';
          var mailto = 'mailto:Info@solixtrd.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          if (confirm('Connection issue. Click OK to send via your email client.')) {
            window.location.href = mailto;
          }
          form.classList.add('hidden');
          success.classList.remove('hidden');
          setTimeout(reset, 5000);
        });

      function reset() {
        form.reset();
        form.classList.remove('hidden');
        success.classList.add('hidden');
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
      }
    });
  }

  function buildQuoteEmailBody(q, total) {
    return (
      'QUOTE REQUEST' +
      '\n========================\n\n' +
      'COMPANY INFORMATION:' +
      '\n- Company: ' +
      q.company +
      '\n- Contact Person: ' +
      q.contactPerson +
      '\n- Email: ' +
      q.email +
      '\n- Phone: ' +
      q.phone +
      '\n\nPROJECT DETAILS:' +
      '\n- Product Type: ' +
      q.productType +
      '\n- Cement Grade: ' +
      q.cementGrade +
      '\n- Packaging Type: ' +
      q.packagingType +
      '\n- Quantity: ' +
      parseInt(q.quantity || '0', 10).toLocaleString() +
      ' tons' +
      '\n- Delivery Frequency: ' +
      q.deliveryFrequency +
      '\n- Contract Duration: ' +
      q.monthlyDuration +
      '\n- Total Project Volume: ' +
      total.toLocaleString() +
      ' tons' +
      '\n- Destination: ' +
      q.destination +
      '\n- Timeline: ' +
      q.timeline +
      '\n\nADDITIONAL NOTES:\n' +
      q.notes +
      '\n\nSubmitted: ' +
      q.timestamp +
      '\n---\nSent via Solix website.'
    );
  }
})();
