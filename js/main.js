/* Direct mailto functionality for forms */
console.log('🚨 JAVASCRIPT LOADED - Version: 2025-10-15-TEST');

function formsInit() {
  console.log('🚨 formsInit() called - forms should be initializing!');
  quoteFormInit();
  contactFormInit();
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
  // Forms initialization without EmailJS
  quoteFormInit();
  contactFormInit();
}

function quoteFormInit() {
  var form = document.getElementById('quote-form');
  var success = document.getElementById('quote-success');
  if (!form) {
    console.log('Quote form not found');
    return;
  }
  console.log('Quote form found, initializing...');

  var deliveryFrequency = form.querySelector('#delivery_frequency');
  var monthlyDurationWrap = document.getElementById('monthly-duration');
  var monthlyDuration = form.querySelector('#monthly_duration');

  if (deliveryFrequency && monthlyDurationWrap && monthlyDuration) {
    console.log('Monthly dropdown elements found, setting up listener...');
    deliveryFrequency.addEventListener('change', function () {
      console.log('Delivery frequency changed to:', this.value);
      if (this.value === 'monthly') {
        monthlyDurationWrap.classList.remove('hidden');
        monthlyDuration.required = true;
        console.log('Monthly selected - showing duration dropdown');
      } else {
        monthlyDurationWrap.classList.add('hidden');
        monthlyDuration.required = false;
        monthlyDuration.value = '';
        console.log('Non-monthly selected - hiding duration dropdown');
      }
    });
  } else {
    console.log('Monthly dropdown elements missing:', {
      deliveryFrequency: !!deliveryFrequency,
      monthlyDurationWrap: !!monthlyDurationWrap,
      monthlyDuration: !!monthlyDuration
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
      to_email: 'Info@solix-int.com', // Official company email
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

    // Direct mailto functionality
    var subject = 'Quote Request from ' + payload.company + ' - ' + qty.toLocaleString() + ' tons';
    var body = buildQuoteEmailBody(payload, total);
    var mailto = 'mailto:Info@solix-int.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    
    if (confirm('This will open your email client to send the quote request. Click OK to proceed.')) {
      window.location.href = mailto;
      form.classList.add('hidden');
      success.classList.remove('hidden');
      setTimeout(function() {
        form.reset();
        form.classList.remove('hidden');
        success.classList.add('hidden');
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
        if (monthlyDurationWrap) monthlyDurationWrap.classList.add('hidden');
      }, 6000);
    } else {
      // User cancelled, re-enable the button
      submitBtn.innerHTML = original;
      submitBtn.disabled = false;
    }
  });
}

function contactFormInit() {
  var form = document.getElementById('contact-form');
  var success = document.getElementById('contact-success');
  if (!form) {
    console.log('Contact form not found');
    return;
  }
  console.log('Contact form found, initializing...');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('button[type="submit"]');
    console.log('Contact form submit clicked, submit button found:', !!submitBtn);
    if (!submitBtn) {
      console.log('Contact form: No submit button found!');
      return;
    }
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
      to_email: 'Info@solix-int.com', // Official company email
      from_name: payload.name,
      from_email: payload.email,
      subject: payload.subject,
      message: payload.message,
      timestamp: payload.timestamp,
      message_type: 'Contact Inquiry',
    };

    // Direct email functionality using mailto
    var subject = 'Website Contact: ' + payload.subject;
    var body = 'MESSAGE FROM: ' + payload.name + ' <' + payload.email + '>\n\n' +
               'SUBJECT: ' + payload.subject + '\n\n' +
               'MESSAGE:\n' + payload.message + '\n\n' +
               'Submitted: ' + payload.timestamp + '\n' +
               '---\n' +
               'Sent via Solix website.';
    
    var mailto = 'mailto:Info@solix-int.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    
    if (confirm('This will open your email client to send the message to Info@solix-int.com. Click OK to proceed.')) {
      window.location.href = mailto;
      form.classList.add('hidden');
      success.classList.remove('hidden');
      setTimeout(function() {
        form.reset();
        form.classList.remove('hidden');
        success.classList.add('hidden');
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
      }, 5000);
    } else {
      // User cancelled, re-enable the button
      submitBtn.innerHTML = original;
      submitBtn.disabled = false;
    }
  });
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
        box: { w: Math.round(rect.width), h: Math.round(rect.height) },
        clipPath: cs.clipPath,
        objectFit: cs.objectFit
      });
    }
    if (img.complete) report(); else img.addEventListener('load', report);
  } catch (e) { console.log('LOGO metrics error:', e && e.message); }
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

/* Initialize all functionality when DOM is ready */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚨 DOMContentLoaded fired - initializing all functionality!');
  headerInit();
  smoothScrollInit();
  mobileMenuInit();
  formsInit();
  debugLogoMetrics();
  
  // Add a visible test indicator
  var testDiv = document.createElement('div');
  testDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;z-index:9999;font-size:16px;font-weight:bold;';
  testDiv.innerHTML = '🚨 JS ACTIVE - v2025-10-15';
  document.body.appendChild(testDiv);
  console.log('🚨 Test indicator added to page!');
});