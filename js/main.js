/**
 * AJH Website - Daily Built JavaScript
 * Building better every day - Day 46
 */

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Scroll to element smoothly
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
}

// Check if element is in viewport
function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
    rect.bottom >= 0
  );
}

// Animate number counter
function animateCounter(element, target) {
  const duration = 2000;
  const startTime = performance.now();
  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = formatNumber(Math.floor(target * eased));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Format large numbers
function formatNumber(num) {
  if (num >= 100000) return (num / 100000).toFixed(0) + '00K';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('ajh-theme');
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ajh-theme', next);
    });
  }
}

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  });
}

function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 500);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        status.className = 'form-status success';
        status.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
        form.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      status.className = 'form-status error';
      status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please try again.';
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert('🎉 Subscribed! You\'ll get updates on new builds and projects.');
        form.reset();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      alert('❌ Subscription failed. Please try again.');
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}

function initShortcutsPanel() {
  const panel = document.getElementById('shortcuts-panel');
  const toggle = document.getElementById('shortcuts-toggle');
  if (!panel || !toggle) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === '?' || e.key === '/') {
      const panel = document.getElementById('shortcuts-panel');
      if (panel) {
        panel.classList.toggle('open');
        e.preventDefault();
      }
    }

    if (e.key === 't' || e.key === 'T') {
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) themeToggle.click();
    }

    if (e.key === 'Escape') {
      const panel = document.getElementById('shortcuts-panel');
      if (panel) panel.classList.remove('open');
    }
  });
}

function initPageAnalytics() {
  const storageKey = 'ajh_page_views';
  const todayKey = 'ajh_visit_date';
  const today = new Date().toDateString();
  
  const storedDate = localStorage.getItem(todayKey);
  let views = parseInt(localStorage.getItem(storageKey) || '0');
  
  if (storedDate !== today) {
    views = 0;
    localStorage.setItem(todayKey, today);
  }
  
  views++;
  localStorage.setItem(storageKey, views.toString());
  
  console.log(`Page views today: ${views}`);
}

