/* ============================================================
   MAGELLAND EnT — Main JavaScript
   ============================================================ */

(function() {
  // ------------------------------------------------------------
  //  ⚙️  CONFIGURATION — EDIT ALL VALUES HERE
  // ------------------------------------------------------------
  const CONFIG = {
    // External purchase URL — every BUY NOW will open this in a new tab.
    purchaseUrl: "https://www.apisolution.net/agent?ref=120587",

    // WhatsApp number (digits only, with country code, no + or spaces)
    whatsappNumber: "233599641354",

    // Business phone number (display)
    phoneNumber: "+233 59 ",

    // Business email
    email: "imustbrich@yahoo.com",

    // Bundle configuration
    networks: [
      {
        name: "MTN",
        icon: "fa-signal",
        bundles: [
          { size: "1GB", price: 5, validity: "90 days" },
         
        ]
      },
      {
        name: "Telecel",
        icon: "fa-sim-card",
        bundles: [
          { size: "5GB", price: 25, validity: "90 days" },
          
        ]
      },
      {
        name: "AirtelTigo",
        icon: "fa-tower-cell",
        bundles: [
          { size: "1GB", price: 4.5, validity: "90 days" },
           
        ]
      }
    ]
  };

  // ------------------------------------------------------------
  //  RENDER BUNDLE CARDS
  // ------------------------------------------------------------
  function renderBundles() {
    const bundleGrid = document.getElementById('bundleGrid');
    
    if (!bundleGrid) {
      console.error('❌ bundleGrid element not found!');
      return;
    }

    console.log('✅ Rendering bundles...');

    let html = '';

    CONFIG.networks.forEach(network => {
      network.bundles.forEach(bundle => {
        const purchaseUrlWithParams = `${CONFIG.purchaseUrl}&network=${encodeURIComponent(network.name)}&data=${encodeURIComponent(bundle.size)}&price=${bundle.price}`;

        html += `
          <div class="bundle-card">
            <div class="network-badge">
              <i class="fas ${network.icon}"></i> ${network.name}
            </div>
            <div class="data-amount">${bundle.size}<small>data</small></div>
            <div class="price-row">
              <span class="price">GH₵${bundle.price}</span>
              <span class="price-currency">GHS</span>
            </div>
            <div class="validity"><i class="far fa-clock"></i> Valid for ${bundle.validity}</div>
            <button class="buy-now-btn" data-url="${purchaseUrlWithParams}">
              Buy Now <i class="fas fa-arrow-up-right-from-square"></i>
            </button>
          </div>
        `;
      });
    });

    bundleGrid.innerHTML = html;
    console.log('✅ Bundles rendered:', CONFIG.networks.length, 'networks');

    // Attach click listeners
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank');
        }
      });
    });
  }

  // ------------------------------------------------------------
  //  CONFIGURE CONTACT LINKS
  // ------------------------------------------------------------
  function configureContacts() {
    const waFloat = document.getElementById('floatWhatsapp');
    if (waFloat) waFloat.href = `https://wa.me/${CONFIG.whatsappNumber}`;

    const waContact = document.getElementById('whatsappContact');
    if (waContact) waContact.href = `https://wa.me/${CONFIG.whatsappNumber}`;

    const phoneContact = document.getElementById('phoneContact');
    if (phoneContact) {
      phoneContact.href = `tel:${CONFIG.phoneNumber.replace(/\s/g, '')}`;
      phoneContact.textContent = CONFIG.phoneNumber;
    }

    const emailContact = document.getElementById('emailContact');
    if (emailContact) {
      emailContact.href = `mailto:${CONFIG.email}`;
      emailContact.textContent = CONFIG.email;
    }
  }

  // ------------------------------------------------------------
  //  HERO & NAV BUY BUTTONS
  // ------------------------------------------------------------
  function configureBuyButtons() {
    const heroBuyBtn = document.getElementById('heroBuyBtn');
    if (heroBuyBtn) {
      heroBuyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(CONFIG.purchaseUrl, '_blank');
      });
    }

    const navBuyBtn = document.getElementById('navBuyBtn');
    if (navBuyBtn) {
      navBuyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(CONFIG.purchaseUrl, '_blank');
      });
    }
  }

  // ------------------------------------------------------------
  //  MOBILE NAV TOGGLE
  // ------------------------------------------------------------
  function initMobileNav() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {
      toggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          toggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // ------------------------------------------------------------
  //  SMOOTH SCROLL
  // ------------------------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#" || targetId === "") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ------------------------------------------------------------
  //  NAVBAR SCROLL EFFECT
  // ------------------------------------------------------------
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ------------------------------------------------------------
  //  REVEAL ON SCROLL
  // ------------------------------------------------------------
  function initRevealOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .step-card, .contact-card');

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s cubic-bezier(0.2, 0, 0, 1) ${i * 0.05}s`;
      observer.observe(el);
    });
  }

  // ------------------------------------------------------------
  //  INIT — runs when DOM is ready
  // ------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('🚀 MAGELLAND EnT initializing...');
    renderBundles();
    configureContacts();
    configureBuyButtons();
    initMobileNav();
    initSmoothScroll();
    initNavbarScroll();
    initRevealOnScroll();
    console.log('✅ MAGELLAND EnT ready!');
  }

})();
