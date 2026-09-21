/* ============================================================
   MAGELLAND EnT — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ------------------------------------------------------------
  //  CONFIGURATION — edit everything here
  // ------------------------------------------------------------
  const CONFIG = {
    // External purchase URL. Every "buy" button opens this in a new tab.
    purchaseUrl: 'https://www.apisolution.net/agent?ref=120587',

    // WhatsApp number: digits only, country code included, no + or spaces
    whatsappNumber: '233599641354',

    // Phone number for display and for the tel: link
    phoneNumber: '+233 59 964 1354',

    // Business email
    email: 'imustbrich@yahoo.com',

    // Currency symbol shown on the cards
    currency: 'GH\u20B5',

    // ----------------------------------------------------------
    //  BUNDLES
    //  Add as many entries as you like to each "bundles" array:
    //    { size: '2GB', price: 10, validity: '90 days' },
    //  "color" tints that network's cards. "tag" is optional and
    //  prints a small ribbon, e.g. tag: 'Best value'.
    // ----------------------------------------------------------
    networks: [
      {
        name: 'MTN',
        icon: 'fa-signal',
        color: '#FFCB05',
        bundles: [
          { size: '1GB', price: 5, validity: '90 days' }
        ]
      },
      {
        name: 'Telecel',
        icon: 'fa-sim-card',
        color: '#FF4757',
        bundles: [
          { size: '5GB', price: 25, validity: '90 days' }
        ]
      },
      {
        name: 'AirtelTigo',
        icon: 'fa-tower-cell',
        color: '#4D9BFF',
        bundles: [
          { size: '1GB', price: 4.5, validity: '90 days' }
        ]
      }
    ]
  };

  // ------------------------------------------------------------
  //  Helpers
  // ------------------------------------------------------------
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));

  // Escapes anything that goes into the HTML string below
  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function formatPrice(n) {
    return Number(n).toFixed(2).replace(/\.00$/, '');
  }

  function openExternal(url) {
    window.open(url, '_blank', 'noopener');
  }

  // ------------------------------------------------------------
  //  Bundle cards
  // ------------------------------------------------------------
  function renderBundles() {
    const grid = $('#bundleGrid');
    if (!grid) return;

    const cards = [];

    CONFIG.networks.forEach((network) => {
      (network.bundles || []).forEach((bundle) => {
        const url = CONFIG.purchaseUrl +
          '&network=' + encodeURIComponent(network.name) +
          '&data='    + encodeURIComponent(bundle.size) +
          '&price='   + encodeURIComponent(bundle.price);

        cards.push(
          '<article class="bundle-card" style="--net: ' + esc(network.color || '#F0C14B') + '">' +
            '<span class="network-badge">' +
              '<i class="fas ' + esc(network.icon) + '" aria-hidden="true"></i> ' + esc(network.name) +
            '</span>' +
            '<p class="data-amount">' + esc(bundle.size) + '<small>of data</small></p>' +
            '<p class="price-row">' +
              '<span class="price">' + CONFIG.currency + formatPrice(bundle.price) + '</span>' +
              '<span class="price-currency">cedis</span>' +
            '</p>' +
            '<p class="validity">' +
              '<i class="far fa-clock" aria-hidden="true"></i> Valid for ' + esc(bundle.validity) +
            '</p>' +
            '<button type="button" class="buy-now-btn" data-url="' + esc(url) + '">' +
              'Buy now <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>' +
            '</button>' +
          '</article>'
        );
      });
    });

    if (!cards.length) {
      grid.innerHTML = '<p class="bundle-note">Bundles are being updated. Message us on WhatsApp and we\'ll help you right away.</p>';
      return;
    }

    grid.innerHTML = cards.join('');

    // One listener for the whole grid instead of one per button
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.buy-now-btn');
      if (!btn) return;
      const url = btn.getAttribute('data-url');
      if (url) openExternal(url);
    });
  }

  // ------------------------------------------------------------
  //  "Bundles from GH₵x" label in the sticky bar
  // ------------------------------------------------------------
  function renderLowestPrice() {
    const label = $('.mobile-bar-label');
    if (!label) return;

    const prices = CONFIG.networks
      .reduce((all, n) => all.concat(n.bundles || []), [])
      .map((b) => Number(b.price))
      .filter((p) => !isNaN(p));

    if (!prices.length) return;
    label.innerHTML = 'Bundles from<br>' + CONFIG.currency + formatPrice(Math.min.apply(null, prices));
  }

  // ------------------------------------------------------------
  //  Contact links
  // ------------------------------------------------------------
  function configureContacts() {
    const waUrl = 'https://wa.me/' + CONFIG.whatsappNumber;

    ['#floatWhatsapp', '#whatsappContact'].forEach((sel) => {
      const el = $(sel);
      if (el) el.href = waUrl;
    });

    const phone = $('#phoneContact');
    if (phone) {
      phone.href = 'tel:' + CONFIG.phoneNumber.replace(/[^\d+]/g, '');
      phone.textContent = CONFIG.phoneNumber;
    }

    const email = $('#emailContact');
    if (email) {
      email.href = 'mailto:' + CONFIG.email;
      email.textContent = CONFIG.email;
    }

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------
  //  Buy buttons outside the bundle grid
  // ------------------------------------------------------------
  function configureBuyButtons() {
    ['#heroBuyBtn', '#navBuyBtn', '#barBuyBtn'].forEach((sel) => {
      const el = $(sel);
      if (el) el.href = CONFIG.purchaseUrl;
    });
  }

  // ------------------------------------------------------------
  //  Mobile navigation
  // ------------------------------------------------------------
  function initMobileNav() {
    const toggle = $('#menuToggle');
    const links  = $('#navLinks');
    if (!toggle || !links) return;

    function close() {
      links.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');
    }

    function open() {
      links.classList.add('active');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('nav-open');
    }

    toggle.addEventListener('click', () => {
      links.classList.contains('active') ? close() : open();
    });

    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // If the window grows past the drawer breakpoint, reset the body lock
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 880) close();
    });
  }

  // ------------------------------------------------------------
  //  Navbar: background on scroll, hide on scroll-down, reveal on scroll-up
  // ------------------------------------------------------------
  function initNavbarScroll() {
    const navbar = $('#navbar');
    if (!navbar) return;

    let lastY = window.scrollY;
    const hideAfter = 80; // don't hide until scrolled past the hero a bit

    const onScroll = () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 30);

      // Never hide while the mobile menu is open
      const menuOpen = document.body.classList.contains('nav-open');

      if (!menuOpen) {
        if (y > lastY && y > hideAfter) {
          navbar.classList.add('nav-hidden');   // scrolling down: hide
        } else if (y < lastY) {
          navbar.classList.remove('nav-hidden'); // scrolling up: reveal
        }
      }

      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ------------------------------------------------------------
  //  Reveal sections on scroll (skipped if motion is reduced)
  // ------------------------------------------------------------
  function initReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    const items = $$('.feature-card, .step-card, .contact-card, .bundle-card');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el, i) => {
      const delay = (i % 3) * 0.08;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .5s ease ' + delay + 's, transform .5s cubic-bezier(.2,0,0,1) ' + delay + 's';
      observer.observe(el);
    });
  }

  // ------------------------------------------------------------
  //  Init
  // ------------------------------------------------------------
  function init() {
    renderBundles();
    renderLowestPrice();
    configureContacts();
    configureBuyButtons();
    initMobileNav();
    initNavbarScroll();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