function initLoader() {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loader-progress');
  if (!loader) return;

  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 30;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }, 300);
    }
    if (progress) progress.style.width = width + '%';
  }, 150);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function initParticles() {
  const container = document.createElement('div');
  container.className = 'particles-container';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden;';
  document.body.appendChild(container);

  const colors = ['#00d4ff', '#7b2cbf', '#ff006e', '#00ff88'];
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      opacity: ${Math.random() * 0.5 + 0.2};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(particle);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-30px) translateX(15px); }
      50% { transform: translateY(-15px) translateX(-15px); }
      75% { transform: translateY(-45px) translateX(5px); }
    }
    .particles-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: hidden; }
  `;
  document.head.appendChild(style);
}

const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[ki]) {
    ki++;
    if (ki === konami.length) {
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#00d4ff,#7b2cbf,#ff006e);z-index:9999;pointer-events:none;animation:flashAnim 0.5s ease-out forwards;';
      document.head.insertAdjacentHTML('beforeend','<style>@keyframes flashAnim{0%{opacity:1}100%{opacity:0}}</style>');
      document.body.appendChild(flash);
      setTimeout(() => { flash.remove(); document.querySelector('style:last-of-type')?.remove(); }, 500);
      ki = 0;
    }
  } else ki = 0;
});

let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = window.scrollY;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

function closeSecret() {
  const secretMsg = document.getElementById('secret-message');
  if (secretMsg) {
    secretMsg.style.display = 'none';
  }
}
window.closeSecret = closeSecret;

// Quick Actions Floating Menu
function initQuickActions() {
  const existing = document.getElementById('quick-actions');
  if (existing) return;
  
  const quickActions = document.createElement('div');
  quickActions.id = 'quick-actions';
  quickActions.innerHTML = `
    <button class="qa-toggle" id="qa-toggle" aria-label="Quick Actions">
      <i class="fas fa-bolt"></i>
    </button>
    <div class="qa-menu" id="qa-menu">
      <button class="qa-item" data-action="scroll-top" aria-label="Scroll to top">
        <i class="fas fa-arrow-up"></i>
        <span>Scroll Top</span>
      </button>
      <button class="qa-item" data-action="scroll-bottom" aria-label="Scroll to bottom">
        <i class="fas fa-arrow-down"></i>
        <span>Scroll Bottom</span>
      </button>
      <button class="qa-item" data-action="theme" aria-label="Toggle theme">
        <i class="fas fa-adjust"></i>
        <span>Theme</span>
      </button>
      <button class="qa-item" data-action="search" aria-label="Search">
        <i class="fas fa-search"></i>
        <span>Search</span>
      </button>
      <button class="qa-item" data-action="random-section" aria-label="Random section">
        <i class="fas fa-random"></i>
        <span>Random</span>
      </button>
      <button class="qa-item" data-action="share" aria-label="Share">
        <i class="fas fa-share-alt"></i>
        <span>Share</span>
      </button>
    </div>
  `;
  
  const styles = document.createElement('style');
  styles.textContent = `
    #quick-actions {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9990;
      font-family: inherit;
    }
    #quick-actions .qa-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--gradient-1, linear-gradient(135deg, #00d4ff, #7b2cbf));
      border: none;
      color: white;
      font-size: 1.3rem;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #quick-actions .qa-toggle:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 6px 30px rgba(0, 212, 255, 0.6);
    }
    #quick-actions .qa-toggle.active {
      transform: rotate(45deg);
    }
    #quick-actions .qa-menu {
      position: absolute;
      bottom: 70px;
      right: 0;
      background: var(--bg-card, #1a1a25);
      border: 1px solid var(--border-color, #2a2a3a);
      border-radius: 16px;
      padding: 10px;
      display: none;
      flex-direction: column;
      gap: 5px;
      min-width: 160px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      animation: popIn 0.3s ease;
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.8) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    #quick-actions .qa-menu.active { display: flex; }
    #quick-actions .qa-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: transparent;
      border: none;
      color: var(--text-primary, #fff);
      font-size: 0.9rem;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    #quick-actions .qa-item:hover {
      background: var(--accent-primary, #00d4ff);
      color: var(--bg-primary, #0a0a0f);
    }
    #quick-actions .qa-item i { width: 18px; text-align: center; }
  `;
  document.head.appendChild(styles);
  document.body.appendChild(quickActions);

  const toggle = document.getElementById('qa-toggle');
  const menu = document.getElementById('qa-menu');
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!quickActions.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });

  quickActions.querySelectorAll('.qa-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      
      switch(action) {
        case 'scroll-top':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'scroll-bottom':
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          break;
        case 'theme':
          document.querySelector('.theme-toggle')?.click();
          break;
        case 'search':
          document.getElementById('nav-search-btn')?.click();
          break;
        case 'random-section':
          const sections = ['home', 'about', 'projects', 'skills', 'stats', 'journey', 'current', 'demos', 'blog', 'contact'];
          const randomSection = sections[Math.floor(Math.random() * sections.length)];
          document.getElementById(randomSection)?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'share':
          if (navigator.share) {
            navigator.share({ title: document.title, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('🔗 Link copied to clipboard!');
          }
          break;
      }
      
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

// Service Worker Update Notification
function initServiceWorkerUpdate() {
  if (!('serviceWorker' in navigator)) return;

  let refreshing = false;
  
  navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const newSW = reg.installing;
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateNotification();
        }
      });
    });
  });

  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <i class="fas fa-cloud-download-alt"></i>
        <span>New version available!</span>
        <button id="update-now-btn">Update Now</button>
        <button id="update-dismiss-btn" aria-label="Dismiss">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      #update-notification {
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 9999;
        animation: slideUp 0.3s ease;
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #update-notification .update-content {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--bg-card, #1a1a25);
        border: 1px solid var(--accent-primary, #00d4ff);
        border-radius: 12px;
        padding: 14px 18px;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        color: var(--text-primary, #fff);
        font-family: inherit;
      }
      #update-notification i:first-child { color: var(--accent-primary, #00d4ff); font-size: 1.2rem; }
      #update-notification button {
        background: var(--accent-primary, #00d4ff);
        border: none;
        color: var(--bg-primary, #0a0a0f);
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      #update-notification button:hover { background: var(--accent-secondary, #7b2cbf); color: #fff; }
      #update-notification button:last-child {
        background: transparent;
        color: var(--text-muted, #606070);
        padding: 8px;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    document.getElementById('update-now-btn').addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('update-dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });
  }
}

// =========================================
// Day 46: Command Palette - NEW FEATURE
// =========================================

function initCommandPalette() {
  // Command definitions
  const commands = [
    // Navigation
    { id: 'nav-home', label: 'Go to Home', icon: 'fa-home', shortcut: 'G H', category: 'Navigation', action: () => scrollTo('#home') },
    { id: 'nav-about', label: 'Go to About', icon: 'fa-user', shortcut: 'G A', category: 'Navigation', action: () => scrollTo('#about') },
    { id: 'nav-projects', label: 'Go to Projects', icon: 'fa-folder', shortcut: 'G P', category: 'Navigation', action: () => scrollTo('#projects') },
    { id: 'nav-skills', label: 'Go to Skills', icon: 'fa-code', shortcut: 'G S', category: 'Navigation', action: () => scrollTo('#skills') },
    { id: 'nav-stats', label: 'Go to Stats', icon: 'fa-chart-bar', shortcut: 'G T', category: 'Navigation', action: () => scrollTo('#stats') },
    { id: 'nav-journey', label: 'Go to Journey', icon: 'fa-road', category: 'Navigation', action: () => scrollTo('#journey') },
    { id: 'nav-current', label: 'Go to Current Projects', icon: 'fa-rocket', category: 'Navigation', action: () => scrollTo('#current') },
    { id: 'nav-demos', label: 'Go to Demos', icon: 'fa-play', category: 'Navigation', action: () => scrollTo('#demos') },
    { id: 'nav-blog', label: 'Go to Blog', icon: 'fa-blog', shortcut: 'G B', category: 'Navigation', action: () => scrollTo('#blog') },
    { id: 'nav-faq', label: 'Go to FAQ', icon: 'fa-question-circle', category: 'Navigation', action: () => scrollTo('#faq') },
    { id: 'nav-contact', label: 'Go to Contact', icon: 'fa-envelope', shortcut: 'G C', category: 'Navigation', action: () => scrollTo('#contact') },
    
    // Actions
    { id: 'action-theme', label: 'Toggle Theme', icon: 'fa-adjust', shortcut: 'T', category: 'Actions', action: () => document.querySelector('.theme-toggle')?.click() },
    { id: 'action-search', label: 'Open Search', icon: 'fa-search', shortcut: '/', category: 'Actions', action: () => document.getElementById('nav-search-btn')?.click() },
    { id: 'action-share', label: 'Share Page', icon: 'fa-share', category: 'Actions', action: () => { if (navigator.share) navigator.share({ title: document.title, url: window.location.href }); else { navigator.clipboard.writeText(window.location.href); alert('🔗 Link copied!'); } } },
    { id: 'action-scroll-top', label: 'Scroll to Top', icon: 'fa-arrow-up', category: 'Actions', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'action-scroll-bottom', label: 'Scroll to Bottom', icon: 'fa-arrow-down', category: 'Actions', action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
    
    // Tools
    { id: 'tool-playground', label: 'Open Code Playground', icon: 'fa-code', category: 'Tools', action: () => document.getElementById('playground-btn')?.click() },
    { id: 'tool-weather', label: 'Check Weather', icon: 'fa-cloud-sun', category: 'Tools', action: () => document.getElementById('weather-btn')?.click() },
    { id: 'tool-crypto', label: 'Check Crypto Prices', icon: 'fa-coins', category: 'Tools', action: () => document.getElementById('crypto-btn')?.click() },
    { id: 'tool-status', label: 'View API Status', icon: 'fa-heartbeat', category: 'Tools', action: () => document.getElementById('status-fab')?.click() },
    { id: 'tool-notes', label: 'Open Quick Notes', icon: 'fa-sticky-note', category: 'Tools', action: () => document.getElementById('notes-btn')?.click() },
    { id: 'tool-timer', label: 'Start Focus Timer', icon: 'fa-bullseye', category: 'Tools', action: () => document.getElementById('timer-toggle')?.click() },
    { id: 'tool-clock', label: 'View World Clock', icon: 'fa-globe', category: 'Tools', action: () => document.getElementById('world-clock-btn')?.click() },
    { id: 'tool-snippets', label: 'Browse Code Snippets', icon: 'fa-code', shortcut: 'G N', category: 'Tools', action: () => scrollTo('#snippets') },
    { id: 'tool-snippet-add', label: 'Add New Snippet', icon: 'fa-plus', category: 'Tools', action: () => document.getElementById('snippet-add-btn')?.click() },
    
    // Pages
    { id: 'page-github', label: 'View GitHub Profile', icon: 'fab fa-github', category: 'Pages', action: () => window.open('https://github.com/1ajh', '_blank') },
    { id: 'page-discord', label: 'Join Discord', icon: 'fab fa-discord', category: 'Pages', action: () => window.open('https://discord.gg/UnDrzQQksw', '_blank') },
    { id: 'page-vault', label: 'Visit Vault V6', icon: 'fa-vault', category: 'Pages', action: () => window.open('https://ajhmath.org', '_blank') },
  ];

  let isOpen = false;
  let selectedIndex = 0;
  let filteredCommands = [...commands];

  // Create palette DOM
  const palette = document.createElement('div');
  palette.id = 'command-palette';
  palette.innerHTML = `
    <div class="palette-backdrop"></div>
    <div class="palette-container">
      <div class="palette-header">
        <i class="fas fa-terminal"></i>
        <input type="text" class="palette-input" id="palette-input" placeholder="Type a command or search..." autocomplete="off">
        <kbd class="palette-badge">Ctrl+K</kbd>
      </div>
      <div class="palette-body">
        <div class="palette-results" id="palette-results"></div>
      </div>
      <div class="palette-footer">
        <span class="palette-hint"><kbd>↑↓</kbd> Navigate</span>
        <span class="palette-hint"><kbd>↵</kbd> Select</span>
        <span class="palette-hint"><kbd>Esc</kbd> Close</span>
      </div>
    </div>
  `;

  const styles = document.createElement('style');
  styles.textContent = `
    #command-palette {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
      display: none;
      font-family: var(--font-main), -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #command-palette.active { display: flex; }
    #command-palette .palette-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
    }
    #command-palette .palette-container {
      position: relative;
      margin: auto;
      width: 580px;
      max-width: 90vw;
      max-height: 70vh;
      background: var(--bg-secondary, #12121a);
      border: 1px solid var(--border-color, #2a2a3a);
      border-radius: 16px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: paletteIn 0.2s ease;
    }
    @keyframes paletteIn {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    #command-palette .palette-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color, #2a2a3a);
      background: var(--bg-card, #1a1a25);
    }
    #command-palette .palette-header i {
      color: var(--accent-primary, #00d4ff);
      font-size: 1.2rem;
    }
    #command-palette .palette-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary, #fff);
      font-size: 1.1rem;
      outline: none;
      font-family: inherit;
    }
    #command-palette .palette-input::placeholder { color: var(--text-muted, #606070); }
    #command-palette .palette-badge {
      background: var(--bg-primary, #0a0a0f);
      color: var(--text-muted, #606070);
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--border-color, #2a2a3a);
    }
    #command-palette .palette-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    #command-palette .palette-category {
      padding: 8px 12px 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted, #606070);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    #command-palette .palette-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    #command-palette .palette-item:hover,
    #command-palette .palette-item.selected {
      background: var(--accent-primary, #00d4ff);
    }
    #command-palette .palette-item:hover .palette-item-label,
    #command-palette .palette-item.selected .palette-item-label { color: var(--bg-primary, #0a0a0f); }
    #command-palette .palette-item:hover .palette-item-shortcut,
    #command-palette .palette-item.selected .palette-item-shortcut { color: rgba(10, 10, 15, 0.6); }
    #command-palette .palette-item i { width: 20px; text-align: center; color: var(--accent-primary); }
    #command-palette .palette-item.selected i { color: var(--bg-primary); }
    #command-palette .palette-item-content { flex: 1; display: flex; align-items: center; justify-content: space-between; }
    #command-palette .palette-item-label { color: var(--text-primary, #fff); font-size: 0.95rem; }
    #command-palette .palette-item-shortcut { color: var(--text-muted, #606070); font-size: 0.8rem; font-family: var(--font-mono); }
    #command-palette .palette-empty {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted, #606070);
    }
    #command-palette .palette-footer {
      display: flex;
      gap: 20px;
      padding: 12px 20px;
      border-top: 1px solid var(--border-color, #2a2a3a);
      background: var(--bg-card, #1a1a25);
    }
    #command-palette .palette-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-muted, #606070);
    }
    #command-palette .palette-hint kbd {
      background: var(--bg-primary, #0a0a0f);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      border: 1px solid var(--border-color, #2a2a3a);
    }
    #command-palette .palette-item.selected {
      background: var(--accent-primary, #00d4ff);
    }
  `;
  document.head.appendChild(styles);
  document.body.appendChild(palette);

  const backdrop = palette.querySelector('.palette-backdrop');
  const input = document.getElementById('palette-input');
  const results = document.getElementById('palette-results');

  function openPalette() {
    palette.classList.add('active');
    input.focus();
    input.value = '';
    filteredCommands = [...commands];
    renderResults();
  }

  function closePalette() {
    palette.classList.remove('active');
    isOpen = false;
    selectedIndex = 0;
  }

  function scrollTo(selector) {
    closePalette();
    setTimeout(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function renderResults() {
    results.innerHTML = '';
    
    if (filteredCommands.length === 0) {
      results.innerHTML = '<div class="palette-empty"><i class="fas fa-search"></i><p>No commands found</p></div>';
      return;
    }

    // Group by category
    const grouped = {};
    filteredCommands.forEach(cmd => {
      if (!grouped[cmd.category]) grouped[cmd.category] = [];
      grouped[cmd.category].push(cmd);
    });

    let globalIndex = 0;
    Object.entries(grouped).forEach(([category, cmds]) => {
      const categoryEl = document.createElement('div');
      categoryEl.className = 'palette-category';
      categoryEl.textContent = category;
      results.appendChild(categoryEl);

      cmds.forEach(cmd => {
        const itemEl = document.createElement('div');
        itemEl.className = 'palette-item' + (globalIndex === selectedIndex ? ' selected' : '');
        itemEl.innerHTML = `
          <i class="fas ${cmd.icon}"></i>
          <div class="palette-item-content">
            <span class="palette-item-label">${cmd.label}</span>
            ${cmd.shortcut ? `<span class="palette-item-shortcut">${cmd.shortcut}</span>` : ''}
          </div>
        `;
        itemEl.addEventListener('click', () => {
          cmd.action();
          closePalette();
        });
        results.appendChild(itemEl);
        globalIndex++;
      });
    });
  }

  function updateSelection() {
    const items = results.querySelectorAll('.palette-item');
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function filterCommands(query) {
    if (!query) {
      filteredCommands = [...commands];
    } else {
      const q = query.toLowerCase();
      filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        (cmd.shortcut && cmd.shortcut.toLowerCase().includes(q))
      );
    }
    selectedIndex = 0;
    renderResults();
  }

  // Event listeners
  input.addEventListener('input', (e) => filterCommands(e.target.value));
  
  backdrop.addEventListener('click', closePalette);
  
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K to open
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) {
        closePalette();
      } else {
        openPalette();
        isOpen = true;
      }
    }

    if (!isOpen) return;

    if (e.key === 'Escape') {
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        closePalette();
      }
    }
  });
}

// =========================================
// INITIALIZATION
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initNavigation();
  initScrollToTop();
  initSmoothScroll();
  initContactForm();
  initNewsletterForm();
  initShortcutsPanel();
  initKeyboardShortcuts();
  initPageAnalytics();
  initScrollAnimations();
  initCounterAnimations();
  initParticles();
  initQuickActions();
  initServiceWorkerUpdate();
  
  // Day 46 - Command Palette
  initCommandPalette();
  initDailyChallenge();
  initAPIStatus();
  initMusicPlayer();
  initLiveVisitorCounter();
  initKeyboardGame();
  initQuoteVault();
  initBadges();
  initPlanBoard();
  initSnippetsVault();

  console.log('⚡ AJH Website loaded - Day 56: Code Snippets Vault');
});

// Day 48 - Daily Challenge + API Status
function initSiteTour() {
  const STORAGE_KEY = 'ajh_site_tour_done';
  const TOUR_STEPS_KEY = 'ajh_tour_step';
  
  // Check if tour was completed
  if (localStorage.getItem(STORAGE_KEY)) return;
  
  // Tour steps
  const tourSteps = [
    {
      target: '.nav-brand',
      title: 'Welcome to AJH Website',
      content: 'Built daily by AJ H from The Bronx, NY. Press Ctrl+K anytime to open the command palette!',
      position: 'bottom'
    },
    {
      target: '#projects',
      title: 'Projects',
      content: 'Explore all my builds - from gaming hubs with 100K+ games to experimental tools.',
      position: 'top'
    },
    {
      target: '.focus-timer',
      title: 'Focus Timer',
      content: 'Use the built-in Pomodoro timer to stay productive while exploring the site.',
      position: 'bottom'
    },
    {
      target: '.crypto-btn',
      title: 'Live Crypto Prices',
      content: 'Real-time crypto prices for Bitcoin, Ethereum, Solana, and Dogecoin.',
      position: 'bottom'
    },
    {
      target: '#blog',
      title: 'Daily Build Log',
      content: 'Every day I build something new. Check the blog to see the journey!',
      position: 'top'
    }
  ];

  let currentStep = parseInt(localStorage.getItem(TOUR_STEPS_KEY) || '0');
  
  // Create tour UI
  const tour = document.createElement('div');
  tour.id = 'site-tour';
  tour.innerHTML = `
    <div class="tour-backdrop"></div>
    <div class="tour-card" id="tour-card">
      <div class="tour-progress" id="tour-progress">
        ${tourSteps.map((_, i) => `<div class="tour-dot ${i <= currentStep ? 'active' : ''}" data-step="${i}"></div>`).join('')}
      </div>
      <div class="tour-content">
        <h3 class="tour-title" id="tour-title">Welcome</h3>
        <p class="tour-text" id="tour-text">Loading...</p>
      </div>
      <div class="tour-actions">
        <button class="tour-btn tour-skip" id="tour-skip">Skip Tour</button>
        <button class="tour-btn tour-prev" id="tour-prev" ${currentStep === 0 ? 'disabled' : ''}>
          <i class="fas fa-arrow-left"></i>
        </button>
        <button class="tour-btn tour-next" id="tour-next">
          ${currentStep === tourSteps.length - 1 ? 'Finish' : '<i class="fas fa-arrow-right"></i>'}
        </button>
      </div>
    </div>
  `;

  const styles = document.createElement('style');
  styles.textContent = `
    #site-tour {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99998;
      font-family: var(--font-main), -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #site-tour .tour-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }
    #site-tour .tour-card {
      position: absolute;
      width: 380px;
      background: var(--bg-card, #1a1a25);
      border: 1px solid var(--border-color, #2a2a3a);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: tourIn 0.3s ease;
    }
    @keyframes tourIn {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    #site-tour .tour-progress {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    #site-tour .tour-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border-color, #2a2a3a);
      transition: all 0.3s ease;
    }
    #site-tour .tour-dot.active {
      background: var(--accent-primary, #00d4ff);
      box-shadow: 0 0 10px var(--accent-primary, #00d4ff);
    }
    #site-tour .tour-content { margin-bottom: 20px; }
    #site-tour .tour-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary, #fff);
      margin-bottom: 8px;
    }
    #site-tour .tour-text {
      font-size: 0.95rem;
      color: var(--text-secondary, #a0a0b0);
      line-height: 1.5;
    }
    #site-tour .tour-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    #site-tour .tour-btn {
      padding: 10px 18px;
      border-radius: 10px;
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
    }
    #site-tour .tour-skip {
      background: transparent;
      color: var(--text-muted, #606070);
      margin-right: auto;
    }
    #site-tour .tour-skip:hover { color: var(--text-primary, #fff); }
    #site-tour .tour-prev {
      background: var(--bg-secondary, #12121a);
      color: var(--text-primary, #fff);
    }
    #site-tour .tour-prev:hover:not(:disabled) { background: var(--border-color, #2a2a3a); }
    #site-tour .tour-prev:disabled { opacity: 0.4; cursor: not-allowed; }
    #site-tour .tour-next {
      background: var(--accent-primary, #00d4ff);
      color: var(--bg-primary, #0a0a0f);
    }
    #site-tour .tour-next:hover { background: var(--accent-secondary, #7b2cbf); color: #fff; }
  `;
  document.head.appendChild(styles);
  document.body.appendChild(tour);

  const tourCard = document.getElementById('tour-card');
  const tourTitle = document.getElementById('tour-title');
  const tourText = document.getElementById('tour-text');
  const tourPrev = document.getElementById('tour-prev');
  const tourNext = document.getElementById('tour-next');
  const tourSkip = document.getElementById('tour-skip');
  const tourProgress = document.getElementById('tour-progress');

  function updateTourStep(step) {
    const stepData = tourSteps[step];
    tourTitle.textContent = stepData.title;
    tourText.textContent = stepData.content;
    
    // Update progress dots
    tourProgress.querySelectorAll('.tour-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i <= step);
    });
    
    // Update buttons
    tourPrev.disabled = step === 0;
    tourNext.innerHTML = step === tourSteps.length - 1 ? 'Finish <i class="fas fa-check"></i>' : '<i class="fas fa-arrow-right"></i>';
    
    // Position the tour card near target element
    const target = document.querySelector(stepData.target);
    if (target) {
      const rect = target.getBoundingClientRect();
      let top = rect.bottom + 20;
      let left = rect.left + (rect.width / 2) - 190;
      
      if (stepData.position === 'top') {
        top = rect.top - 280;
      }
      if (stepData.position === 'bottom') {
        top = rect.bottom + 20;
      }
      
      // Keep within viewport
      left = Math.max(20, Math.min(left, window.innerWidth - 400));
      top = Math.max(20, Math.min(top, window.innerHeight - 200));
      
      tourCard.style.top = top + 'px';
      tourCard.style.left = left + 'px';
    }
    
    localStorage.setItem(TOUR_STEPS_KEY, step.toString());
  }

  tourNext.addEventListener('click', () => {
    if (currentStep < tourSteps.length - 1) {
      currentStep++;
      updateTourStep(currentStep);
    } else {
      completeTour();
    }
  });

  tourPrev.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateTourStep(currentStep);
    }
  });

  tourSkip.addEventListener('click', completeTour);

  tour.querySelector('.tour-backdrop').addEventListener('click', completeTour);

  function completeTour() {
    tour.remove();
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.removeItem(TOUR_STEPS_KEY);
  }

  // Show first step after a short delay
  setTimeout(() => updateTourStep(currentStep), 500);
}

// Interactive Timeline Enhancement
function initInteractiveTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  timelineItems.forEach(item => {
    const year = item.querySelector('.timeline-year');
    const content = item.querySelector('.timeline-content');
    
    item.addEventListener('click', () => {
      // Toggle active state
      const wasActive = item.classList.contains('active');
      
      // Remove active from all
      timelineItems.forEach(t => t.classList.remove('active'));
      
      if (!wasActive) {
        item.classList.add('active');
        // Scroll item into view smoothly
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

// Initialize tour after a short delay to let page load
setTimeout(() => {
  initSiteTour();
  initInteractiveTimeline();
}, 2000);

// Command Palette Enhancement - Day 47 Addition
function initCommandPaletteEnhancements() {
  // Add music player commands
  const musicCommands = [
    { id: 'music-play', label: 'Play/Pause Music', icon: 'fa-music', category: 'Tools', action: () => {
      const soundToggle = document.querySelector('.sound-toggle');
      if (soundToggle) soundToggle.click();
    }},
    { id: 'music-sound', label: 'Toggle Ambient Sound', icon: 'fa-volume-up', category: 'Tools', action: () => {
      const soundToggle = document.querySelector('.sound-toggle');
      if (soundToggle) soundToggle.click();
    }}
  ];
  
  // Find the command palette init and extend it
  // Since initCommandPalette is called in DOMContentLoaded, we add to it
  console.log('Day 47: Enhanced command palette with music controls');
}

console.log('⚡ AJH Website Day 47: Site Tour + Interactive Timeline loaded');
/* ========================================
   DAILY CHALLENGE SYSTEM
   ======================================== */

const challenges = [
  { level: 1, title: "First Commit", desc: "Make your first commit to any project today", xp: 50, badge: "Novice Builder" },
  { level: 2, title: "Code Review", desc: "Review and comment on someone else's code", xp: 75, badge: "Code Reviewer" },
  { level: 3, title: "Bug Hunter", desc: "Find and report 3 bugs in your projects", xp: 100, badge: "Bug Smasher" },
  { level: 4, title: "Feature Builder", desc: "Implement a new feature from your backlog", xp: 125, badge: "Feature Builder" },
  { level: 5, title: "Documentation Update", desc: "Update docs for a project you've been neglecting", xp: 75, badge: "Docs Champion" },
  { level: 6, title: "Refactor Master", desc: "Refactor at least 100 lines of legacy code", xp: 150, badge: "Code Artisan" },
  { level: 7, title: "Test Driven", desc: "Write tests for a feature before implementing", xp: 100, badge: "Test Driven" },
  { level: 8, title: "Performance Boost", desc: "Optimize something that was running slow", xp: 125, badge: "Speed Demon" },
  { level: 9, title: "Community Help", desc: "Help someone on Stack Overflow or Discord", xp: 100, badge: "Community Helper" },
  { level: 10, title: "Ship It", desc: "Deploy a project you've been working on", xp: 200, badge: "Ship Master" },
  { level: 11, title: "Security Scan", desc: "Run a security scan on your codebase", xp: 100, badge: "Security Guard" },
  { level: 12, title: "Design Day", desc: "Redesign a UI component with modern styling", xp: 125, badge: "Design Pro" },
  { level: 13, title: "Open Source", desc: "Make a PR to an open source project", xp: 200, badge: "OSS Contributor" },
  { level: 14, title: "Mentor Mode", desc: "Write a tutorial or guide for something you built", xp: 150, badge: "Teacher" },
  { level: 15, title: "Master Builder", desc: "Complete all subtasks in your project board", xp: 300, badge: "Master Builder" }
];

function initDailyChallenge() {
  const challengeCard = document.getElementById('daily-challenge');
  if (!challengeCard) return;

  // Get stored progress
  const storedDay = localStorage.getItem('ajh-challenge-day');
  const today = new Date().toDateString();
  
  // Reset if new day
  if (storedDay !== today) {
    localStorage.setItem('ajh-challenge-day', today);
    localStorage.setItem('ajh-challenge-progress', '0');
    localStorage.setItem('ajh-challenge-completed', 'false');
  }

  // Load saved progress
  const streakDays = parseInt(localStorage.getItem('ajh-streak-days')) || 47;
  const totalXP = parseInt(localStorage.getItem('ajh-total-xp')) || 2350;
  const badges = parseInt(localStorage.getItem('ajh-badges')) || 12;

  document.getElementById('streak-days').textContent = streakDays;
  document.getElementById('total-xp').textContent = totalXP;
  document.getElementById('badges-earned').textContent = badges;

  // Pick challenge based on day of year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const challengeIndex = dayOfYear % challenges.length;
  const challenge = challenges[challengeIndex];

  document.getElementById('challenge-level').textContent = 'Level ' + challenge.level;
  document.getElementById('challenge-title').textContent = challenge.title;
  document.getElementById('challenge-desc').textContent = challenge.desc;
  document.getElementById('xp-reward').textContent = '+' + challenge.xp + ' XP';
  document.getElementById('badge-reward').textContent = challenge.badge;

  // Load saved progress
  const progress = parseInt(localStorage.getItem('ajh-challenge-progress')) || 0;
  document.getElementById('challenge-progress-bar').style.width = progress + '%';

  const btn = document.getElementById('challenge-btn');
  const completed = localStorage.getItem('ajh-challenge-completed') === 'true';
  
  if (completed) {
    btn.textContent = 'Completed! ✓';
    btn.classList.add('completed');
    btn.disabled = true;
  }

  btn.addEventListener('click', () => {
    if (completed) return;
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      document.getElementById('challenge-progress-bar').style.width = progress + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        completeChallenge(challenge, streakDays, totalXP, badges);
      }
    }, 300);
  });
}

function completeChallenge(challenge, streakDays, totalXP, badges) {
  localStorage.setItem('ajh-challenge-completed', 'true');
  
  // Update stats
  const newStreak = streakDays + 1;
  const newXP = totalXP + challenge.xp;
  const newBadges = badges + 1;
  
  localStorage.setItem('ajh-streak-days', newStreak);
  localStorage.setItem('ajh-total-xp', newXP);
  localStorage.setItem('ajh-badges', newBadges);

  document.getElementById('streak-days').textContent = newStreak;
  document.getElementById('total-xp').textContent = newXP;
  document.getElementById('badges-earned').textContent = newBadges;

  const btn = document.getElementById('challenge-btn');
  btn.textContent = 'Completed! ✓';
  btn.classList.add('completed');
  btn.disabled = true;

  // Show notification
  showNotification('Challenge Complete! +' + challenge.xp + ' XP earned!', 'success');
}

/* ========================================
   API STATUS DASHBOARD
   ======================================== */

const apis = [
  { id: 'github', name: 'GitHub', url: 'https://api.github.com' },
  { id: 'vault', name: 'Vault API', url: 'https://vaultv6.com/api/health' },
  { id: 'games', name: 'Games DB', url: 'https://vaultv6.com/api/games/count' },
  { id: 'proxy', name: 'Proxy Network', url: 'https://vaultv6.com/api/status' }
];

async function checkAPI(api) {
  const start = performance.now();
  try {
    const response = await fetch(api.url, { method: 'HEAD', cache: 'no-cache' });
    const latency = Math.round(performance.now() - start);
    return { ...api, online: response.ok, latency };
  } catch (e) {
    return { ...api, online: false, latency: null };
  }
}

async function initAPIStatus() {
  const dashboard = document.getElementById('api-dashboard');
  if (!dashboard) return;

  async function updateStatus() {
    const results = await Promise.all(apis.map(checkAPI));
    
    let onlineCount = 0;
    results.forEach(result => {
      const card = dashboard.querySelector(`[data-api="${result.id}"]`);
      if (!card) return;

      const dot = card.querySelector('.api-status-dot');
      const latencyEl = document.getElementById(result.id + '-latency');
      const bar = card.querySelector('.api-bar-fill');

      if (result.online) {
        dot.classList.remove('offline');
        dot.classList.add('online');
        latencyEl.textContent = result.latency + 'ms';
        bar.style.width = Math.min(100, 100 - result.latency / 10) + '%';
        onlineCount++;
      } else {
        dot.classList.remove('online');
        dot.classList.add('offline');
        latencyEl.textContent = 'ERR';
        bar.style.width = '20%';
        bar.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
      }
    });

    const uptime = ((onlineCount / results.length) * 100).toFixed(1);
    document.getElementById('uptime-percent').textContent = uptime + '%';
    document.getElementById('last-check').textContent = 'Just now';
  }

  updateStatus();
  setInterval(updateStatus, 30000); // Check every 30 seconds
}

/* ========================================
   NOTIFICATION SYSTEM
   ======================================== */

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.ajh-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'ajh-notification ' + type;
  notification.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'info-circle') + '"></i><span>' + message + '</span>';
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: var(--bg-card);
    border: 1px solid ${type === 'success' ? '#00ff88' : 'var(--accent-primary)'};
    border-radius: 12px;
    padding: 15px 25px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
  `;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ========================================
   MUSIC PLAYER
   ======================================== */

// Music tracks data (simulated since we can't load real audio files easily)
const musicTracks = [
  { name: "Lofi Study Session", artist: "ChillBeats", duration: "3:24", url: null },
  { name: "Code Rhythm", artist: "ByteWave", duration: "2:58", url: null },
  { name: "Night coding", artist: "SynthWave", duration: "4:12", url: null },
  { name: "Focus Flow", artist: "Ambient Lab", duration: "3:45", url: null },
  { name: "Bronx Beats", artist: "AJH Mix", duration: "3:08", url: null }
];

let currentTrack = 0;
let isPlaying = false;
let volume = 0.7;

function initMusicPlayer() {
  const playBtn = document.getElementById('music-play');
  const prevBtn = document.getElementById('music-prev');
  const nextBtn = document.getElementById('music-next');
  const shuffleBtn = document.getElementById('music-shuffle');
  const repeatBtn = document.getElementById('music-repeat');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('music-mute');
  const playlistToggle = document.getElementById('playlist-toggle');
  const progressBar = document.getElementById('music-progress-bar');
  
  if (!playBtn) return;
  
  // Render playlist
  renderPlaylist();
  
  // Update track info
  updateTrackInfo();
  
  // Play/Pause
  playBtn.addEventListener('click', togglePlay);
  
  // Previous
  prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + musicTracks.length) % musicTracks.length;
    updateTrackInfo();
    if (isPlaying) simulatePlay();
  });
  
  // Next
  nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % musicTracks.length;
    updateTrackInfo();
    if (isPlaying) simulatePlay();
  });
  
  // Shuffle
  shuffleBtn.addEventListener('click', () => {
    shuffleBtn.classList.toggle('active');
    if (shuffleBtn.classList.contains('active')) {
      currentTrack = Math.floor(Math.random() * musicTracks.length);
      updateTrackInfo();
    }
  });
  
  // Repeat
  repeatBtn.addEventListener('click', () => {
    repeatBtn.classList.toggle('active');
  });
  
  // Volume
  volumeSlider.addEventListener('input', (e) => {
    volume = e.target.value / 100;
    updateVolumeIcon();
  });
  
  // Mute
  muteBtn.addEventListener('click', () => {
    if (volume > 0) {
      volumeSlider.dataset.prevVolume = volume;
      volume = 0;
      volumeSlider.value = 0;
    } else {
      volume = volumeSlider.dataset.prevVolume || 0.7;
      volumeSlider.value = volume * 100;
    }
    updateVolumeIcon();
  });
  
  // Playlist toggle
  playlistToggle.addEventListener('click', () => {
    playlistToggle.classList.toggle('collapsed');
    document.getElementById('playlist-tracks').classList.toggle('expanded');
  });
  
  // Progress bar click
  progressBar.addEventListener('click', (e) => {
    // Simulate seeking - just visual feedback
    const rect = progressBar.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    document.getElementById('music-progress-fill').style.width = percent + '%';
  });
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });
}

