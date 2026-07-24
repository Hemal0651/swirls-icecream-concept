/* ======================================================
   SW!RLS ICE CREAM — Main JavaScript
   ====================================================== */

(function () {
  'use strict';

  /* ===== FLAVOR DATA ===== */
  const flavors = [
    {
      id: 'choco',
      name: 'Chocolate Fudge Brownie',
      mainImg: '../choco.png',
      rightImg: '../raspberry.png',
      leftImg: '../banana.png',
      bgClass: 'choco',
    },
    {
      id: 'raspberry',
      name: 'Raspberry Rush',
      mainImg: '../raspberry.png',
      rightImg: '../banana.png',
      leftImg: '../choco.png',
      bgClass: 'raspberry',
    },
    {
      id: 'banana',
      name: 'Banana Pudding',
      mainImg: '../banana.png',
      rightImg: '../choco.png',
      leftImg: '../raspberry.png',
      bgClass: 'banana',
    },
  ];

  let currentFlavor = 0;
  let isTransitioning = false;
  let autoTimer = null;

  /* ===== DOM REFS ===== */
  const navbar        = document.getElementById('navbar');
  const heroBg        = document.getElementById('hero-bg');
  const cupMainImg    = document.getElementById('cup-main-img');
  const cupRightImg   = document.getElementById('cup-right-img');
  const cupLeftImg    = document.getElementById('cup-left-img');
  const arrowPrev     = document.getElementById('arrow-prev');
  const arrowNext     = document.getElementById('arrow-next');
  const navLinks      = document.querySelectorAll('.nav-link');
  const sections      = document.querySelectorAll('section[id]');
  const chips         = document.querySelectorAll('.chip');
  const addBtns       = document.querySelectorAll('.add-btn');
  const contactForm   = document.getElementById('contact-form');
  const btnOrder      = document.getElementById('btn-order');
  const btnMenuLink   = document.getElementById('btn-menu');

  /* ===================================================
     1. NAVBAR SCROLL EFFECT
     =================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    revealOnScroll();
  });

  /* ===================================================
     2. ACTIVE NAV ON SCROLL
     =================================================== */
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ===================================================
     3. SMOOTH SCROLL FOR NAV LINKS
     =================================================== */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ===================================================
     4. FLAVOR CAROUSEL
     =================================================== */
  function switchFlavor(idx) {
    if (isTransitioning || idx === currentFlavor) return;
    isTransitioning = true;

    const f = flavors[idx];

    // Fade out images
    [cupMainImg, cupRightImg, cupLeftImg].forEach(img => {
      img.classList.add('switching');
    });

    setTimeout(() => {
      // Swap sources
      cupMainImg.src  = f.mainImg;
      cupRightImg.src = f.rightImg;
      cupLeftImg.src  = f.leftImg;

      // Update background class
      heroBg.className = 'hero-bg ' + f.bgClass;

      // Fade back in
      [cupMainImg, cupRightImg, cupLeftImg].forEach(img => {
        img.classList.remove('switching');
      });

      isTransitioning = false;
    }, 420);

    currentFlavor = idx;

    // Restart auto-timer
    resetAutoTimer();
  }

  function nextFlavor() {
    switchFlavor((currentFlavor + 1) % flavors.length);
  }

  function prevFlavor() {
    switchFlavor((currentFlavor - 1 + flavors.length) % flavors.length);
  }

  if (arrowNext) arrowNext.addEventListener('click', nextFlavor);
  if (arrowPrev) arrowPrev.addEventListener('click', prevFlavor);

  // Auto-rotate every 5s
  function resetAutoTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextFlavor, 5000);
  }
  resetAutoTimer();

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextFlavor();
    if (e.key === 'ArrowLeft')  prevFlavor();
  });

  /* ===================================================
     5. FILTER CHIPS
     =================================================== */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ===================================================
     6. SCROLL REVEAL ANIMATIONS
     =================================================== */
  const reveals = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    const winH = window.innerHeight;
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winH - 60) {
        el.classList.add('visible');
      }
    });
  }

  // Initial check
  revealOnScroll();

  /* ===================================================
     7. MENU CARDS — MARK AS REVEAL
     =================================================== */
  document.querySelectorAll('.menu-card, .stat-item, .about-text, .about-visual').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  /* ===================================================
     8. ADD TO CART BUTTONS
     =================================================== */
  let cartCount = 2;
  const cartBadge = document.getElementById('cart-badge');

  addBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;

      // Pulse animation
      btn.textContent = '✓ Added!';
      btn.style.background = '#4a9c50';
      setTimeout(() => {
        btn.textContent = 'Add +';
        btn.style.background = '';
      }, 1200);

      showToast('🍦 Added to cart!');
    });
  });

  /* ===================================================
     9. HERO BUTTONS
     =================================================== */
  if (btnOrder) {
    btnOrder.addEventListener('click', () => {
      document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnMenuLink) {
    btnMenuLink.addEventListener('click', () => {
      document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ===================================================
     10. CONTACT FORM
     =================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = document.getElementById('contact-submit');
      submit.textContent = 'Sending...';
      submit.disabled = true;

      setTimeout(() => {
        submit.textContent = '✓ Message Sent!';
        submit.style.background = '#4a9c50';
        contactForm.reset();

        setTimeout(() => {
          submit.textContent = 'Send Message';
          submit.style.background = '';
          submit.disabled = false;
        }, 2500);

        showToast('📨 Message sent successfully!');
      }, 1000);
    });
  }

  /* ===================================================
     11. TOAST NOTIFICATION
     =================================================== */
  let toastEl = null;
  let toastTimer = null;

  function createToast() {
    toastEl = document.createElement('div');
    toastEl.id = 'swirls-toast';
    toastEl.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: #3d1a06;
      color: #fff;
      padding: 12px 28px;
      border-radius: 999px;
      font-family: 'Manrope', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      z-index: 9999;
      transition: transform 0.4s cubic-bezier(.34,1.5,.55,1), opacity 0.4s ease;
      opacity: 0;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toastEl);
  }

  createToast();

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(-50%) translateY(80px)';
    }, 2500);
  }

  /* ===================================================
     12. CUP CLICK — SWITCH FLAVOR
     =================================================== */
  const cupRight = document.getElementById('cup-right');
  const cupLeft  = document.getElementById('cup-left');
  const cupMain  = document.getElementById('cup-main');

  if (cupRight) {
    cupRight.style.cursor = 'pointer';
    cupRight.addEventListener('click', () => nextFlavor());
  }

  if (cupLeft) {
    cupLeft.style.cursor = 'pointer';
    cupLeft.addEventListener('click', () => prevFlavor());
  }

  if (cupMain) {
    cupMain.style.cursor = 'pointer';
    cupMain.addEventListener('click', () => showToast('🍦 ' + flavors[currentFlavor].name));
  }

  /* ===================================================
     13. PARALLAX EFFECT ON HERO
     =================================================== */
  const cupsStage = document.getElementById('cups-stage');

  window.addEventListener('mousemove', (e) => {
    if (!cupsStage) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    cupsStage.style.transform = `translateX(calc(-20% + ${x}px)) translateY(${y}px)`;
  });

  /* ===================================================
     14. INITIAL PAGE LOAD ANIMATION
     =================================================== */
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
    revealOnScroll();
  });

})();