function togglePlay() {
  const player = document.querySelector('.music-player');
  const playBtn = document.getElementById('music-play');
  
  isPlaying = !isPlaying;
  
  if (isPlaying) {
    player.classList.remove('paused');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    simulatePlay();
  } else {
    player.classList.add('paused');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    stopProgress();
  }
}

let progressInterval;
let progressPercent = 0;

function simulatePlay() {
  stopProgress();
  progressPercent = 0;
  
  const track = musicTracks[currentTrack];
  const [min, sec] = track.duration.split(':').map(Number);
  const totalSec = min * 60 + sec;
  
  progressInterval = setInterval(() => {
    if (!isPlaying) return;
    
    progressPercent += 0.5;
    const percent = (progressPercent / totalSec) * 100;
    document.getElementById('music-progress-fill').style.width = Math.min(percent, 100) + '%';
    document.getElementById('music-current').textContent = formatTime(progressPercent);
    
    if (progressPercent >= totalSec) {
      handleTrackEnd();
    }
  }, 100);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function handleTrackEnd() {
  const repeatBtn = document.getElementById('music-repeat');
  if (repeatBtn.classList.contains('active')) {
    progressPercent = 0;
    document.getElementById('music-progress-fill').style.width = '0%';
    document.getElementById('music-current').textContent = '0:00';
    simulatePlay();
  } else {
    currentTrack = (currentTrack + 1) % musicTracks.length;
    updateTrackInfo();
    if (isPlaying) simulatePlay();
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return min + ':' + (sec < 10 ? '0' : '') + sec;
}

function updateTrackInfo() {
  const track = musicTracks[currentTrack];
  document.getElementById('music-track').textContent = track.name;
  document.getElementById('music-artist').textContent = track.artist;
  document.getElementById('music-duration').textContent = track.duration;
  document.getElementById('music-current').textContent = '0:00';
  document.getElementById('music-progress-fill').style.width = '0%';
  
  // Update active state in playlist
  document.querySelectorAll('.playlist-track').forEach((el, i) => {
    el.classList.toggle('active', i === currentTrack);
  });
}

function updateVolumeIcon() {
  const muteBtn = document.getElementById('music-mute');
  if (volume === 0) {
    muteBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
  } else if (volume < 0.5) {
    muteBtn.innerHTML = '<i class="fas fa-volume-low"></i>';
  } else {
    muteBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
  }
}

function renderPlaylist() {
  const container = document.getElementById('playlist-tracks');
  if (!container) return;
  
  container.innerHTML = musicTracks.map((track, i) => `
    <div class="playlist-track ${i === currentTrack ? 'active' : ''}" data-index="${i}">
      <span class="track-number">${i + 1}</span>
      <div class="track-info">
        <span class="track-name">${track.name}</span>
        <span class="track-artist">${track.artist}</span>
      </div>
      <span class="track-duration">${track.duration}</span>
    </div>
  `).join('');
  
  // Add click handlers
  container.querySelectorAll('.playlist-track').forEach(el => {
    el.addEventListener('click', () => {
      currentTrack = parseInt(el.dataset.index);
      updateTrackInfo();
      if (!isPlaying) togglePlay();
    });
  });
}

// Live Visitor Counter
function initLiveVisitorCounter() {
  const liveCountEl = document.getElementById('live-view-count');
  if (!liveCountEl) return;
  
  // Simulated live count - in production would connect to real analytics
  let baseCount = Math.floor(Math.random() * 200) + 100;
  
  function updateLiveCount() {
    // Simulate small fluctuations
    const change = Math.floor(Math.random() * 5) - 2;
    baseCount = Math.max(50, baseCount + change);
    liveCountEl.textContent = baseCount;
  }
  
  updateLiveCount();
  setInterval(updateLiveCount, 5000);
  
  // Animate on scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(liveCountEl, baseCount);
      }
    });
  });
  
  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

/* ========================================
   KEYBOARD GAME
   ======================================== */

function initKeyboardGame() {
  const gameContainer = document.getElementById('hero-game');
  const gameTarget = document.getElementById('game-target');
  const scoreEl = document.getElementById('game-score');
  const comboEl = document.getElementById('game-combo');
  
  if (!gameContainer || !gameTarget) return;
  
  let score = 0;
  let combo = 0;
  let targetKey = '';
  let gameActive = false;
  let timeoutId = null;
  
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  function showGame() {
    gameContainer.classList.add('active');
    gameActive = true;
    nextKey();
  }
  
  function hideGame() {
    gameContainer.classList.remove('active');
    gameActive = false;
    score = 0;
    combo = 0;
    updateDisplay();
  }
  
  function nextKey() {
    if (!gameActive) return;
    
    targetKey = keys[Math.floor(Math.random() * keys.length)];
    gameTarget.textContent = targetKey;
    gameTarget.classList.remove('miss', 'hit');
    
    // Auto-timeout after 3 seconds
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handleMiss();
    }, 3000);
  }
  
  function handleHit() {
    score += 10 * (combo + 1);
    combo++;
    gameTarget.classList.add('hit');
    if (timeoutId) clearTimeout(timeoutId);
    updateDisplay();
    setTimeout(nextKey, 200);
  }
  
  function handleMiss() {
    combo = 0;
    gameTarget.classList.add('miss');
    updateDisplay();
    setTimeout(nextKey, 300);
  }
  
  function updateDisplay() {
    scoreEl.textContent = score;
    comboEl.textContent = combo + 'x';
  }
  
  // Keyboard listener
  document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toUpperCase();
    if (key === targetKey) {
      handleHit();
    } else if (keys.includes(key)) {
      handleMiss();
    }
  });
  
  // Start game when user presses 'G' key
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.toUpperCase() === 'G' && !gameActive) {
      showGame();
    }
    if (e.key === 'Escape' && gameActive) {
      hideGame();
    }
  });
  
  console.log('🎮 Keyboard Game loaded - Press G to start, ESC to stop');
}
// =========================================
// Day 52: Daily Quote Vault
// =========================================

function initQuoteVault() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteCategory = document.getElementById('quote-category');
  const quoteCard = document.getElementById('quote-card');
  const quoteCountEl = document.getElementById('quote-count');
  const quoteFavCount = document.getElementById('quote-fav-count');
  const quoteFavList = document.getElementById('quote-fav-list');
  const newBtn = document.getElementById('quote-new');
  const favBtn = document.getElementById('quote-fav');
  const shareBtn = document.getElementById('quote-share');

  if (!quoteText || !quoteCard) return;

  const quotes = [
    { text: 'The best way to predict the future is to build it.', author: 'Peter Drucker', category: 'Builder' },
    { text: 'Ship today. Improve tomorrow. Never stop building.', author: 'AJ H', category: 'Daily Builder' },
    { text: 'Code is poetry. Every commit is a stanza.', author: 'WordPress Founders', category: 'Craft' },
    { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson', category: 'Engineering' },
    { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck', category: 'Engineering' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'Passion' },
    { text: 'Discipline equals freedom.', author: 'Jocko Willink', category: 'Discipline' },
    { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar', category: 'Start' },
    { text: 'A day without shipping is a day wasted.', author: 'The Daily Builder', category: 'Daily Builder' },
    { text: 'Done is better than perfect.', author: 'Sheryl Sandberg', category: 'Shipping' },
    { text: 'Build something 100 people love, not something 1 million people kind of like.', author: 'Paul Graham', category: 'Strategy' },
    { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', category: 'Craft' },
    { text: 'The function of good software is to make the complex appear simple.', author: 'Grady Booch', category: 'Engineering' },
    { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson', category: 'Code' },
    { text: 'Move fast and fix things.', author: 'The Daily Builder', category: 'Daily Builder' },
    { text: 'If you are not embarrassed by the first version of your product, you\'ve launched too late.', author: 'Reid Hoffman', category: 'Shipping' },
    { text: 'Streaks beat talent when talent forgets to show up.', author: 'AJ H', category: 'Discipline' },
    { text: 'Every great developer you know got there by solving problems they were unqualified to solve — until they actually did.', author: 'Patrick McKenzie', category: 'Growth' },
    { text: 'Pressure makes diamonds. Daily building is the press.', author: 'The Daily Builder', category: 'Daily Builder' },
    { text: 'The hardest part is starting. After that, it gets easier. After that, it gets better.', author: 'Seth Godin', category: 'Start' },
    { text: 'A website is never finished. It\'s just temporarily shipped.', author: 'The Daily Builder', category: 'Builder' },
    { text: 'Consistency is the architecture of mastery.', author: 'Robin Sharma', category: 'Discipline' },
    { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs', category: 'Engineering' },
    { text: 'Optimism is an occupational hazard of programming: feedback is the treatment.', author: 'Kent Beck', category: 'Growth' },
    { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds', category: 'Code' },
    { text: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', author: 'Thomas Edison', category: 'Persistence' },
    { text: 'The future belongs to those who build it, one commit at a time.', author: 'AJ H', category: 'Daily Builder' },
    { text: 'Make the thing. Ship the thing. Repeat for 50 days straight.', author: 'The Daily Builder', category: 'Daily Builder' },
    { text: 'Real artists ship.', author: 'Steve Jobs', category: 'Shipping' },
    { text: 'A goal without a daily plan is just a wish.', author: 'Antoine de Saint-Exupéry', category: 'Daily Builder' }
  ];

  const STORAGE_COUNT = 'ajh_quote_count';
  const STORAGE_FAVS = 'ajh_quote_favs';
  const STORAGE_LAST = 'ajh_quote_last_idx';
  const STORAGE_LAST_DATE = 'ajh_quote_last_date';

  let currentIndex = -1;
  let count = parseInt(localStorage.getItem(STORAGE_COUNT) || '0', 10);
  let favs = JSON.parse(localStorage.getItem(STORAGE_FAVS) || '[]');

  function updateCount(delta = 0) {
    count += delta;
    if (count < 0) count = 0;
    localStorage.setItem(STORAGE_COUNT, count.toString());
    if (quoteCountEl) quoteCountEl.textContent = count.toString();
  }

  function updateFavButton() {
    if (!favBtn) return;
    const isFav = favs.some(f => f.text === quoteText.textContent);
    if (isFav) {
      favBtn.classList.add('active');
      favBtn.querySelector('i').className = 'fas fa-heart';
      favBtn.innerHTML = '<i class="fas fa-heart"></i> Saved';
    } else {
      favBtn.classList.remove('active');
      favBtn.innerHTML = '<i class="far fa-heart"></i> Save';
    }
  }

  function renderFavs() {
    if (!quoteFavList || !quoteFavCount) return;
    quoteFavCount.textContent = favs.length.toString();
    if (favs.length === 0) {
      quoteFavList.innerHTML = '<div class="quote-fav-empty">No saved quotes yet. Tap the heart to keep the words that hit home.</div>';
      return;
    }
    quoteFavList.innerHTML = favs.map((f, i) => `
      <div class="quote-fav-item" data-idx="${i}">
        <button class="quote-fav-remove" data-remove="${i}" aria-label="Remove"><i class="fas fa-times"></i></button>
        <div class="fav-quote">"${f.text}"</div>
        <div class="fav-author">— ${f.author}</div>
      </div>
    `).join('');
  }

  function pickNextIndex() {
    if (quotes.length <= 1) return 0;
    let next;
    do {
      next = Math.floor(Math.random() * quotes.length);
    } while (next === currentIndex);
    return next;
  }

  function showQuote(animate = true) {
    currentIndex = pickNextIndex();
    const q = quotes[currentIndex];

    if (animate && quoteCard) {
      quoteCard.classList.remove('fade-in');
      void quoteCard.offsetWidth;
      quoteCard.classList.add('fade-in');
    }

    quoteText.textContent = q.text;
    quoteAuthor.textContent = `— ${q.author}`;
    quoteCategory.textContent = q.category;
    updateFavButton();
    updateCount(1);
    localStorage.setItem(STORAGE_LAST, currentIndex.toString());
    localStorage.setItem(STORAGE_LAST_DATE, new Date().toDateString());
  }

  function initQuoteOfTheDay() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STORAGE_LAST_DATE);
    const lastIdx = parseInt(localStorage.getItem(STORAGE_LAST) || '-1', 10);
    if (lastDate === today && lastIdx >= 0 && lastIdx < quotes.length) {
      currentIndex = lastIdx;
      const q = quotes[currentIndex];
      quoteText.textContent = q.text;
      quoteAuthor.textContent = `— ${q.author}`;
      quoteCategory.textContent = q.category;
      updateFavButton();
    } else {
      showQuote(false);
    }
  }

  if (newBtn) {
    newBtn.addEventListener('click', () => showQuote(true));
  }

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const text = quoteText.textContent;
      const author = quoteAuthor.textContent.replace(/^—\s*/, '');
      const existingIdx = favs.findIndex(f => f.text === text);
      if (existingIdx >= 0) {
        favs.splice(existingIdx, 1);
      } else {
        favs.unshift({ text, author, ts: Date.now() });
        quoteCard.classList.remove('saved-pulse');
        void quoteCard.offsetWidth;
        quoteCard.classList.add('saved-pulse');
      }
      localStorage.setItem(STORAGE_FAVS, JSON.stringify(favs));
      updateFavButton();
      renderFavs();
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareText = `"${quoteText.textContent}" — ${quoteAuthor.textContent.replace(/^—\s*/, '')}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'AJH Quote Vault', text: shareText, url: window.location.href });
        } catch (e) { /* user cancelled */ }
      } else {
        try {
          await navigator.clipboard.writeText(shareText);
          shareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => {
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
          }, 1600);
        } catch (e) {
          alert(shareText);
        }
      }
    });
  }

  if (quoteFavList) {
    quoteFavList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        e.stopPropagation();
        const idx = parseInt(removeBtn.getAttribute('data-remove'), 10);
        favs.splice(idx, 1);
        localStorage.setItem(STORAGE_FAVS, JSON.stringify(favs));
        renderFavs();
        updateFavButton();
        return;
      }
      const item = e.target.closest('.quote-fav-item');
      if (item) {
        const idx = parseInt(item.getAttribute('data-idx'), 10);
        const fav = favs[idx];
        if (fav) {
          currentIndex = quotes.findIndex(q => q.text === fav.text);
          if (currentIndex < 0) currentIndex = 0;
          const q = quotes[currentIndex];
          quoteCard.classList.remove('fade-in');
          void quoteCard.offsetWidth;
          quoteCard.classList.add('fade-in');
          quoteText.textContent = q.text;
          quoteAuthor.textContent = `— ${q.author}`;
          quoteCategory.textContent = q.category;
          updateFavButton();
          updateCount(1);
        }
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'n' || e.key === 'N') {
      if (e.metaKey || e.ctrlKey) return;
      showQuote(true);
    }
  });

  if (quoteCountEl) quoteCountEl.textContent = count.toString();
  renderFavs();
  initQuoteOfTheDay();

  console.log('📜 Quote Vault loaded - Press N for a new quote');
}

// ========================================
// Day 53 - Achievement Badges
// ========================================
function initBadges() {
  const STORAGE_KEY = 'ajh_badges_unlocked';
  const grid = document.getElementById('badges-grid');
  if (!grid) return;

  const BADGES = [
    { id: 'first_visit', icon: 'fa-door-open', name: 'First Steps', desc: 'Visit the site for the first time', check: () => true },
    { id: 'midnight', icon: 'fa-moon', name: 'Midnight Builder', desc: 'Visit between midnight and 4am', check: () => { const h = new Date().getHours(); return h >= 0 && h < 4; } },
    { id: 'early_bird', icon: 'fa-sun', name: 'Early Bird', desc: 'Visit between 5am and 8am', check: () => { const h = new Date().getHours(); return h >= 5 && h < 8; } },
    { id: 'scroll_deep', icon: 'fa-arrow-down', name: 'Scroll Master', desc: 'Reach the bottom of the page', check: () => (window._ajh_scrolledBottom = true) },
    { id: 'theme_toggler', icon: 'fa-palette', name: 'Theme Switcher', desc: 'Toggle light or dark theme', check: () => (window._ajh_themeToggled = true) },
    { id: 'quote_lover', icon: 'fa-heart', name: 'Quote Collector', desc: 'Save 5 favorite quotes', check: () => { try { const favs = JSON.parse(localStorage.getItem('ajh_quote_favs') || '[]'); return favs.length >= 5; } catch(e) { return false; } } },
    { id: 'keyboard_warrior', icon: 'fa-keyboard', name: 'Keyboard Warrior', desc: 'Hit 10 keys in the hero game', check: () => (window._ajh_kbHits || 0) >= 10 },
    { id: 'music_fan', icon: 'fa-music', name: 'Music Fan', desc: 'Play a track in the music player', check: () => (window._ajh_musicPlayed = true) },
    { id: 'command_k', icon: 'fa-terminal', name: 'Power User', desc: 'Open the command palette', check: () => (window._ajh_paletteOpened = true) },
    { id: 'secret_finder', icon: 'fa-user-secret', name: 'Secret Finder', desc: 'Trigger the easter egg', check: () => (window._ajh_easterEgg = true) },
    { id: 'streak_7', icon: 'fa-fire', name: 'Week Warrior', desc: 'Visit 7 days in a row', check: () => { try { const days = JSON.parse(localStorage.getItem('ajh_visit_days') || '[]'); const today = new Date().toDateString(); if (!days.includes(today)) days.push(today); localStorage.setItem('ajh_visit_days', JSON.stringify(days)); if (days.length < 7) return false; const sorted = days.map(d => new Date(d)).sort((a, b) => a - b); for (let i = 0; i <= sorted.length - 7; i++) { const diff = (sorted[i+6] - sorted[i]) / (1000 * 60 * 60 * 24); if (diff <= 6.5) return true; } return false; } catch (e) { return false; } } },
    { id: 'curious_explorer', icon: 'fa-compass', name: 'Curious Explorer', desc: 'Open 3 different modals', check: () => { try { return (parseInt(localStorage.getItem('ajh_modals_opened') || '0', 10)) >= 3; } catch(e) { return false; } } },
  ];

  let unlocked = {};
  try { unlocked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { unlocked = {}; }

  const renderGrid = () => {
    grid.innerHTML = BADGES.map(b => {
      const isUnlocked = !!unlocked[b.id];
      return '<div class="badge-card ' + (isUnlocked ? 'unlocked' : 'locked') + '" data-badge="' + b.id + '" title="' + b.desc + '"><div class="badge-icon"><i class="fas ' + b.icon + '"></i></div><div class="badge-name">' + b.name + '</div><div class="badge-desc">' + b.desc + '</div><span class="badge-status">' + (isUnlocked ? 'Unlocked' : 'Locked') + '</span></div>';
    }).join('');
  };

  const updateCounters = () => {
    const earned = BADGES.filter(b => unlocked[b.id]).length;
    const earnedEl = document.getElementById('badges-earned-num');
    const totalEl = document.getElementById('badges-total-num');
    const fillEl = document.getElementById('badges-progress-fill');
    const miniEl = document.getElementById('badges-count-mini');
    if (earnedEl) earnedEl.textContent = earned;
    if (totalEl) totalEl.textContent = BADGES.length;
    if (fillEl) fillEl.style.width = (earned / BADGES.length * 100) + '%';
    if (miniEl) miniEl.textContent = earned;
  };

  const showConfetti = () => {
    const container = document.createElement('div');
    container.className = 'badge-confetti';
    const colors = ['#ffbd2e', '#7b2cbf', '#00d4ff', '#ff6b6b', '#51cf66', '#ffd43b'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = (Math.random() * 0.4) + 's';
      piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
      container.appendChild(piece);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4000);
  };

  const showToast = (badge) => {
    const existing = document.querySelector('.badge-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.innerHTML = '<div class="badge-toast-icon"><i class="fas ' + badge.icon + '"></i></div><div class="badge-toast-text"><span class="badge-toast-label">🎉 Badge Unlocked!</span><span class="badge-toast-name">' + badge.name + '</span></div>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 600); }, 3500);
  };

  const tryUnlock = (badge) => {
    if (unlocked[badge.id]) return;
    unlocked[badge.id] = Date.now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked)); } catch (e) {}
    renderGrid();
    updateCounters();
    setTimeout(() => {
      const card = grid.querySelector('[data-badge="' + badge.id + '"]');
      if (card) { card.classList.add('just-unlocked'); setTimeout(() => card.classList.remove('just-unlocked'), 800); }
    }, 50);
    showConfetti();
    showToast(badge);
  };

  const checkAll = () => {
    BADGES.forEach(b => {
      if (unlocked[b.id]) return;
      try { if (b.check()) tryUnlock(b); } catch (e) {}
    });
  };

  renderGrid();
  updateCounters();

  if (!unlocked.first_visit) {
    setTimeout(() => tryUnlock(BADGES.find(b => b.id === 'first_visit')), 800);
  }

  let bottomCheck = false;
  const onScroll = () => {
    if (bottomCheck) return;
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
      bottomCheck = true;
      window._ajh_scrolledBottom = true;
      if (!unlocked.scroll_deep) tryUnlock(BADGES.find(b => b.id === 'scroll_deep'));
    }
  };
  window.addEventListener('scroll', debounce(onScroll, 400), { passive: true });

  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      window._ajh_themeToggled = true;
      if (!unlocked.theme_toggler) tryUnlock(BADGES.find(b => b.id === 'theme_toggler'));
    });
  }

  let lastFavCount = 0;
  setInterval(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('ajh_quote_favs') || '[]');
      if (favs.length !== lastFavCount) {
        lastFavCount = favs.length;
        if (favs.length >= 5 && !unlocked.quote_lover) tryUnlock(BADGES.find(b => b.id === 'quote_lover'));
      }
    } catch (e) {}
  }, 1000);

  setInterval(() => { if ((window._ajh_kbHits || 0) >= 10 && !unlocked.keyboard_warrior) tryUnlock(BADGES.find(b => b.id === 'keyboard_warrior')); }, 500);
  setInterval(() => { if (window._ajh_musicPlayed && !unlocked.music_fan) tryUnlock(BADGES.find(b => b.id === 'music_fan')); }, 1000);
  setInterval(() => { if (window._ajh_paletteOpened && !unlocked.command_k) tryUnlock(BADGES.find(b => b.id === 'command_k')); }, 500);
  setInterval(() => { if (window._ajh_easterEgg && !unlocked.secret_finder) tryUnlock(BADGES.find(b => b.id === 'secret_finder')); }, 500);
  setInterval(() => {
    try {
      const count = parseInt(localStorage.getItem('ajh_modals_opened') || '0', 10);
      if (count >= 3 && !unlocked.curious_explorer) tryUnlock(BADGES.find(b => b.id === 'curious_explorer'));
    } catch (e) {}
  }, 1000);

  if (!unlocked.streak_7) {
    const streakBadge = BADGES.find(b => b.id === 'streak_7');
    try { if (streakBadge.check()) tryUnlock(streakBadge); } catch (e) {}
  }

  setInterval(checkAll, 30000);

  const badgesBtn = document.getElementById('badges-btn');
  if (badgesBtn) {
    badgesBtn.addEventListener('click', () => {
      const target = document.getElementById('badges');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  console.log('🏆 Achievement Badges loaded - ' + Object.keys(unlocked).length + '/' + BADGES.length + ' unlocked');
}

// ========================================
// Day 55 - Daily Plan Board (Now / Next / Later)
// ========================================
function initPlanBoard() {
  const board = document.querySelector('.plan-board');
  if (!board) return;

  const STORAGE_KEY = 'ajh_plan_board_v1';
  const ORDER = ['now', 'next', 'later'];
  const DEFAULT_BOARD = {
    now: [
      { id: 'day-55-build', title: 'Day 55 build — Daily Plan Board', meta: 'in progress · today', done: false },
      { id: 'focus-tracker', title: 'Focus session tracker (Pomodoro log)', meta: 'active · in progress', done: false }
    ],
    next: [
      { id: 'code-snippets', title: 'Code snippets library with copy-to-clipboard', meta: 'up next · tomorrow', done: false },
      { id: 'reading-list', title: 'Reading list widget with progress', meta: 'up next · this week', done: false }
    ],
    later: [
      { id: 'vault-v10', title: 'Vault V10 — next-gen gaming hub', meta: 'future · this quarter', done: false },
      { id: 'mobile-app', title: 'AJH mobile companion app', meta: 'future · someday', done: false }
    ]
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_BOARD));
      const parsed = JSON.parse(raw);
      ORDER.forEach(col => { if (!Array.isArray(parsed[col])) parsed[col] = []; });
      return parsed;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_BOARD));
    }
  };

  const save = (data) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  };

  const nextStatus = (current) => {
    if (current === 'now') return 'next';
    if (current === 'next') return 'later';
    return 'now';
  };

  const arrowIcon = (current) => current === 'later' ? 'fa-arrow-left' : 'fa-arrow-right';
  const arrowLabel = (current) => current === 'later' ? 'Move to Now' : 'Move forward';

  const render = (data) => {
    ORDER.forEach(status => {
      const list = document.getElementById('plan-' + status + '-list');
      const count = document.getElementById('plan-' + status + '-count');
      if (!list) return;
      list.innerHTML = '';
      const items = data[status] || [];
      items.forEach(item => list.appendChild(createItem(status, item)));
      if (count) count.textContent = items.length;
    });
    updateSummary(data);
  };

  const createItem = (status, item) => {
    const li = document.createElement('li');
    li.className = 'plan-item' + (item.done ? ' done' : '');
    li.draggable = true;
    li.dataset.id = item.id;
    li.dataset.status = status;
    li.innerHTML = `
      <span class="plan-check" data-action="toggle" aria-label="Mark shipped"><i class="fas fa-check"></i></span>
      <div class="plan-item-body">
        <span class="plan-title">${escapeHtml(item.title)}</span>
        <span class="plan-meta">${escapeHtml(item.meta || 'plan item')}</span>
      </div>
      <button class="plan-action" data-action="advance" aria-label="${arrowLabel(status)}"><i class="fas ${arrowIcon(status)}"></i></button>
      <button class="plan-remove" data-action="remove" aria-label="Remove"><i class="fas fa-times"></i></button>
    `;
    return li;
  };

  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const updateSummary = (data) => {
    const total = ORDER.reduce((acc, s) => acc + (data[s] || []).length, 0);
    const shipped = ORDER.reduce((acc, s) => acc + (data[s] || []).filter(i => i.done).length, 0);
    const pct = total ? Math.round((shipped / total) * 100) : 0;
    const totalEl = document.getElementById('plan-total');
    const compEl = document.getElementById('plan-completed');
    const pctEl = document.getElementById('plan-progress-pct');
    if (totalEl) totalEl.textContent = total;
    if (compEl) compEl.textContent = shipped;
    if (pctEl) pctEl.textContent = pct + '%';
  };

  let data = load();
  render(data);

  board.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const li = actionEl.closest('.plan-item');
    if (!li) return;
    const id = li.dataset.id;
    const status = li.dataset.status;
    const action = actionEl.dataset.action;

    if (action === 'toggle') {
      const item = (data[status] || []).find(i => i.id === id);
      if (item) item.done = !item.done;
    } else if (action === 'advance') {
      const list = data[status] || [];
      const idx = list.findIndex(i => i.id === id);
      if (idx < 0) return;
      const [item] = list.splice(idx, 1);
      const target = nextStatus(status);
      data[target] = data[target] || [];
      data[target].push(item);
    } else if (action === 'remove') {
      data[status] = (data[status] || []).filter(i => i.id !== id);
    }
    save(data);
    render(data);
  });

  board.addEventListener('dragstart', (e) => {
    const li = e.target.closest('.plan-item');
    if (!li) return;
    li.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: li.dataset.id, from: li.dataset.status }));
  });

  board.addEventListener('dragend', (e) => {
    const li = e.target.closest('.plan-item');
    if (li) li.classList.remove('dragging');
    document.querySelectorAll('.plan-list.drag-over').forEach(el => el.classList.remove('drag-over'));
  });

  board.addEventListener('dragover', (e) => {
    const list = e.target.closest('.plan-list');
    if (!list) return;
    e.preventDefault();
    list.classList.add('drag-over');
  });

  board.addEventListener('dragleave', (e) => {
    const list = e.target.closest('.plan-list');
    if (list && (!e.relatedTarget || !list.contains(e.relatedTarget))) list.classList.remove('drag-over');
  });

  board.addEventListener('drop', (e) => {
    const list = e.target.closest('.plan-list');
    if (!list) return;
    e.preventDefault();
    list.classList.remove('drag-over');
    let payload;
    try { payload = JSON.parse(e.dataTransfer.getData('text/plain') || '{}'); } catch (err) { return; }
    const target = list.dataset.status;
    if (!target || !payload.id || !payload.from) return;
    const fromList = data[payload.from] || [];
    const idx = fromList.findIndex(i => i.id === payload.id);
    if (idx < 0) return;
    const [item] = fromList.splice(idx, 1);
    data[target] = data[target] || [];
    data[target].push(item);
    save(data);
    render(data);
  });

  document.querySelectorAll('.plan-add').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const target = form.dataset.target;
      const input = form.querySelector('.plan-input');
      const title = (input.value || '').trim();
      if (!title) return;
      const id = 'plan-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      data[target] = data[target] || [];
      data[target].push({ id, title, meta: 'new · just added', done: false });
      input.value = '';
      save(data);
      render(data);
    });
  });

  const resetBtn = document.getElementById('plan-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset the plan board to defaults?')) return;
      data = JSON.parse(JSON.stringify(DEFAULT_BOARD));
      save(data);
      render(data);
    });
  }

  const planHeroBtn = document.getElementById('plan-btn');
  if (planHeroBtn) {
    planHeroBtn.addEventListener('click', () => {
      const target = document.getElementById('plan');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const snippetsHeroBtn = document.getElementById('snippets-btn');
  if (snippetsHeroBtn) {
    snippetsHeroBtn.addEventListener('click', () => {
      const target = document.getElementById('snippets');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  console.log('📋 Daily Plan Board loaded - drag, check, or add new items');
}
// ============================================
// DAY 56: CODE SNIPPETS VAULT
// ============================================
function initSnippetsVault() {
  const STORAGE_KEY = 'ajh_snippets_v1';
  const STATS_KEY = 'ajh_snippets_stats_v1';
  const grid = document.getElementById('snippets-grid');
  const searchInput = document.getElementById('snippets-search');
  const filtersHost = document.getElementById('snippets-filters');
  const addBtn = document.getElementById('snippet-add-btn');
  const empty = document.getElementById('snippets-empty');
  const totalEl = document.getElementById('snippets-total');
  const shownEl = document.getElementById('snippets-shown');
  const langsEl = document.getElementById('snippets-languages');
  const copiesEl = document.getElementById('snippets-copies');
  const resetBtn = document.getElementById('snippets-reset');

  if (!grid) return;

  // Seed library
  const SEED = [
    { title: 'Debounce', language: 'JavaScript', tags: ['utility', 'performance'], code: 'function debounce(fn, wait = 200) {\n  let t;\n  return function (...args) {\n    clearTimeout(t);\n    t = setTimeout(() => fn.apply(this, args), wait);\n  };\n}' },
    { title: 'Copy to Clipboard', language: 'JavaScript', tags: ['utility', 'dom'], code: 'async function copyText(text) {\n  try {\n    await navigator.clipboard.writeText(text);\n    return true;\n  } catch (e) {\n    const ta = document.createElement("textarea");\n    ta.value = text;\n    document.body.appendChild(ta);\n    ta.select();\n    document.execCommand("copy");\n    ta.remove();\n    return true;\n  }\n}' },
    { title: 'Smooth Scroll to Element', language: 'JavaScript', tags: ['dom', 'animation'], code: 'function scrollToElement(selector, offset = 0) {\n  const el = document.querySelector(selector);\n  if (!el) return;\n  const top = el.getBoundingClientRect().top + window.scrollY - offset;\n  window.scrollTo({ top, behavior: "smooth" });\n}' },
    { title: 'Fetch with Timeout', language: 'JavaScript', tags: ['network', 'utility'], code: 'async function fetchWithTimeout(url, opts = {}, ms = 8000) {\n  const ctrl = new AbortController();\n  const t = setTimeout(() => ctrl.abort(), ms);\n  try {\n    const res = await fetch(url, { ...opts, signal: ctrl.signal });\n    return res;\n  } finally {\n    clearTimeout(t);\n  }\n}' },
    { title: 'useLocalStorage Hook', language: 'TypeScript', tags: ['react', 'hooks', 'state'], code: "import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {\n  const [value, setValue] = useState<T>(() => {\n    try {\n      const raw = localStorage.getItem(key);\n      return raw ? JSON.parse(raw) : initial;\n    } catch { return initial; }\n  });\n  useEffect(() => {\n    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}\n  }, [key, value]);\n  return [value, setValue];\n}" },
    { title: 'Flex Centering', language: 'CSS', tags: ['layout', 'utility'], code: '.center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}' },
    { title: 'CSS Glass Card', language: 'CSS', tags: ['glassmorphism', 'effect'], code: '.glass {\n  background: rgba(255, 255, 255, 0.08);\n  backdrop-filter: blur(14px);\n  -webkit-backdrop-filter: blur(14px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 14px;\n}' },
    { title: 'Responsive Meta Tag', language: 'HTML', tags: ['meta', 'mobile'], code: '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#0a0a0a">' },
    { title: 'Find & Replace in Files', language: 'Bash', tags: ['git', 'shell'], code: '# Replace "oldApi" with "newApi" across all .ts files\ngrep -rl "oldApi" src/ | xargs sed -i \'s/oldApi/newApi/g\'' },
    { title: 'List Git Branches by Date', language: 'Bash', tags: ['git'], code: 'git for-each-ref --sort=-committerdate refs/heads/ --format="%(committerdate:short) %(refname:short)"' },
    { title: 'Python HTTP Server', language: 'Python', tags: ['server', 'utility'], code: 'import http.server, socketserver, sys\nPORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000\nwith socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:\n    print(f"Serving on http://localhost:{PORT}")\n    httpd.serve_forever()' },
    { title: 'Pretty Print JSON', language: 'JavaScript', tags: ['json', 'utility'], code: 'const pretty = (obj) => JSON.stringify(obj, null, 2);\nconsole.log(pretty({ a: 1, b: [1, 2, 3] }));' }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        return SEED.slice();
      }
      return JSON.parse(raw);
    } catch (e) {
      return SEED.slice();
    }
  }

  function save(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { copies: 0 }; }
    catch (e) { return { copies: 0 }; }
  }
  function saveStats(s) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  let snippets = load();
  let stats = loadStats();
  let activeFilter = 'all';
  let activeQuery = '';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function render() {
    const q = activeQuery.trim().toLowerCase();
    const filtered = snippets.filter((sn) => {
      if (activeFilter !== 'all' && sn.language !== activeFilter) return false;
      if (!q) return true;
      const hay = (sn.title + ' ' + sn.language + ' ' + (sn.tags || []).join(' ') + ' ' + sn.code).toLowerCase();
      return hay.includes(q);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      empty.hidden = false;
    } else {
      empty.hidden = true;
      grid.innerHTML = filtered.map((sn, i) => `
        <article class="snippet-card" data-id="${escapeHtml(sn.id)}" style="animation: fadeInUp 0.35s ease ${i * 30}ms both">
          <div class="snippet-card-header">
            <span class="snippet-lang" data-lang="${escapeHtml(sn.language)}">${escapeHtml(sn.language)}</span>
            <h3 class="snippet-title">${escapeHtml(sn.title)}</h3>
          </div>
          ${(sn.tags && sn.tags.length) ? `<div class="snippet-tags">${sn.tags.map((t) => `<span class="snippet-tag-pill">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          <pre class="snippet-code"><code>${escapeHtml(sn.code)}</code></pre>
          <div class="snippet-card-actions">
            <button class="copy-btn" data-action="copy" title="Copy to clipboard">
              <i class="fas fa-copy"></i> <span>Copy</span>
            </button>
            <button class="edit-btn" data-action="edit" title="Edit snippet">
              <i class="fas fa-pen"></i> <span>Edit</span>
            </button>
            <button class="delete-btn" data-action="delete" title="Delete snippet">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </article>
      `).join('');
    }

    totalEl.textContent = snippets.length;
    shownEl.textContent = filtered.length;
    const langs = new Set(snippets.map((s) => s.language));
    langsEl.textContent = langs.size;
    copiesEl.textContent = stats.copies;
  }

  // ---- Card actions (event delegation) ----
  grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const card = btn.closest('.snippet-card');
    if (!card) return;
    const id = card.dataset.id;
    const sn = snippets.find((s) => s.id === id);
    if (!sn) return;
    const action = btn.dataset.action;

    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(sn.code);
        stats.copies = (stats.copies || 0) + 1;
        saveStats(stats);
        copiesEl.textContent = stats.copies;
        btn.classList.add('copied');
        const label = btn.querySelector('span');
        const old = label ? label.textContent : '';
        if (label) label.textContent = 'Copied!';
        card.classList.add('flash');
        setTimeout(() => {
          btn.classList.remove('copied');
          if (label) label.textContent = old || 'Copy';
          card.classList.remove('flash');
        }, 1100);
        showNotification && showNotification(`Copied "${sn.title}" to clipboard`, 'success');
      } catch (err) {
        showNotification && showNotification('Copy failed — clipboard blocked', 'error');
      }
    } else if (action === 'edit') {
      openModal(sn);
    } else if (action === 'delete') {
      if (confirm(`Delete "${sn.title}"?`)) {
        snippets = snippets.filter((s) => s.id !== id);
        save(snippets);
        render();
        showNotification && showNotification(`Deleted "${sn.title}"`, 'info');
      }
    }
  });

  // ---- Search ----
  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      activeQuery = e.target.value;
      render();
    }, 90);
  });

  // ---- Filters ----
  filtersHost.addEventListener('click', (e) => {
    const btn = e.target.closest('.snippet-filter');
    if (!btn) return;
    filtersHost.querySelectorAll('.snippet-filter').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });

  // ---- Add button ----
  addBtn.addEventListener('click', () => openModal(null));

  // ---- Reset ----
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset to starter snippets? This will replace your current library.')) {
      snippets = SEED.slice();
      save(snippets);
      render();
      showNotification && showNotification('Library reset to starter snippets', 'success');
    }
  });

  // ---- Modal logic ----
  const modal = document.getElementById('snippet-modal');
  const form = document.getElementById('snippet-form');
  const idField = document.getElementById('snippet-id');
  const titleField = document.getElementById('snippet-title');
  const langField = document.getElementById('snippet-language');
  const tagsField = document.getElementById('snippet-tags');
  const codeField = document.getElementById('snippet-code');
  const charcount = document.getElementById('snippet-charcount');
  const modalTitle = document.getElementById('snippet-modal-title');

  function openModal(snippet) {
    if (snippet) {
      modalTitle.textContent = 'Edit Snippet';
      idField.value = snippet.id;
      titleField.value = snippet.title;
      langField.value = snippet.language;
      tagsField.value = (snippet.tags || []).join(', ');
      codeField.value = snippet.code;
    } else {
      modalTitle.textContent = 'New Snippet';
      form.reset();
      idField.value = '';
    }
    charcount.textContent = `${codeField.value.length} chars`;
    modal.hidden = false;
    setTimeout(() => titleField.focus(), 30);
  }
  function closeModal() { modal.hidden = true; }
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') { e.preventDefault(); closeModal(); }
  });

  codeField.addEventListener('input', () => {
    charcount.textContent = `${codeField.value.length} chars`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleField.value.trim();
    const code = codeField.value;
    if (!title || !code) return;
    const id = idField.value || ('sn-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    const language = langField.value;
    const tags = tagsField.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const existingIdx = snippets.findIndex((s) => s.id === id);
    const next = { id, title, language, tags, code };
    if (existingIdx >= 0) {
      snippets[existingIdx] = next;
      showNotification && showNotification(`Updated "${title}"`, 'success');
    } else {
      snippets.unshift(next);
      showNotification && showNotification(`Added "${title}"`, 'success');
    }
    save(snippets);
    render();
    closeModal();
  });

  // ---- Keyboard shortcut: Ctrl/Cmd + Shift + C to add ----
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
      // Avoid hijacking if any other input is focused unless it's not the modal
      e.preventDefault();
      openModal(null);
    }
  });

  render();
}

// Wire up snippets into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initSnippetsVault();
});

// Also expose for the command palette
window.initSnippetsVault = initSnippetsVault;
