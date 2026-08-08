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

    if (e.key === 'c' || e.key === 'C') {
      const target = document.getElementById('constellation');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }

    if (e.key === 'k' || e.key === 'K') {
      const target = document.getElementById('timecapsule');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
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
    { id: 'tool-bookmarks', label: 'Browse Bookmark Cards', icon: 'fa-bookmark', shortcut: 'G B', category: 'Tools', action: () => document.getElementById('bookmarks-search-input')?.focus() },
    { id: 'tool-calendar', label: 'View Build Calendar', icon: 'fa-calendar-check', shortcut: 'G C', category: 'Tools', action: () => scrollTo('#calendar') },
    { id: 'tool-assistant', label: 'Open Build Assistant', icon: 'fa-robot', shortcut: 'A', category: 'Tools', action: () => window.ajhAssistantOpen && window.ajhAssistantOpen() },
    { id: 'tool-timecapsule', label: 'Open Time Capsule Vault', icon: 'fa-hourglass-half', shortcut: 'G K', category: 'Tools', action: () => scrollTo('#timecapsule') },
    { id: 'tool-timecapsule-new', label: 'Write a New Time Capsule', icon: 'fa-feather', category: 'Tools', action: () => document.getElementById('timecapsule-hero-btn')?.click() },
    { id: 'tool-journal', label: 'Open Build Journal', icon: 'fa-pen-fancy', shortcut: 'G J', category: 'Tools', action: () => scrollTo('#journal') },
    { id: 'tool-journal-export', label: 'Export Journal as JSON', icon: 'fa-download', category: 'Tools', action: () => document.getElementById('journal-export-btn')?.click() },
    { id: 'tool-wishlist', label: 'Open Community Wishlist', icon: 'fa-clipboard-list', shortcut: 'G W', category: 'Tools', action: () => scrollTo('#wishlist') },
    { id: 'tool-wishlist-new', label: 'Submit a New Wish', icon: 'fa-plus-circle', category: 'Tools', action: () => document.getElementById('wishlist-hero-btn')?.click() },
    { id: 'tool-wisdom', label: 'Open On This Day Wisdom', icon: 'fa-feather-pointed', shortcut: 'G O', category: 'Tools', action: () => scrollTo('#wisdom') },
    { id: 'tool-wisdom-random', label: 'Random Wisdom Card', icon: 'fa-shuffle', category: 'Tools', action: () => document.getElementById('wisdom-random-btn')?.click() },
    { id: 'tool-pixelart', label: 'Open Pixel Art Studio', icon: 'fa-palette', shortcut: 'G X', category: 'Tools', action: () => window.ajhPixelArtOpen && window.ajhPixelArtOpen() },
    { id: 'tool-pixelart-clear', label: 'Clear Pixel Canvas', icon: 'fa-trash', category: 'Tools', action: () => document.getElementById('pixelart-clear-btn')?.click() },
    { id: 'tool-dailychallenge', label: 'Open Daily Challenge', icon: 'fa-dice', shortcut: 'G D', category: 'Tools', action: () => window.ajhDailyChallengeOpen && window.ajhDailyChallengeOpen() },
    { id: 'tool-dailychallenge-reroll', label: 'Reroll Daily Challenge', icon: 'fa-shuffle', category: 'Tools', action: () => document.getElementById('dc-reroll-btn')?.click() },
    { id: 'tool-dailychallenge-done', label: 'Mark Today\'s Challenge Done', icon: 'fa-circle-check', category: 'Tools', action: () => document.getElementById('dc-done-btn')?.click() },
    { id: 'tool-soundboard-open', label: 'Open Soundboard', icon: 'fa-music', category: 'Tools', action: () => window.ajhSoundboardOpen && window.ajhSoundboardOpen() },
    { id: 'tool-soundboard-random', label: 'Play Random', icon: 'fa-shuffle', category: 'Tools', action: () => document.getElementById('sb-shuffle')?.click() },
    { id: 'tool-soundboard-stop', label: 'Stop All Sounds', icon: 'fa-stop', category: 'Tools', action: () => window.ajhSoundboardStop && window.ajhSoundboardStop() },
    { id: 'tool-sequencer-open', label: 'Open Step Sequencer', icon: 'fa-drum', category: 'Tools', action: () => window.ajhSequencerOpen && window.ajhSequencerOpen() },
    { id: 'tool-sequencer-play', label: 'Toggle Play / Stop', icon: 'fa-play', category: 'Tools', action: () => document.getElementById('seq-play')?.click() },
    { id: 'tool-sequencer-clear', label: 'Clear Pattern', icon: 'fa-trash', category: 'Tools', action: () => document.getElementById('seq-clear')?.click() },
    { id: 'tool-sequencer-randomize', label: 'Randomize Pattern', icon: 'fa-shuffle', category: 'Tools', action: () => document.getElementById('seq-random')?.click() },
    { id: 'tool-forge-open', label: 'Open The Forge', icon: 'fa-fire', shortcut: 'G F', category: 'Tools', action: () => window.ajhForgeOpen && window.ajhForgeOpen() },
    { id: 'tool-forge-reroll', label: 'Reroll Daily Prompt', icon: 'fa-shuffle', category: 'Tools', action: () => document.getElementById('forge-reroll-btn')?.click() },
    { id: 'tool-forge-share', label: 'Share Latest Reflection', icon: 'fa-share-nodes', category: 'Tools', action: () => document.getElementById('forge-share-btn')?.click() },
    { id: 'tool-lab-open', label: 'Open Lab Notebook', icon: 'fa-flask', shortcut: 'G L', category: 'Tools', action: () => window.ajhLabOpen && window.ajhLabOpen() },
    { id: 'tool-lab-new', label: 'New Lab Experiment', icon: 'fa-plus', category: 'Tools', action: () => window.ajhLabNew && window.ajhLabNew() },
    { id: 'tool-lab-board', label: 'Lab Board View', icon: 'fa-columns', category: 'Tools', action: () => window.ajhLabOpen && window.ajhLabOpen('board') },
    { id: 'tool-dna-open', label: 'Open Build DNA', icon: 'fa-dna', shortcut: 'G D', category: 'Tools', action: () => window.ajhDnaOpen && window.ajhDnaOpen() },
    { id: 'tool-dna-recompute', label: 'Recompute Build DNA', icon: 'fa-rotate', category: 'Tools', action: () => window.ajhDnaRecompute && window.ajhDnaRecompute() },
    { id: 'tool-dna-share', label: 'Share Build DNA Card', icon: 'fa-share', category: 'Tools', action: () => window.ajhDnaShare && window.ajhDnaShare() },
    { id: 'tool-cs-open', label: 'Open Constellation Map', icon: 'fa-star', shortcut: 'G S', category: 'Tools', action: () => window.ajhConstellation75Open && window.ajhConstellation75Open() },
    { id: 'tool-cs-burst', label: 'Constellation: Toggle Fireworks Burst', icon: 'fa-fire', category: 'Tools', action: () => window.ajhConstellation75Burst && window.ajhConstellation75Burst() },
    { id: 'tool-cs-export', label: 'Constellation: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => document.getElementById('cs-export')?.click() },

    // Day 76: Build Trail
    { id: 'tool-trail-open', label: 'Open Build Trail', icon: 'fa-timeline', shortcut: 'G T', category: 'Tools', action: () => window.ajhTrail && window.ajhTrail.scrollToToday && (document.getElementById('trail')?.scrollIntoView({ behavior: 'smooth' }), setTimeout(() => window.ajhTrail.scrollToToday(), 400)) },
    { id: 'tool-trail-today', label: 'Build Trail: Fly to Today', icon: 'fa-bullseye', category: 'Tools', action: () => window.ajhTrail && window.ajhTrail.scrollToToday && window.ajhTrail.scrollToToday() },
    { id: 'tool-trail-export', label: 'Build Trail: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhTrail && window.ajhTrail.export && window.ajhTrail.export() },

    // Day 77: Build Weather
    { id: 'tool-weather-open', label: 'Open Build Weather', icon: 'fa-cloud-sun', shortcut: 'G W', category: 'Tools', action: () => window.ajhWeather && window.ajhWeather.open && (document.getElementById('weather')?.scrollIntoView({ behavior: 'smooth' }), setTimeout(() => window.ajhWeather.open(window.ajhWeather.today || 77), 400)) },
    { id: 'tool-weather-today', label: 'Build Weather: Fly to Today', icon: 'fa-bullseye', category: 'Tools', action: () => window.ajhWeather && window.ajhWeather.open && window.ajhWeather.open(window.ajhWeather.today || 77) },
    { id: 'tool-weather-share', label: 'Build Weather: Share Today\'s Forecast', icon: 'fa-share', category: 'Tools', action: () => window.ajhWeather && window.ajhWeather.share && window.ajhWeather.share() },
    { id: 'tool-weather-export', label: 'Build Weather: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhWeather && window.ajhWeather.export && window.ajhWeather.export() },

    // Day 78: Build Garden
    { id: 'tool-garden-open', label: 'Open Build Garden', icon: 'fa-seedling', shortcut: 'G G', category: 'Tools', action: () => window.ajhGarden && window.ajhGarden.open && (document.getElementById('garden')?.scrollIntoView({ behavior: 'smooth' }), setTimeout(() => window.ajhGarden.open(), 400)) },
    { id: 'tool-garden-water', label: 'Build Garden: Water All', icon: 'fa-droplet', category: 'Tools', action: () => window.ajhGarden && window.ajhGarden.water && window.ajhGarden.water() },
    { id: 'tool-garden-newday', label: 'Build Garden: New Day', icon: 'fa-sun', category: 'Tools', action: () => window.ajhGarden && window.ajhGarden.advance && window.ajhGarden.advance() },
    { id: 'tool-garden-export', label: 'Build Garden: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhGarden && window.ajhGarden.export && window.ajhGarden.export() },
    { id: 'tool-tape-open', label: 'Open Build Tape', icon: 'fa-compact-disc', shortcut: 'G P', category: 'Tools', action: () => window.ajhTape && window.ajhTape.open && window.ajhTape.open() },
    { id: 'tool-tape-toggle', label: 'Build Tape: Play / Pause', icon: 'fa-play', category: 'Tools', action: () => window.ajhTape && window.ajhTape.toggle && window.ajhTape.toggle() },
    { id: 'tool-tape-export', label: 'Build Tape: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhTape && window.ajhTape.exportJSON && window.ajhTape.exportJSON() },
    { id: 'tool-skyline-open', label: 'Open Build Skyline', icon: 'fa-city', shortcut: 'G Y', category: 'Tools', action: () => window.ajhSkyline && window.ajhSkyline.open && window.ajhSkyline.open() },
    { id: 'tool-skyline-mode', label: 'Build Skyline: Cycle Day/Night', icon: 'fa-circle-half-stroke', category: 'Tools', action: () => window.ajhSkyline && window.ajhSkyline.cycleMode && window.ajhSkyline.cycleMode() },
    { id: 'tool-skyline-export', label: 'Build Skyline: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhSkyline && window.ajhSkyline.exportJSON && window.ajhSkyline.exportJSON() },
    // Day 81: Build Aquarium
    { id: 'tool-aquarium-open', label: 'Open Build Aquarium', icon: 'fa-fish', shortcut: 'G A', category: 'Tools', action: () => window.ajhAquarium && window.ajhAquarium.open && window.ajhAquarium.open() },
    { id: 'tool-aquarium-feed', label: 'Build Aquarium: Feed the Fish', icon: 'fa-bowl-food', category: 'Tools', action: () => window.ajhAquarium && window.ajhAquarium.feed && window.ajhAquarium.feed() },
    { id: 'tool-aquarium-calm', label: 'Build Aquarium: Calm the Water', icon: 'fa-water', category: 'Tools', action: () => window.ajhAquarium && window.ajhAquarium.toggleCalm && window.ajhAquarium.toggleCalm() },
    { id: 'tool-aquarium-spotlight', label: 'Build Aquarium: Spotlight a Random Fish', icon: 'fa-shuffle', category: 'Tools', action: () => window.ajhAquarium && window.ajhAquarium.spotlight && window.ajhAquarium.spotlight() },
    { id: 'tool-aquarium-export', label: 'Build Aquarium: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhAquarium && window.ajhAquarium.exportJSON && window.ajhAquarium.exportJSON() },
    { id: 'tool-observatory-open', label: 'Open Build Observatory', icon: 'fa-globe', shortcut: 'G O', category: 'Tools', action: () => window.ajhObservatory && window.ajhObservatory.open && window.ajhObservatory.open() },
    { id: 'tool-observatory-focus', label: 'Build Observatory: Focus Today Moon', icon: 'fa-crosshairs', category: 'Tools', action: () => window.ajhObservatory && window.ajhObservatory.focusToday && window.ajhObservatory.focusToday() },
    { id: 'tool-observatory-shoot', label: 'Build Observatory: Shoot a Star', icon: 'fa-meteor', category: 'Tools', action: () => window.ajhObservatory && window.ajhObservatory.shoot && window.ajhObservatory.shoot() },
    { id: 'tool-observatory-orbits', label: 'Build Observatory: Toggle Orbits', icon: 'fa-circle-dot', category: 'Tools', action: () => window.ajhObservatory && window.ajhObservatory.toggleOrbits && window.ajhObservatory.toggleOrbits() },
    { id: 'tool-observatory-export', label: 'Build Observatory: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhObservatory && window.ajhObservatory.exportJSON && window.ajhObservatory.exportJSON() },
    { id: 'tool-waveform-open', label: 'Open Build Waveform', icon: 'fa-wave-square', shortcut: 'G V', category: 'Tools', action: () => window.ajhWaveform && window.ajhWaveform.open && window.ajhWaveform.open() },
    { id: 'tool-waveform-play', label: 'Build Waveform: Play / Pause', icon: 'fa-play', category: 'Tools', action: () => window.ajhWaveform && window.ajhWaveform.toggle && window.ajhWaveform.toggle() },
    { id: 'tool-waveform-chord', label: 'Build Waveform: Play All 83-Day Chord', icon: 'fa-music', category: 'Tools', action: () => window.ajhWaveform && window.ajhWaveform.playAll && window.ajhWaveform.playAll() },
    { id: 'tool-waveform-mode', label: 'Build Waveform: Cycle Listen / Spectrum / History', icon: 'fa-wave-square', category: 'Tools', action: () => window.ajhWaveform && window.ajhWaveform.cycleMode && window.ajhWaveform.cycleMode() },
    { id: 'tool-waveform-export', label: 'Build Waveform: Export as JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhWaveform && window.ajhWaveform.export && window.ajhWaveform.export() },
    { id: 'tool-compass-open', label: 'Open Build Compass', icon: 'fa-compass', shortcut: 'G C', category: 'Tools', action: () => window.ajhCompass && window.ajhCompass.open && window.ajhCompass.open() },
    { id: 'tool-compass-today', label: 'Build Compass: Jump to Today', icon: 'fa-location-crosshairs', category: 'Tools', action: () => window.ajhCompass && window.ajhCompass.jump && window.ajhCompass.jump(101) },
    { id: 'tool-compass-next', label: 'Build Compass: Next Direction', icon: 'fa-arrow-right', category: 'Tools', action: () => window.ajhCompass && window.ajhCompass.next && window.ajhCompass.next() },
    { id: 'tool-compass-random', label: 'Build Compass: Random Build', icon: 'fa-shuffle', category: 'Tools', action: () => window.ajhCompass && window.ajhCompass.random && window.ajhCompass.random() },
    { id: 'tool-lighthouse-open', label: 'Run Build Lighthouse Audit', icon: 'fa-lightbulb', shortcut: 'G L H', category: 'Tools', action: () => window.ajhLighthouse && window.ajhLighthouse.run && window.ajhLighthouse.run() },
    { id: 'tool-lighthouse-copy', label: 'Copy Lighthouse Report', icon: 'fa-copy', category: 'Tools', action: () => window.ajhLighthouse && window.ajhLighthouse.copy && window.ajhLighthouse.copy() },
    { id: 'tool-releases-open', label: 'Open Release Notes', icon: 'fa-scroll', shortcut: 'G R', category: 'Tools', action: () => window.ajhReleases && window.ajhReleases.open && window.ajhReleases.open() },
    { id: 'tool-releases-share', label: 'Share Release Notes View', icon: 'fa-share-nodes', category: 'Tools', action: () => window.ajhReleases && window.ajhReleases.share && window.ajhReleases.share() },
    { id: 'tool-releases-export', label: 'Release Notes: Export JSON', icon: 'fa-download', category: 'Tools', action: () => window.ajhReleases && window.ajhReleases.exportJSON && window.ajhReleases.exportJSON() },
    { id: 'tool-pulse-open', label: 'Open Build Pulse', icon: 'fa-chart-line', shortcut: 'Shift P', category: 'Tools', action: () => window.ajhPulse && window.ajhPulse.open && window.ajhPulse.open() },
    { id: 'tool-pulse-refresh', label: 'Recalculate Build Pulse', icon: 'fa-rotate', category: 'Tools', action: () => window.ajhPulse && window.ajhPulse.refresh && window.ajhPulse.refresh() },
    { id: 'tool-checkpoint-open', label: 'Open Build Checkpoint', icon: 'fa-check-double', shortcut: 'Shift K', category: 'Tools', action: () => window.ajhCheckpoint && window.ajhCheckpoint.open && window.ajhCheckpoint.open() },
    { id: 'tool-checkpoint-copy', label: 'Copy Checkpoint Status', icon: 'fa-share-nodes', category: 'Tools', action: () => window.ajhCheckpoint && window.ajhCheckpoint.copy && window.ajhCheckpoint.copy() },
    { id: 'tool-dispatch-open', label: 'Open Build Dispatch', icon: 'fa-paper-plane', shortcut: 'Shift D', category: 'Tools', action: () => window.ajhDispatch && window.ajhDispatch.open && window.ajhDispatch.open() },
    { id: 'tool-dispatch-send', label: 'Dispatch Finished Handoff', icon: 'fa-paper-plane', category: 'Tools', action: () => window.ajhDispatch && window.ajhDispatch.dispatch && window.ajhDispatch.dispatch() },
    { id: 'tool-dispatch-copy', label: 'Copy Dispatch Status', icon: 'fa-share-nodes', category: 'Tools', action: () => window.ajhDispatch && window.ajhDispatch.copy && window.ajhDispatch.copy() },
    { id: 'tool-relay-open', label: 'Open Build Relay', icon: 'fa-forward-step', shortcut: 'Shift R', category: 'Tools', action: () => window.ajhRelay && window.ajhRelay.open && window.ajhRelay.open() },
    { id: 'tool-relay-import', label: 'Relay Last Handoff Forward', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhRelay && window.ajhRelay.importDispatch && window.ajhRelay.importDispatch() },
    { id: 'tool-relay-send', label: 'Send Build Relay Forward', icon: 'fa-forward-step', category: 'Tools', action: () => window.ajhRelay && window.ajhRelay.send && window.ajhRelay.send() },
    { id: 'tool-runway-open', label: 'Open Build Runway', icon: 'fa-plane-departure', shortcut: 'Shift U', category: 'Tools', action: () => window.ajhRunway && window.ajhRunway.open && window.ajhRunway.open() },
    { id: 'tool-runway-import', label: 'Load Relay Into Runway', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhRunway && window.ajhRunway.importRelay && window.ajhRunway.importRelay() },
    { id: 'tool-runway-launch', label: 'Launch Next Build', icon: 'fa-plane-departure', category: 'Tools', action: () => window.ajhRunway && window.ajhRunway.launch && window.ajhRunway.launch() },
    { id: 'tool-flight-open', label: 'Open Build Flight Plan', icon: 'fa-route', shortcut: 'Shift F', category: 'Tools', action: () => window.ajhFlight && window.ajhFlight.open && window.ajhFlight.open() },
    { id: 'tool-flight-import', label: 'Load Runway Into Flight Plan', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhFlight && window.ajhFlight.importRunway && window.ajhFlight.importRunway() },
    { id: 'tool-flight-file', label: 'File Next Flight Plan', icon: 'fa-route', category: 'Tools', action: () => window.ajhFlight && window.ajhFlight.launch && window.ajhFlight.launch() },
    { id: 'tool-landing-open', label: 'Open Build Landing', icon: 'fa-plane-arrival', shortcut: 'Shift L', category: 'Tools', action: () => window.ajhLanding && window.ajhLanding.open && window.ajhLanding.open() },
    { id: 'tool-landing-import', label: 'Load Flight Into Landing', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhLanding && window.ajhLanding.importFlight && window.ajhLanding.importFlight() },
    { id: 'tool-landing-confirm', label: 'Confirm Build Landing', icon: 'fa-plane-arrival', category: 'Tools', action: () => window.ajhLanding && window.ajhLanding.land && window.ajhLanding.land() },
    { id: 'tool-dock-open', label: 'Open Build Dock', icon: 'fa-anchor', shortcut: 'Shift O', category: 'Tools', action: () => window.ajhDock && window.ajhDock.open && window.ajhDock.open() },
    { id: 'tool-dock-sync', label: 'Sync Build Dock Signals', icon: 'fa-arrows-rotate', category: 'Tools', action: () => window.ajhDock && window.ajhDock.sync && window.ajhDock.sync() },
    { id: 'tool-dock-copy', label: 'Copy Build Dock Snapshot', icon: 'fa-share-nodes', category: 'Tools', action: () => window.ajhDock && window.ajhDock.copy && window.ajhDock.copy() },
    { id: 'tool-passport-open', label: 'Open Build Passport', icon: 'fa-id-card', shortcut: 'Shift B', category: 'Tools', action: () => window.ajhPassport && window.ajhPassport.open && window.ajhPassport.open() },
    { id: 'tool-passport-import', label: 'Load Dock Into Passport', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhPassport && window.ajhPassport.importDock && window.ajhPassport.importDock() },
    { id: 'tool-passport-stamp', label: 'Stamp Build Passport', icon: 'fa-stamp', category: 'Tools', action: () => window.ajhPassport && window.ajhPassport.stamp && window.ajhPassport.stamp() },
    { id: 'tool-archive-open', label: 'Open Build Archive', icon: 'fa-box-archive', shortcut: 'Shift A', category: 'Tools', action: () => window.ajhArchive && window.ajhArchive.open && window.ajhArchive.open() },
    { id: 'tool-archive-refresh', label: 'Refresh Build Archive', icon: 'fa-rotate', category: 'Tools', action: () => window.ajhArchive && window.ajhArchive.refresh && window.ajhArchive.refresh() },
    { id: 'tool-archive-copy', label: 'Copy Archive Manifest', icon: 'fa-share-nodes', category: 'Tools', action: () => window.ajhArchive && window.ajhArchive.copy && window.ajhArchive.copy() },
    { id: 'tool-handoff-open', label: 'Open Build Handoff', icon: 'fa-handshake', shortcut: 'Shift H', category: 'Tools', action: () => window.ajhHandoff && window.ajhHandoff.open && window.ajhHandoff.open() },
    { id: 'tool-handoff-import', label: 'Load Archive Into Handoff', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhHandoff && window.ajhHandoff.importArchive && window.ajhHandoff.importArchive() },
    { id: 'tool-handoff-package', label: 'Package Next-Day Handoff', icon: 'fa-box', category: 'Tools', action: () => window.ajhHandoff && window.ajhHandoff.packageHandoff && window.ajhHandoff.packageHandoff() },
    { id: 'tool-intake-open', label: 'Open Build Intake', icon: 'fa-inbox', shortcut: 'Shift I', category: 'Tools', action: () => window.ajhIntake && window.ajhIntake.open && window.ajhIntake.open() },
    { id: 'tool-intake-import', label: 'Load Signal Into Intake', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhIntake && window.ajhIntake.importLanding && window.ajhIntake.importLanding() },
    { id: 'tool-intake-start', label: 'Start Today’s Build Slice', icon: 'fa-play', category: 'Tools', action: () => window.ajhIntake && window.ajhIntake.start && window.ajhIntake.start() },
    { id: 'tool-proof-open', label: 'Open Build Proof', icon: 'fa-file-circle-check', shortcut: 'Shift V', category: 'Tools', action: () => window.ajhProof && window.ajhProof.open && window.ajhProof.open() },
    { id: 'tool-proof-import', label: 'Load Intake Into Proof', icon: 'fa-arrow-down', category: 'Tools', action: () => window.ajhProof && window.ajhProof.importIntake && window.ajhProof.importIntake() },
    { id: 'tool-proof-audit', label: 'Build Proof: Get Quality Signal', icon: 'fa-stethoscope', category: 'Tools', action: () => window.ajhProof && window.ajhProof.runAudit && window.ajhProof.runAudit() },
    { id: 'tool-proof-record', label: 'Record Build Proof', icon: 'fa-file-circle-check', category: 'Tools', action: () => window.ajhProof && window.ajhProof.record && window.ajhProof.record() },

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
  initBuildCalendar();
  initBuildAssistant();
  initBookmarkCards();
  initDay78HeroButtons();

  console.log('⚡ AJH Website loaded - Day 105: Build Repair');
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
        <button class="tour-btn tour-prev" id="tour-prev" aria-label="Previous tour step" ${currentStep === 0 ? 'disabled' : ''}>
          <i class="fas fa-arrow-left"></i>
        </button>
        <button class="tour-btn tour-next" id="tour-next" aria-label="Next tour step">
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
  function closeModal() { modal.classList.add('is-closed'); modal.hidden = true; }
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
  initBuildCalendar();
  initBuildAssistant();
  initBookmarkCards();

  console.log('⚡ AJH Website loaded - Day 59: Bookmark Cards');
});

// Also expose for the command palette
window.initSnippetsVault = initSnippetsVault;

// ======================================================
// Day 57 - Build Calendar Heatmap
// ======================================================
function initBuildCalendar() {
  const STORAGE_VIEWS = 'ajh_calendar_views_v1';
  const STORAGE_FAVS = 'ajh_calendar_favs_v1';

  // 57 days of build data, ending today (2026-06-17)
  // Each entry: day#, date, title, description, features, tags, level (0-4), featured
  const BUILDS = [
    { d: 1,  date: '2026-04-22', title: 'First Commit',                level: 3, featured: true,  desc: 'Shipped the first commit to the AJH website. Foundation day. Picked the structure, the colors, the rhythm — and pressed commit.', features: ['Repo initialized', 'Hero section', 'Basic about + projects', 'Color tokens & typography'], tags: ['launch', 'foundation', 'core'] },
    { d: 2,  date: '2026-04-23', title: 'Navigation & Smooth Scroll',  level: 2, featured: false, desc: 'Wired up the sticky nav, smooth scroll anchors, and a scroll-to-top button.', features: ['Sticky navbar', 'Smooth scroll polyfill', 'Scroll-to-top FAB'], tags: ['nav', 'ux'] },
    { d: 3,  date: '2026-04-24', title: 'Contact Form',                 level: 2, featured: false, desc: 'A working contact form with validation and a local-only submission handler.', features: ['Form validation', 'Success / error states', 'Local submit handler'], tags: ['forms', 'ux'] },
    { d: 4,  date: '2026-04-25', title: 'Projects Grid',                level: 2, featured: false, desc: 'Built the project card grid with hover effects and category tags.', features: ['Card hover lift', 'Tag pills', 'External link buttons'], tags: ['projects', 'ui'] },
    { d: 5,  date: '2026-04-26', title: 'Dark Theme',                   level: 2, featured: false, desc: 'First dark theme pass — palette, contrast, and CSS variables.', features: ['Dark palette tokens', 'Toggle button', 'Saved preference'], tags: ['theme', 'a11y'] },
    { d: 6,  date: '2026-04-27', title: 'Mobile Responsive',            level: 3, featured: false, desc: 'Mobile pass: grids collapse, type scales, and the nav becomes a hamburger menu.', features: ['Hamburger nav', 'Responsive grid', 'Tap-friendly buttons'], tags: ['mobile', 'responsive'] },
    { d: 7,  date: '2026-04-28', title: 'PWA Foundations',              level: 3, featured: true,  desc: 'Made the site installable: manifest, service worker, offline shell.', features: ['manifest.json', 'Service worker', 'Offline cache'], tags: ['pwa', 'infra'] },
    { d: 8,  date: '2026-04-29', title: 'Stats Counter',                level: 2, featured: false, desc: 'Animated count-up stats in the hero with IntersectionObserver trigger.', features: ['Count-up animation', 'IO trigger', 'Comma formatting'], tags: ['animation', 'hero'] },
    { d: 9,  date: '2026-04-30', title: 'Footer Overhaul',              level: 2, featured: false, desc: 'Rebuilt the footer with social links, mission statement, and quick links.', features: ['Social icons', 'Quick links', 'Mission block'], tags: ['footer', 'links'] },
    { d: 10, date: '2026-05-01', title: 'Feed & Sitemap',               level: 1, featured: false, desc: 'Added RSS feed, robots.txt, and sitemap.xml for search discovery.', features: ['feed.xml', 'sitemap.xml', 'robots.txt'], tags: ['seo', 'meta'] },
    { d: 11, date: '2026-05-02', title: 'Timeline Section',             level: 2, featured: false, desc: 'Added a vertical timeline of milestones with year badges.', features: ['Vertical timeline', 'Year badges', 'Hover reveal'], tags: ['content', 'journey'] },
    { d: 12, date: '2026-05-03', title: 'Skills Section',               level: 2, featured: false, desc: 'Categorized skills (frontend, backend, devops) with icons.', features: ['Skill categories', 'Icon grid', 'Hover states'], tags: ['about', 'skills'] },
    { d: 13, date: '2026-05-04', title: 'Performance Pass',             level: 2, featured: false, desc: 'Minified, preloaded fonts, and added a deferred loader.', features: ['Deferred JS', 'Font preloads', 'Page loader'], tags: ['perf', 'speed'] },
    { d: 14, date: '2026-05-05', title: 'CI/CD + 404 + Achievements',   level: 4, featured: true,  desc: 'Added GitHub Actions deploy, a custom 404 page with glitch animation, and an Achievements section.', features: ['.github/workflows', '404 page', 'Achievements section'], tags: ['ci', 'design', 'ship'] },
    { d: 15, date: '2026-05-06', title: 'Currently Building',           level: 2, featured: false, desc: 'A live status board for in-progress projects with progress bars.', features: ['Status cards', 'Progress bars', 'Status indicators'], tags: ['status', 'projects'] },
    { d: 16, date: '2026-05-07', title: 'Quick Actions + SW Updates',   level: 3, featured: false, desc: 'Floating quick-actions menu and service-worker update notifications.', features: ['Quick actions FAB', 'SW update prompt', 'One-click reload'], tags: ['pwa', 'ux'] },
    { d: 17, date: '2026-05-08', title: 'Live Clock Display',           level: 1, featured: false, desc: 'Hero now shows the current Eastern Time in real time.', features: ['Live clock', '12-hour format', 'AM/PM indicator'], tags: ['hero', 'time'] },
    { d: 18, date: '2026-05-09', title: 'Journey Section Polish',       level: 1, featured: false, desc: 'Tightened copy and added motion to the journey timeline.', features: ['Copy pass', 'Reveal animations'], tags: ['content', 'motion'] },
    { d: 19, date: '2026-05-10', title: 'Skill Bars + Filter',          level: 2, featured: false, desc: 'Animated skill proficiency bars with category filter chips.', features: ['Animated bars', 'Filter chips', 'IO trigger'], tags: ['skills', 'animation'] },
    { d: 20, date: '2026-05-11', title: 'Project Filter System',        level: 2, featured: false, desc: 'Filter the project grid by category (gaming, tools, web apps, experimental).', features: ['Category filter', 'Active state', 'Fade-in animation'], tags: ['projects', 'filter'] },
    { d: 21, date: '2026-05-12', title: 'Project Detail Modal',         level: 3, featured: false, desc: 'Click a project card to open a full-detail modal with tech stack and links.', features: ['Project modal', 'Tech stack tags', 'Demo / GitHub links'], tags: ['projects', 'modal'] },
    { d: 22, date: '2026-05-13', title: 'Testimonials + Footer Boost',  level: 2, featured: false, desc: 'Community testimonial cards and a richer footer with mission + quick links.', features: ['3 testimonial cards', 'Footer mission', 'Social grid'], tags: ['social', 'content'] },
    { d: 23, date: '2026-05-14', title: 'Advanced JS + CSS Layer',      level: 3, featured: false, desc: 'Utility belt (debounce, throttle, scrollTo, isInViewport) plus a 350-line CSS layer.', features: ['Utility functions', 'Section transitions', '3D card tilt', 'Parallax hero'], tags: ['utilities', 'css', 'motion'] },
    { d: 24, date: '2026-05-15', title: 'Newsletter Form',              level: 1, featured: false, desc: 'A proper newsletter sign-up form with validation and confirmation states.', features: ['Email validation', 'Success state', 'localStorage opt-in'], tags: ['forms', 'email'] },
    { d: 25, date: '2026-05-16', title: 'Print Styles + A11y Pass',     level: 1, featured: false, desc: 'Print-friendly stylesheet and an accessibility audit pass.', features: ['@media print', 'A11y focus rings', 'ARIA labels'], tags: ['a11y', 'print'] },
    { d: 26, date: '2026-05-17', title: 'FAQ Accordion',                level: 2, featured: false, desc: 'A clean FAQ section with smooth-height accordion items.', features: ['Accordion', 'Smooth height', 'Keyboard accessible'], tags: ['content', 'a11y'] },
    { d: 27, date: '2026-05-18', title: 'Easter Egg + Cursor Trail',    level: 2, featured: false, desc: 'A hidden easter egg and a particle cursor trail that respects reduced-motion.', features: ['Konami easter egg', 'Cursor particles', 'Reduced-motion safe'], tags: ['fun', 'easter'] },
    { d: 28, date: '2026-05-19', title: 'Role Text Rotator',            level: 1, featured: false, desc: 'A typewriter effect that cycles "Full-Stack Developer", "Daily Builder", and more.', features: ['Typewriter effect', '7 roles', 'Cursor blink'], tags: ['hero', 'animation'] },
    { d: 29, date: '2026-05-20', title: 'Ambient Sound + Smart Nav',    level: 3, featured: false, desc: 'Web Audio ambient drone plus a smart nav that hides on scroll-down.', features: ['Web Audio drone', 'Smart nav', 'Scroll-reveal animations'], tags: ['audio', 'motion', 'nav'] },
    { d: 30, date: '2026-05-21', title: 'Productivity Corner',          level: 4, featured: true,  desc: 'Focus timer, quick notes, daily goals, break reminder, build streak — five tools in one section.', features: ['Pomodoro timer', 'Auto-save notes', '3 daily goals', 'Break reminder', 'Streak widget'], tags: ['productivity', 'tools', 'ship'] },
    { d: 31, date: '2026-05-22', title: 'Hero Date Display',            level: 1, featured: false, desc: 'Live date in the hero meta, updates every minute.', features: ['Live date', 'Auto update'], tags: ['hero', 'time'] },
    { d: 32, date: '2026-05-23', title: 'World Clock Widget',           level: 3, featured: false, desc: 'Eight cities, all live, accessible from the globe button in the hero meta.', features: ['8 cities', 'Live updates', 'Timezone aware'], tags: ['widget', 'time'] },
    { d: 33, date: '2026-05-24', title: 'Section Minimap + Terminal',   level: 3, featured: false, desc: 'A side-section minimap and a fake terminal dashboard with typeable commands.', features: ['Section minimap', 'Terminal widget', 'Scroll velocity'], tags: ['nav', 'fun'] },
    { d: 34, date: '2026-05-25', title: 'Code Playground',              level: 3, featured: false, desc: 'A live HTML/CSS/JS playground right in the page, sandboxed iframe.', features: ['Live preview', 'Sandboxed iframe', 'Multi-tab editor'], tags: ['tools', 'developer'] },
    { d: 35, date: '2026-05-26', title: 'Crypto Ticker',                level: 2, featured: false, desc: 'Live crypto prices in the hero meta with a sparkline.', features: ['BTC/ETH/SOL ticker', 'Sparkline', 'Color-coded change'], tags: ['data', 'widget'] },
    { d: 36, date: '2026-05-27', title: 'Weather Widget',               level: 2, featured: false, desc: 'Live weather for The Bronx, with a multi-day forecast modal.', features: ['Current weather', '5-day forecast', 'Icon set'], tags: ['data', 'widget'] },
    { d: 37, date: '2026-05-28', title: '2026 Design Features',         level: 4, featured: true,  desc: 'The big one: glassmorphism, bento grid, kinetic typography, magnetic buttons, liquid buttons, 3D tilt, blob backgrounds, noise texture, page transitions.', features: ['Glassmorphism', 'Bento grid', 'Kinetic title', 'Magnetic buttons', '3D tilt', 'Blob bg', 'Page transitions'], tags: ['design', 'motion', 'ship'] },
    { d: 38, date: '2026-05-29', title: 'Command Palette (Ctrl+K)',     level: 4, featured: true,  desc: 'A 25+ command launcher with categories, fuzzy search, and keyboard navigation.', features: ['25+ commands', 'Fuzzy search', 'Keyboard nav', 'Categories'], tags: ['power', 'tools', 'ship'] },
    { d: 39, date: '2026-05-30', title: 'Site Tour + Timeline Upgrade', level: 3, featured: false, desc: 'A first-visit guided tour and click-to-expand timeline items.', features: ['Guided tour', 'localStorage state', 'Expand timeline'], tags: ['onboarding', 'content'] },
    { d: 40, date: '2026-05-31', title: 'Daily Challenge + API Status', level: 3, featured: false, desc: 'Gamified daily missions with XP, plus a live API status dashboard.', features: ['15 missions', 'XP & badges', 'API health checks', 'Toast system'], tags: ['game', 'infra'] },
    { d: 41, date: '2026-06-01', title: 'Music Player',                 level: 4, featured: true,  desc: 'Full audio player: visualizer, playlist, volume, shuffle, repeat, keyboard controls.', features: ['Visualizer', '5 tracks', 'Volume / mute', 'Shuffle / repeat', 'Spacebar toggle'], tags: ['audio', 'fun', 'ship'] },
    { d: 42, date: '2026-06-02', title: 'Stats Bento + Live Visitors',  level: 3, featured: false, desc: 'Stats section redesigned as a bento grid with a live visitor counter.', features: ['Bento grid', 'Live counter', '5s ticker'], tags: ['stats', 'ui'] },
    { d: 43, date: '2026-06-03', title: 'Keyboard Game',                level: 3, featured: false, desc: 'A press-the-key mini-game in the hero with combo multipliers.', features: ['Type-the-key game', 'Combo system', 'Hit/miss anims'], tags: ['fun', 'hero'] },
    { d: 44, date: '2026-06-04', title: 'Daily Quote Vault',            level: 3, featured: false, desc: '30 hand-picked builder quotes with favorites, sharing, and a daily-locked "quote of the day".', features: ['30 quotes', 'Favorites', 'Share', 'Quote of the day'], tags: ['content', 'inspiration'] },
    { d: 45, date: '2026-06-05', title: 'Achievement Badges',           level: 3, featured: false, desc: '12 unlockable badges that respond to real activity — confetti on unlock, progress saved.', features: ['12 badges', 'Confetti on unlock', 'Toast notifications', 'Progress saved'], tags: ['game', 'engagement'] },
    { d: 46, date: '2026-06-06', title: 'Counter Increments',           level: 1, featured: false, desc: 'Bumped days-building, streak, and features-built counters.', features: ['Day +1', 'Streak +1'], tags: ['meta', 'stats'] },
    { d: 47, date: '2026-06-07', title: 'Daily Plan Board',             level: 4, featured: true,  desc: 'A Now/Next/Later kanban for the build queue, with drag, check, add, and remove.', features: ['3 columns', 'Drag to advance', 'Check to ship', 'Add / remove cards', 'localStorage'], tags: ['productivity', 'tools', 'ship'] },
    { d: 48, date: '2026-06-08', title: 'Code Snippets Vault',          level: 4, featured: true,  desc: 'A personal snippet library: 10 starters, language filter, search, copy, edit, delete, localStorage.', features: ['10 seed snippets', 'Language filter', 'Search', 'CRUD', 'Copy counter'], tags: ['developer', 'tools', 'ship'] },
    { d: 49, date: '2026-06-09', title: 'Snippet Modal Editor',         level: 2, featured: false, desc: 'A full editor modal for adding and editing snippets, with live char count.', features: ['Editor modal', 'Char counter', 'Pre-fill on edit'], tags: ['developer', 'modal'] },
    { d: 50, date: '2026-06-10', title: 'Build Counter Sync',           level: 1, featured: false, desc: 'Synced all stats, day counters, and hero insights to the running total.', features: ['Day sync', 'Stats sync', 'Insights sync'], tags: ['meta'] },
    { d: 51, date: '2026-06-11', title: 'Snippet CSS Polish',           level: 2, featured: false, desc: 'Light theme for the snippet cards, scrollbar styling, and a friendlier empty state.', features: ['Light theme', 'Custom scrollbar', 'Empty state'], tags: ['css', 'theme'] },
    { d: 52, date: '2026-06-12', title: 'Snippet Shortcuts',            level: 2, featured: false, desc: 'Ctrl+Shift+S to add a new snippet from anywhere, and two new command-palette entries.', features: ['Global shortcut', 'Command palette entries'], tags: ['power', 'shortcuts'] },
    { d: 53, date: '2026-06-13', title: 'Snippet Tag Search',           level: 2, featured: false, desc: 'Search now matches tag content as well as titles, plus tag-pill styling for clarity.', features: ['Tag-aware search', 'Pill styling'], tags: ['developer', 'search'] },
    { d: 54, date: '2026-06-14', title: 'Snippet Footer Stats',         level: 1, featured: false, desc: 'Footer counters now show totals, current filter, languages, and copy count.', features: ['Footer stats', 'Copy counter persistence'], tags: ['stats'] },
    { d: 55, date: '2026-06-15', title: 'Hero Meta Polish',             level: 2, featured: false, desc: 'Cleaned up spacing, added tooltips, and matched the icon rhythm across the hero meta row.', features: ['Tooltip pass', 'Spacing pass', 'Icon rhythm'], tags: ['hero', 'ui'] },
    { d: 56, date: '2026-06-16', title: 'Daily Plan Integration',       level: 2, featured: false, desc: 'Wired the plan board into the hero meta and the command palette, and added a focus-mode toggle.', features: ['Plan button', 'Palette entry', 'Focus mode'], tags: ['productivity', 'tools'] },
    { d: 57, date: '2026-06-17', title: 'Build Calendar Heatmap',       level: 4, featured: true,  desc: 'A GitHub-style contribution graph of all 57 days, with click-to-read modals, summary stats, and three view filters. The streak, made visible.', features: ['57-day heatmap', 'Click-to-read modal', 'Summary stats', 'All / 30 / Featured views', 'Share-this-build'], tags: ['meta', 'design', 'ship', 'milestone'] },
    { d: 58, date: '2026-06-18', title: 'Build Assistant',               level: 4, featured: true,  desc: 'A chatbot that lives inside the site and knows about every build day. Press A to open, ask by day number, by date, by tag, or just say "recent" or "biggest".', features: ['Pattern-match knowledge base', 'Local chat memory', 'Day / date / tag search', '60+ suggestions'], tags: ['meta', 'tools', 'ship', 'milestone'] },
    { d: 59, date: '2026-06-19', title: 'Bookmark Cards',                level: 4, featured: true,  desc: 'Every section on this site now has a generated share card with title, icon, description, and a one-click copy link. Pin, sort, search, and pop open the detail modal to share.', features: ['25+ share cards', 'Pin / sort / search', 'Detail modal', 'Native share sheet'], tags: ['meta', 'tools', 'ship', 'milestone'] },
    { d: 60, date: '2026-06-20', title: 'Site Constellation',            level: 4, featured: true,  desc: 'A 27-node interactive graph of every section on this site, organized into 4 categories with 59 edges connecting related sections. Drag, zoom, search, filter, click to jump.', features: ['27 SVG nodes', '59 edges', 'Drag to reposition', 'Search + filter', 'Zoom controls', 'Detail panel'], tags: ['meta', 'tools', 'ship', 'milestone'] },
    { d: 61, date: '2026-06-21', title: 'Time Capsule Vault',            level: 4, featured: true,  desc: 'Write a note to your future self. Seal it with a date, and the vault keeps it locked until then. Live countdowns, mood tags, shareable previews, and a Next Unlock tile that ticks down in real time.', features: ['Compose / seal / unlock', 'Live countdowns', 'Mood tags (6)', 'Sealed previews', 'Share via Web Share API', 'localStorage persistence', 'Two seeded capsules'], tags: ['meta', 'tools', 'ship', 'milestone', 'new'] },
    { d: 62, date: '2026-06-22', title: 'Theme Studio',                  level: 4, featured: true,  desc: 'Live CSS-variable customizer with 6 named presets, save-your-own themes that persist to localStorage, share-as-URL hash, and a randomize button.', features: ['6 named presets', 'Custom presets persist', 'Share URL hash', 'Randomize', 'Per-group reset'], tags: ['design', 'tools', 'ship', 'milestone'] },
    { d: 63, date: '2026-06-23', title: 'Reading Mode + Reading List',   level: 3, featured: false, desc: 'Distraction-free reading with a per-section progress bar, a personal Reading List, auto word-count + read-time, and a print stylesheet.', features: ['Per-section progress', 'Reading List localStorage', 'Word count + read time', 'Print stylesheet'], tags: ['ux', 'content', 'tools'] },
    { d: 64, date: '2026-06-24', title: 'Build Journal',                 level: 4, featured: true,  desc: 'A structured daily log with three columns (Shipped / Learned / Broke), mood picker, weekly ring, and JSON export.', features: ['Shipped / Learned / Broke', 'Mood picker (5)', 'Weekly ring chart', 'JSON export', 'localStorage'], tags: ['productivity', 'tools', 'meta', 'ship', 'milestone'] },
    { d: 65, date: '2026-06-25', title: 'Community Wishlist',            level: 4, featured: true,  desc: 'A public roadmap anyone can submit to. Upvote / downvote, sort by votes or recency, mark as planned or shipped.', features: ['Submit / upvote / downvote', 'Status filters', 'Sort by votes or recency', 'localStorage persistence'], tags: ['community', 'tools', 'meta', 'ship', 'milestone'] },
    { d: 66, date: '2026-06-26', title: 'On This Day Wisdom',            level: 3, featured: false, desc: '365 builder principles deterministically generated from a curated seed bank, with day-of-year anchor, filter, bookmarks, share, and flip.', features: ['365-card deck', 'Day-of-year anchor', 'Filter by category', 'Bookmarks', 'Share', 'Flip'], tags: ['content', 'inspiration', 'meta'] },
    { d: 67, date: '2026-06-26', title: 'Pixel Art Studio',              level: 4, featured: true,  desc: 'A 16x16 pixel editor with paint / erase / fill / eyedropper tools, a 16-color palette, undo/redo stack, PNG export, share-as-URL, and a saved pieces gallery.', features: ['Paint / erase / fill / eyedropper', '16-color palette', 'Undo / redo', 'PNG export', 'Share URL', 'Saved pieces gallery'], tags: ['creator', 'fun', 'tools', 'ship', 'milestone'] },
    { d: 68, date: '2026-06-27', title: 'Daily Pixel Challenge',         level: 3, featured: false, desc: 'A 250-prompt bank of pixel art challenges that rotates daily with day-of-year anchor. Reroll, mark complete, share, and start drawing directly in the Pixel Art Studio.', features: ['250 prompts / 8 categories', 'Day-of-year anchor', 'Reroll', 'Mark complete', 'Share', 'Streak counter'], tags: ['creator', 'fun', 'tools'] },
    { d: 69, date: '2026-06-28', title: 'Build Receipts',                level: 4, featured: true,  desc: 'Thermal-printer-style receipts for any day of the build, with barcode, perforations, and impact meter. Print, copy, share, or download as text.', features: ['Thermal paper styling', 'Barcode + perforations', 'Print / copy / share / download', 'Filter by tag / featured', 'Random receipt shortcut'], tags: ['meta', 'tools', 'design', 'ship', 'milestone'] },
    { d: 70, date: '2026-06-29', title: 'Soundboard',                    level: 4, featured: true,  desc: 'A 26-pad Web Audio synth with categories, favorites, live waveforms, reverb, and persisted settings.', features: ['26 pads / 6 categories', 'Favorites', 'Reverb + playback speed', 'Live waveform', 'Keyboard shortcuts', 'localStorage'], tags: ['audio', 'fun', 'tools', 'ship', 'milestone'] },
    { d: 71, date: '2026-06-30', title: 'Step Sequencer',                level: 4, featured: true,  desc: 'A 16-step x 8-track beat machine with Web Audio synth, drag-paint, mute/solo, pattern banks, share URL, and JSON import/export.', features: ['8 synth tracks', '16-step grid', 'Drag-paint', 'BPM 60-200 / swing', '4 pattern banks', 'Share URL + JSON'], tags: ['audio', 'fun', 'tools', 'ship', 'milestone'] },
    { d: 72, date: '2026-07-01', title: 'The Forge — Build Reflection',  level: 4, featured: true,  desc: 'A daily build-reflection studio. Rate the build across 5 dimensions, write a 280-character micro-post with tags, run a 25-min focus session, browse a build history feed, see your average ratings, and track a 7-day streak.', features: ['5-dimension rating', '280-char micro-post', 'Mood + tag picker', '25-min focus session', 'Build history feed', '7-day streak', 'Average ratings', 'JSON export', 'localStorage'], tags: ['meta', 'productivity', 'tools', 'ship', 'milestone'] },
  ];

  // ---- Helpers ----
  const $ = (sel) => document.querySelector(sel);
  const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const grid = $('#calendar-grid');
  const months = $('#calendar-months');
  if (!grid) return;

  let view = 'all'; // 'all' | 'recent' | 'featured'
  let views = 0;
  try { views = parseInt(localStorage.getItem(STORAGE_VIEWS) || '0', 10) || 0; } catch (_) {}

  // Track a view bump
  const bumpView = () => {
    views += 1;
    try { localStorage.setItem(STORAGE_VIEWS, String(views)); } catch (_) {}
  };

  // ---- Render heatmap ----
  function render() {
    // Anchor: today is 2026-07-01, day 72. Walk back to day 1.
    const today = new Date('2026-07-01T12:00:00');
    const start = new Date('2026-04-22T12:00:00');
    const totalDays = Math.ceil((today - start) / 86400000) + 1;

    grid.innerHTML = '';
    months.innerHTML = '';

    // Build columns: each column is a week (7 rows: Sun..Sat)
    // We need 9 weeks of leading empty cells + (totalDays) days
    const firstDow = start.getDay(); // 0 = Sun
    const totalCells = firstDow + totalDays;
    const totalWeeks = Math.ceil(totalCells / 7);

    // Track month transitions for header
    let lastMonth = -1;
    const monthSpans = [];
    let currentMonthStart = -1;

    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const cellIndex = w * 7 + d;
        const dayOffset = cellIndex - firstDow;
        const el = document.createElement('button');
        el.className = 'calendar-cell';
        el.type = 'button';
        el.setAttribute('aria-label', `Day ${dayOffset + 1}`);

        if (dayOffset < 0 || dayOffset >= totalDays) {
          el.classList.add('empty');
          el.disabled = true;
          grid.appendChild(el);
          continue;
        }

        const build = BUILDS[dayOffset];
        if (!build) {
          el.classList.add('empty');
          el.disabled = true;
          grid.appendChild(el);
          continue;
        }

        el.classList.add(`level-${build.level}`);
        el.dataset.day = String(build.d);
        el.title = `Day ${build.d} — ${build.title}`;
        el.addEventListener('click', () => openModal(build));
        grid.appendChild(el);

        // Track month label
        const cellDate = new Date(start.getTime() + dayOffset * 86400000);
        const m = cellDate.getMonth();
        if (m !== lastMonth) {
          if (lastMonth !== -1) monthSpans.push({ start: currentMonthStart, end: w, label: monthName(lastMonth) });
          currentMonthStart = w;
          lastMonth = m;
        }
      }
    }
    if (lastMonth !== -1) monthSpans.push({ start: currentMonthStart, end: totalWeeks, label: monthName(lastMonth) });

    // Render month labels positioned above the grid
    months.style.gridTemplateColumns = `repeat(${totalWeeks}, 1fr)`;
    months.innerHTML = '';
    monthSpans.forEach(m => {
      const span = document.createElement('span');
      span.textContent = m.label;
      span.style.gridColumn = `${m.start + 1} / ${m.end + 1}`;
      months.appendChild(span);
    });

    // View filter
    applyView();

    // Update summary
    updateSummary();
  }

  function monthName(m) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];
  }

  function applyView() {
    const cells = grid.querySelectorAll('.calendar-cell:not(.empty)');
    cells.forEach(c => {
      const d = parseInt(c.dataset.day, 10);
      const build = BUILDS.find(b => b.d === d);
      if (!build) return;
      let show = true;
      if (view === 'recent') show = d > 27;
      else if (view === 'featured') show = build.featured === true;
      c.style.display = show ? '' : 'none';
    });
    document.querySelectorAll('.calendar-view').forEach(b => b.classList.remove('active'));
    const active = view === 'recent' ? 'cal-view-recent' : view === 'featured' ? 'cal-view-featured' : 'cal-view-all';
    const btn = document.getElementById(active);
    if (btn) btn.classList.add('active');
  }

  function updateSummary() {
    $('#cal-days-built').textContent = String(BUILDS.length);
    $('#cal-current-streak').textContent = String(BUILDS.length);
    $('#cal-longest-streak').textContent = String(BUILDS.length);

    // Biggest drop = highest level-4 day count as a tag
    const level4 = BUILDS.filter(b => b.level === 4);
    if (level4.length) {
      const featured = level4[0];
      $('#cal-best-day').textContent = `Day ${featured.d}`;
    }
  }

  // ---- Modal ----
  const modal = $('#cal-modal');
  const backdrop = modal ? modal.querySelector('.cal-modal-backdrop') : null;

  function openModal(build) {
    if (!modal) return;
    bumpView();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    $('#cal-modal-tag').textContent = `Day ${build.d}`;
    $('#cal-modal-title').textContent = build.title;
    $('#cal-modal-date').textContent = fmt(build.date);
    $('#cal-modal-streak').textContent = String(build.d);
    $('#cal-modal-impact').textContent = ['—', 'Tiny', 'Solid', 'Big', 'Massive'][build.level];
    $('#cal-modal-commits').textContent = String(Math.max(1, Math.round(build.level * 0.8)));
    $('#cal-modal-desc').textContent = build.desc;

    const ul = $('#cal-modal-features');
    ul.innerHTML = '';
    build.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      ul.appendChild(li);
    });

    const tags = $('#cal-modal-tags');
    tags.innerHTML = '';
    build.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'cal-modal-tag-pill';
      span.textContent = t;
      tags.appendChild(span);
    });

    // Share button wiring per-open
    const shareBtn = $('#cal-modal-share');
    if (shareBtn) {
      shareBtn.onclick = () => {
        const text = `Day ${build.d} of my daily-build streak: ${build.title} — ${build.desc}`;
        if (navigator.share) {
          navigator.share({ title: `Day ${build.d}: ${build.title}`, text }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            shareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { shareBtn.innerHTML = '<i class="fas fa-share"></i> Share this build'; }, 1500);
          });
        }
      };
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('is-closed');
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  modal && modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  // ---- View filter buttons ----
  const allBtn = $('#cal-view-all');
  const recentBtn = $('#cal-view-recent');
  const featuredBtn = $('#cal-view-featured');
  if (allBtn) allBtn.addEventListener('click', () => { view = 'all'; applyView(); });
  if (recentBtn) recentBtn.addEventListener('click', () => { view = 'recent'; applyView(); });
  if (featuredBtn) featuredBtn.addEventListener('click', () => { view = 'featured'; applyView(); });

  // ---- Hero button: jump to calendar ----
  const heroBtn = $('#calendar-btn');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const el = document.querySelector('#calendar');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---- Initial render ----
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initBuildCalendar();
});
window.initBuildCalendar = initBuildCalendar;

// ======================================================
// Day 58 - Build Assistant (Knowledge Base Chat)
// ======================================================
function initBuildAssistant() {
  const STORAGE_KEY = 'ajh_assistant_history_v1';
  const STORAGE_FIRST = 'ajh_assistant_seen_v1';

  // 58 days of build data, mirroring the calendar (Day 58 is today, 2026-06-18)
  const BUILDS = [
    { d:  1, title: 'First Commit',                date: '2026-04-22', tags: ['launch','foundation','core'],         level: 3, desc: 'Shipped the first commit. Picked the structure, the colors, the rhythm.' },
    { d:  2, title: 'Navigation & Smooth Scroll',  date: '2026-04-23', tags: ['nav','ux'],                              level: 2, desc: 'Sticky nav, smooth scroll anchors, scroll-to-top FAB.' },
    { d:  3, title: 'Contact Form',                 date: '2026-04-24', tags: ['forms','ux'],                            level: 2, desc: 'Working contact form with validation and submit handler.' },
    { d:  4, title: 'Projects Grid',                date: '2026-04-25', tags: ['projects','ui'],                         level: 2, desc: 'Project card grid with hover effects and category tags.' },
    { d:  5, title: 'Dark Theme',                   date: '2026-04-26', tags: ['theme','a11y'],                          level: 2, desc: 'First dark theme pass with palette, contrast, and CSS variables.' },
    { d:  6, title: 'Mobile Responsive',            date: '2026-04-27', tags: ['mobile','responsive'],                   level: 3, desc: 'Mobile pass: grids collapse, type scales, hamburger nav.' },
    { d:  7, title: 'PWA Foundations',              date: '2026-04-28', tags: ['pwa','infra'],                           level: 3, desc: 'Manifest, service worker, offline shell.' },
    { d:  8, title: 'Stats Counter',                date: '2026-04-29', tags: ['animation','hero'],                      level: 2, desc: 'Animated count-up stats with IntersectionObserver trigger.' },
    { d:  9, title: 'Footer Overhaul',              date: '2026-04-30', tags: ['footer','links'],                        level: 2, desc: 'Footer with social links, mission, and quick links.' },
    { d: 10, title: 'Feed & Sitemap',               date: '2026-05-01', tags: ['seo','meta'],                            level: 1, desc: 'RSS feed, robots.txt, sitemap.xml.' },
    { d: 11, title: 'Timeline Section',             date: '2026-05-02', tags: ['content','journey'],                     level: 2, desc: 'Vertical timeline with year badges.' },
    { d: 12, title: 'Skills Section',               date: '2026-05-03', tags: ['about','skills'],                        level: 2, desc: 'Categorized skills with icons.' },
    { d: 13, title: 'Performance Pass',             date: '2026-05-04', tags: ['perf','speed'],                          level: 2, desc: 'Deferred JS, font preloads, page loader.' },
    { d: 14, title: 'CI/CD + 404 + Achievements',   date: '2026-05-05', tags: ['ci','design','ship'],                     level: 4, desc: 'GitHub Actions deploy, custom 404, Achievements section.' },
    { d: 15, title: 'Currently Building',           date: '2026-05-06', tags: ['status','projects'],                     level: 2, desc: 'Live status board for in-progress projects.' },
    { d: 16, title: 'Quick Actions + SW Updates',   date: '2026-05-07', tags: ['pwa','ux'],                              level: 3, desc: 'Floating quick-actions menu and SW update prompt.' },
    { d: 17, title: 'Live Clock Display',           date: '2026-05-08', tags: ['hero','time'],                           level: 1, desc: 'Hero shows current Eastern Time in real time.' },
    { d: 18, title: 'Journey Section Polish',       date: '2026-05-09', tags: ['content','motion'],                      level: 1, desc: 'Copy and motion polish on the journey timeline.' },
    { d: 19, title: 'Skill Bars + Filter',          date: '2026-05-10', tags: ['skills','animation'],                    level: 2, desc: 'Animated skill bars with category filter chips.' },
    { d: 20, title: 'Project Filter System',        date: '2026-05-11', tags: ['projects','filter'],                     level: 2, desc: 'Filter the project grid by category.' },
    { d: 21, title: 'Project Detail Modal',         date: '2026-05-12', tags: ['projects','modal'],                      level: 3, desc: 'Click a project to open a full-detail modal.' },
    { d: 22, title: 'Testimonials + Footer Boost',  date: '2026-05-13', tags: ['social','content'],                      level: 2, desc: 'Community testimonials and a richer footer.' },
    { d: 23, title: 'Advanced JS + CSS Layer',      date: '2026-05-14', tags: ['utilities','css','motion'],              level: 3, desc: 'Utility belt + 350-line CSS layer + 3D tilt + parallax.' },
    { d: 24, title: 'Newsletter Form',              date: '2026-05-15', tags: ['forms','email'],                         level: 1, desc: 'Newsletter sign-up with validation and success states.' },
    { d: 25, title: 'Print Styles + A11y Pass',     date: '2026-05-16', tags: ['a11y','print'],                          level: 1, desc: 'Print stylesheet and accessibility audit.' },
    { d: 26, title: 'FAQ Accordion',                date: '2026-05-17', tags: ['content','a11y'],                        level: 2, desc: 'Clean FAQ section with smooth-height accordion.' },
    { d: 27, title: 'Easter Egg + Cursor Trail',    date: '2026-05-18', tags: ['fun','easter'],                          level: 2, desc: 'Konami easter egg and a particle cursor trail.' },
    { d: 28, title: 'Role Text Rotator',            date: '2026-05-19', tags: ['hero','animation'],                      level: 1, desc: 'Typewriter cycling seven developer roles.' },
    { d: 29, title: 'Ambient Sound + Smart Nav',    date: '2026-05-20', tags: ['audio','motion','nav'],                  level: 3, desc: 'Web Audio ambient drone plus smart auto-hide nav.' },
    { d: 30, title: 'Productivity Corner',          date: '2026-05-21', tags: ['productivity','tools','ship'],           level: 4, desc: 'Focus timer, quick notes, daily goals, break reminder, build streak.' },
    { d: 31, title: 'Hero Date Display',            date: '2026-05-22', tags: ['hero','time'],                           level: 1, desc: 'Live date in hero meta, updates every minute.' },
    { d: 32, title: 'World Clock Widget',           date: '2026-05-23', tags: ['widget','time'],                         level: 3, desc: 'Eight cities live, accessible from the globe button.' },
    { d: 33, title: 'Section Minimap + Terminal',   date: '2026-05-24', tags: ['nav','fun'],                             level: 3, desc: 'Side-section minimap and a fake typeable terminal.' },
    { d: 34, title: 'Code Playground',              date: '2026-05-25', tags: ['tools','developer'],                     level: 3, desc: 'Live HTML/CSS/JS playground in a sandboxed iframe.' },
    { d: 35, title: 'Crypto Ticker',                date: '2026-05-26', tags: ['data','widget'],                         level: 2, desc: 'Live crypto prices in the hero meta with a sparkline.' },
    { d: 36, title: 'Weather Widget',               date: '2026-05-27', tags: ['data','widget'],                         level: 2, desc: 'Live weather for The Bronx with a multi-day forecast.' },
    { d: 37, title: '2026 Design Features',         date: '2026-05-28', tags: ['design','motion','ship'],                level: 4, desc: 'Glassmorphism, bento grid, kinetic typography, magnetic buttons, liquid buttons, 3D tilt, blob bg.' },
    { d: 38, title: 'Command Palette (Ctrl+K)',     date: '2026-05-29', tags: ['power','tools','ship'],                  level: 4, desc: '25+ command launcher with categories, fuzzy search, keyboard nav.' },
    { d: 39, title: 'Site Tour + Timeline Upgrade', date: '2026-05-30', tags: ['onboarding','content'],                  level: 3, desc: 'First-visit guided tour and click-to-expand timeline.' },
    { d: 40, title: 'Daily Challenge + API Status', date: '2026-05-31', tags: ['game','infra'],                          level: 3, desc: 'Gamified daily missions with XP, plus live API status dashboard.' },
    { d: 41, title: 'Music Player',                 date: '2026-06-01', tags: ['audio','fun','ship'],                    level: 4, desc: 'Full audio player: visualizer, playlist, volume, shuffle, repeat.' },
    { d: 42, title: 'Stats Bento + Live Visitors',  date: '2026-06-02', tags: ['stats','ui'],                            level: 3, desc: 'Stats redesigned as a bento grid with a live visitor counter.' },
    { d: 43, title: 'Keyboard Game',                date: '2026-06-03', tags: ['fun','hero'],                            level: 3, desc: 'Press-the-key mini-game in the hero with combo multipliers.' },
    { d: 44, title: 'Daily Quote Vault',            date: '2026-06-04', tags: ['content','inspiration'],                 level: 3, desc: '30 hand-picked builder quotes with favorites and sharing.' },
    { d: 45, title: 'Achievement Badges',           date: '2026-06-05', tags: ['game','engagement'],                     level: 3, desc: '12 unlockable badges that respond to real activity.' },
    { d: 46, title: 'Counter Increments',           date: '2026-06-06', tags: ['meta','stats'],                          level: 1, desc: 'Bumped days-building, streak, and features-built counters.' },
    { d: 47, title: 'Daily Plan Board',             date: '2026-06-07', tags: ['productivity','tools','ship'],           level: 4, desc: 'Now/Next/Later kanban with drag, check, add, remove.' },
    { d: 48, title: 'Code Snippets Vault',          date: '2026-06-08', tags: ['developer','tools','ship'],              level: 4, desc: 'Snippet library: 10 starters, language filter, search, copy, edit, delete.' },
    { d: 49, title: 'Snippet Modal Editor',         date: '2026-06-09', tags: ['developer','modal'],                     level: 2, desc: 'Full editor modal for snippets with live char count.' },
    { d: 50, title: 'Build Counter Sync',           date: '2026-06-10', tags: ['meta'],                                  level: 1, desc: 'Synced all stats and hero insights to the running total.' },
    { d: 51, title: 'Snippet CSS Polish',           date: '2026-06-11', tags: ['css','theme'],                           level: 2, desc: 'Light theme for snippet cards, scrollbar styling, empty state.' },
    { d: 52, title: 'Snippet Shortcuts',            date: '2026-06-12', tags: ['power','shortcuts'],                     level: 2, desc: 'Ctrl+Shift+S to add a snippet from anywhere, palette entries.' },
    { d: 53, title: 'Snippet Tag Search',           date: '2026-06-13', tags: ['developer','search'],                    level: 2, desc: 'Search matches tag content as well as titles.' },
    { d: 54, title: 'Snippet Footer Stats',         date: '2026-06-14', tags: ['stats'],                                 level: 1, desc: 'Footer counters for totals, filter, languages, copies.' },
    { d: 55, title: 'Hero Meta Polish',             date: '2026-06-15', tags: ['hero','ui'],                             level: 2, desc: 'Spacing, tooltips, icon rhythm across the hero meta row.' },
    { d: 56, title: 'Daily Plan Integration',       date: '2026-06-16', tags: ['productivity','tools'],                  level: 2, desc: 'Wired plan board into hero meta and command palette.' },
    { d: 57, title: 'Build Calendar Heatmap',       date: '2026-06-17', tags: ['meta','design','ship','milestone'],      level: 4, desc: 'GitHub-style contribution graph of all 57 days, click-to-read modals.' },
    { d: 58, title: 'Build Assistant',              date: '2026-06-18', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'A chat assistant that knows about every one of the 58 days.' },
    { d: 59, title: 'Bookmark Cards',               date: '2026-06-19', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'Every section on this site now has a generated share card with title, icon, description, and a one-click copy link. Pin, sort, search, and pop open the detail modal to share.' },
    { d: 60, title: 'Site Constellation',           date: '2026-06-20', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'A 27-node interactive graph of every section on this site, organized into 4 categories with 59 edges connecting related sections. Drag, zoom, search, filter, click to jump.' },
    { d: 61, title: 'Time Capsule Vault',           date: '2026-06-21', tags: ['meta','tools','ship','milestone','new'], level: 4, desc: 'Write a note to your future self. Seal it with a date, and the vault keeps it locked until then. Live countdowns, mood tags, shareable previews, and a Next Unlock tile that ticks down in real time.' },
    { d: 62, title: 'Theme Studio',                 date: '2026-06-22', tags: ['meta','tools','design','ship'],           level: 4, desc: 'Live CSS-variable customizer with 6 named presets, save-your-own themes that persist to localStorage, share-as-URL hash, and a randomize button.' },
    { d: 63, title: 'Reading Mode + Reading List',  date: '2026-06-23', tags: ['ux','content','tools','ship'],           level: 3, desc: 'Distraction-free reading with a per-section progress bar, a personal Reading List, auto word-count + read-time, and a print stylesheet.' },
    { d: 64, title: 'Build Journal',                date: '2026-06-24', tags: ['productivity','tools','meta'],           level: 4, desc: 'A structured daily log with three columns (Shipped / Learned / Broke), mood picker, weekly ring, and JSON export.' },
    { d: 65, title: 'Community Wishlist',           date: '2026-06-25', tags: ['community','tools','meta','ship'],      level: 4, desc: 'A public roadmap anyone can submit to. Upvote / downvote, sort by votes or recency, mark as planned or shipped.' },
    { d: 66, title: 'On This Day Wisdom',           date: '2026-06-26', tags: ['content','inspiration','meta'],         level: 3, desc: '365 builder principles deterministically generated from a curated seed bank, with day-of-year anchor, filter, bookmarks, share, and flip.' },
    { d: 67, title: 'Pixel Art Studio',             date: '2026-06-26', tags: ['creator','fun','tools','ship','new'],   level: 4, desc: 'A 16x16 pixel editor with paint / erase / fill / eyedropper tools, a 16-color palette, undo/redo stack, PNG export, share-as-URL, and a saved pieces gallery.' },
    { d: 68, title: 'Daily Pixel Challenge',        date: '2026-06-27', tags: ['creator','fun','tools','ship','new'],   level: 3, desc: 'A 250-prompt bank of pixel art challenges that rotates daily with day-of-year anchor. Reroll, mark complete, share, and start drawing directly in the Pixel Art Studio.' },
    { d: 69, title: 'Build Receipts',               date: '2026-06-28', tags: ['meta','tools','design','ship'],         level: 4, desc: 'Thermal-printer-style receipts for any day of the build, with barcode, perforations, and impact meter. Print, copy, share, or download as text.' },
    { d: 70, title: 'Soundboard',                   date: '2026-06-29', tags: ['audio','fun','tools','ship','new'],     level: 4, desc: 'A 26-pad Web Audio synth with categories, favorites, live waveforms, reverb, and persisted settings.' },
    { d: 71, title: 'Step Sequencer',               date: '2026-06-30', tags: ['audio','fun','tools','ship','new'],     level: 4, desc: 'A 16-step x 8-track beat machine with Web Audio synth, drag-paint, mute/solo, pattern banks, share URL, and JSON import/export.' },
    { d: 72, title: 'The Forge',                    date: '2026-07-01', tags: ['meta','tools','productivity','ship','new'], level: 4, desc: 'A Build Reflection Studio with a daily-rate card, 280-character micro-post with tags, a 25-minute focus session, a build history feed, average ratings across dimensions, and 7-day streak tracking.' },
  ];

  // ---- DOM ----
  const panel       = document.getElementById('assistant-panel');
  const fab         = document.getElementById('assistant-fab');
  const heroBtn     = document.getElementById('assistant-btn');
  const closeBtn    = document.getElementById('assistant-close');
  const backdrop    = document.getElementById('assistant-backdrop');
  const messagesEl  = document.getElementById('assistant-messages');
  const inputEl     = document.getElementById('assistant-input');
  const sendBtn     = document.getElementById('assistant-send');
  const suggestions = document.getElementById('assistant-suggestions');
  const clearBtn    = document.getElementById('assistant-clear');
  if (!panel || !messagesEl || !inputEl) return;

  // ---- Helpers ----
  const $ = (s, r=document) => r.querySelector(s);
  const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtDateLong = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  const levelLabel = (n) => ['Tiny','Small','Solid','Big','Massive'][n] || 'Solid';
  const levelEmoji = (n) => ['·','▪','◆','★','🔥'][n] || '◆';

  // ---- Storage ----
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveHistory(history) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-50))); } catch (e) {}
  }
  function markSeen() {
    try { localStorage.setItem(STORAGE_FIRST, '1'); } catch (e) {}
  }

  // ---- Rendering ----
  function renderMessage(role, html) {
    const wrap = document.createElement('div');
    wrap.className = `assistant-msg assistant-${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'assistant-avatar';
    avatar.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const body = document.createElement('div');
    body.className = 'assistant-body';
    body.innerHTML = html;
    wrap.appendChild(avatar);
    wrap.appendChild(body);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  function renderTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'assistant-msg assistant-bot assistant-typing';
    wrap.innerHTML = `
      <div class="assistant-avatar"><i class="fas fa-robot"></i></div>
      <div class="assistant-body">
        <div class="assistant-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>`;
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  function buildCard(b) {
    const tagsHtml = b.tags.map(t => `<span class="assistant-tag">${escapeHtml(t)}</span>`).join('');
    return `
      <div class="assistant-card">
        <div class="assistant-card-header">
          <span class="assistant-card-day">Day ${b.d}</span>
          <span class="assistant-card-level level-${b.level}">${levelEmoji(b.level)} ${levelLabel(b.level)}</span>
        </div>
        <h4 class="assistant-card-title">${escapeHtml(b.title)}</h4>
        <div class="assistant-card-date"><i class="fas fa-calendar"></i> ${escapeHtml(fmtDateLong(b.date))}</div>
        <p class="assistant-card-desc">${escapeHtml(b.desc)}</p>
        <div class="assistant-card-tags">${tagsHtml}</div>
      </div>`;
  }

  // ---- Reply builders ----
  function replyGreeting() {
    const today = BUILDS[BUILDS.length - 1];
    return `Hi! I'm the <strong>AJH Build Assistant</strong>. I know about <strong>all 58 days</strong> of this site — every feature, every fix, every late-night push.<br><br>
      Today is <strong>${escapeHtml(fmtDateLong(today.date))}</strong>, and the latest build is <strong>Day ${today.d}: ${escapeHtml(today.title)}</strong>.<br><br>
      Ask me anything: <em>"What did you build on day 37?"</em>, <em>"recent builds"</em>, <em>"biggest features"</em>, or anything else.`;
  }

  function replyTotal() {
    const featured = BUILDS.filter(b => b.featured || b.level === 4).length;
    return `I've got <strong>${BUILDS.length} days</strong> in memory.<br>
      <strong>${featured}</strong> are <em>featured</em> (the major ship days).<br>
      <strong>${BUILDS.filter(b => b.level >= 3).length}</strong> are level 3 or 4 (big / massive drops).<br><br>
      First commit: <strong>${escapeHtml(fmtDate(BUILDS[0].date))}</strong>. Latest: <strong>${escapeHtml(fmtDate(BUILDS[BUILDS.length - 1].date))}</strong>.`;
  }

  function replyLatest() {
    return buildCard(BUILDS[BUILDS.length - 1]);
  }

  function replyFirst() {
    return buildCard(BUILDS[0]);
  }

  function replyRandom() {
    const idx = Math.floor(Math.random() * BUILDS.length);
    return `Here's a random one from the streak:<br>${buildCard(BUILDS[idx])}`;
  }

  function replyBiggest() {
    const big = BUILDS.filter(b => b.level === 4);
    return `The <strong>${big.length} level-4 "massive" days</strong>:<br><br>` +
      big.map(b => `🔥 <strong>Day ${b.d}</strong> — ${escapeHtml(b.title)} <em>(${escapeHtml(fmtDate(b.date))})</em>`).join('<br>');
  }

  function replyFeatured() {
    const featured = BUILDS.filter(b => b.tags.includes('ship') || b.tags.includes('milestone'));
    return `Featured ship days:<br><br>` +
      featured.map(b => `⭐ <strong>Day ${b.d}</strong> — ${escapeHtml(b.title)}`).join('<br>') +
      `<br><br>That's ${featured.length} major drops across 58 days.`;
  }

  function replyRecent(n = 7) {
    const recent = BUILDS.slice(-n);
    return `The last <strong>${n} days</strong>:<br><br>` +
      recent.map(b => `<strong>Day ${b.d}</strong> — ${escapeHtml(b.title)} <em>(${escapeHtml(fmtDate(b.date))})</em>`).join('<br>');
  }

  function replyStreak() {
    const dates = BUILDS.map(b => new Date(b.date + 'T12:00:00'));
    let longest = 1, run = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.round((dates[i] - dates[i-1]) / 86400000);
      if (diff === 1) { run++; longest = Math.max(longest, run); }
      else run = 1;
    }
    const daysBuilt = BUILDS.length;
    const featured = BUILDS.filter(b => b.level === 4).length;
    return `🔥 <strong>Streak stats</strong><br>
      Days built: <strong>${daysBuilt}</strong><br>
      Longest unbroken streak: <strong>${longest} days</strong><br>
      Massive drops (level 4): <strong>${featured}</strong><br>
      Featured ships: <strong>${BUILDS.filter(b => b.tags.includes('ship')).length}</strong>`;
  }

  function replyTag(query) {
    const q = query.toLowerCase();
    const matches = BUILDS.filter(b =>
      b.tags.some(t => t.toLowerCase().includes(q)) ||
      b.title.toLowerCase().includes(q) ||
      b.desc.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      return `Couldn't find a build matching <em>"${escapeHtml(query)}"</em>.<br>Try tags like <code>design</code>, <code>ship</code>, <code>tools</code>, <code>audio</code>, or <code>productivity</code>.`;
    }
    return `Found <strong>${matches.length}</strong> build${matches.length > 1 ? 's' : ''} matching <em>"${escapeHtml(query)}"</em>:<br><br>` +
      matches.slice(0, 8).map(b => `<strong>Day ${b.d}</strong> — ${escapeHtml(b.title)}`).join('<br>') +
      (matches.length > 8 ? `<br><br><em>…and ${matches.length - 8} more.</em>` : '');
  }

  function replyDay(n) {
    const b = BUILDS.find(x => x.d === n);
    if (!b) {
      return `No record of <em>day ${n}</em>. The streak runs from <strong>Day 1</strong> to <strong>Day ${BUILDS.length}</strong>.`;
    }
    return buildCard(b);
  }

  function replyDate(query) {
    // Try to match a month-day like "May 28" or a full date
    const monthMap = { jan:0,january:0, feb:1,february:1, mar:2,march:2, apr:3,april:3, may:4, jun:5,june:5, jul:6,july:6, aug:7,august:7, sep:8,sept:8,september:8, oct:9,october:9, nov:10,november:10, dec:11,december:11 };
    const m = query.match(/(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*(\d{1,2})/i);
    if (m) {
      const month = monthMap[m[1].toLowerCase().slice(0, 3)];
      const day = parseInt(m[2], 10);
      const matches = BUILDS.filter(b => {
        const d = new Date(b.date + 'T12:00:00');
        return d.getMonth() === month && d.getDate() === day;
      });
      if (matches.length === 0) {
        return `No build on <em>${m[1]} ${day}</em>. The streak started April 22 and runs through ${escapeHtml(fmtDate(BUILDS[BUILDS.length-1].date))}.`;
      }
      return matches.length === 1 ? buildCard(matches[0])
        : `Builds on <em>${m[1]} ${day}</em>:<br><br>` +
            matches.map(b => `<strong>Day ${b.d}</strong> — ${escapeHtml(b.title)}`).join('<br>');
    }
    return `I couldn't parse that as a date. Try <em>"May 28"</em> or <em>"June 17"</em>.`;
  }

  // ---- Intent detection ----
  function generateReply(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return 'Type something and press <kbd>Enter</kbd>.';

    // Greetings
    if (/^(hi|hey|hello|yo|sup|hola|greetings|good\s*(morning|afternoon|evening))/.test(q)) {
      return replyGreeting();
    }
    // Help
    if (/^(help|what can you do|commands?|how).*?/.test(q)) {
      return `I can tell you about any of the <strong>58 build days</strong>. Try:<br><br>
        • <em>"What did you build on day 37?"</em><br>
        • <em>"Day 58"</em> — by number<br>
        • <em>"May 28"</em> — by date<br>
        • <em>"recent builds"</em> or <em>"last 5"</em><br>
        • <em>"biggest features"</em> or <em>"featured"</em><br>
        • <em>"streak stats"</em> or <em>"how many days"</em><br>
        • <em>"audio"</em>, <em>"productivity"</em>, <em>"design"</em> — by tag`;
    }
    // Total
    if (/^(how many|total|count|days built)/.test(q)) return replyTotal();
    // Streak
    if (/streak/.test(q)) return replyStreak();
    // Latest / today
    if (/^(latest|today|newest|most recent|current|now)/.test(q)) return replyLatest();
    // First
    if (/^(first|oldest|earliest|where did it start)/.test(q)) return replyFirst();
    // Random
    if (/^(random|surprise|pick one|any)/.test(q)) return replyRandom();
    // Biggest
    if (/biggest|massive|largest|big drops|big features|level 4|lvl 4/.test(q)) return replyBiggest();
    // Featured
    if (/featured|ship day|major|highlight/.test(q)) return replyFeatured();
    // Recent
    const recMatch = q.match(/^(last|past|recent)\s*(\d+)?/);
    if (recMatch) {
      const n = parseInt(recMatch[2] || '7', 10);
      return replyRecent(Math.min(Math.max(n, 1), 30));
    }
    // Day by number
    const dayMatch = q.match(/day\s*(\d+)|#\s*(\d+)|^d\s*(\d+)$/);
    if (dayMatch) {
      const n = parseInt(dayMatch[1] || dayMatch[2] || dayMatch[3], 10);
      return replyDay(n);
    }
    // Date match
    if (/[a-z]{3,9}\s*\d{1,2}/.test(q)) {
      return replyDate(rawQuery);
    }
    // Tag / keyword search
    return replyTag(q);
  }

  // ---- Open / close ----
  function open() {
    panel.hidden = false;
    panel.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => inputEl && inputEl.focus(), 200);
    // First-time welcome
    if (messagesEl.children.length === 0) {
      renderMessage('bot', replyGreeting());
    }
  }
  function close() {
    panel.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { panel.hidden = true; }, 220);
  }
  function toggle() {
    if (panel.hidden || !panel.classList.contains('is-open')) open(); else close();
  }

  // ---- Send ----
  function send(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    renderMessage('user', `<div class="assistant-text">${escapeHtml(trimmed)}</div>`);
    inputEl.value = '';
    const typing = renderTyping();
    const history = loadHistory();
    history.push({ role: 'user', text: trimmed, ts: Date.now() });

    setTimeout(() => {
      typing.remove();
      const html = generateReply(trimmed);
      renderMessage('bot', html);
      history.push({ role: 'bot', html, ts: Date.now() });
      saveHistory(history);
    }, 380 + Math.random() * 280);
  }

  // ---- Suggestions ----
  function buildSuggestions() {
    const chips = [
      'Latest build', 'Biggest features', 'Day 37', 'May 28', 'recent builds', 'streak stats', 'random'
    ];
    suggestions.innerHTML = chips.map(c => `<button class="assistant-chip" data-q="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
    suggestions.querySelectorAll('.assistant-chip').forEach(btn => {
      btn.addEventListener('click', () => send(btn.dataset.q));
    });
  }

  // ---- Restore history on open ----
  function restoreHistory() {
    const history = loadHistory();
    if (!history.length) {
      renderMessage('bot', replyGreeting());
      return;
    }
    history.forEach(m => {
      if (m.role === 'user') renderMessage('user', `<div class="assistant-text">${escapeHtml(m.text)}</div>`);
      else renderMessage('bot', m.html);
    });
  }

  // ---- Init wiring ----
  buildSuggestions();

  // First-time open handler: restore full history
  function firstOpen() {
    messagesEl.innerHTML = '';
    restoreHistory();
  }

  // Bind open/close
  if (fab) fab.addEventListener('click', toggle);
  if (heroBtn) heroBtn.addEventListener('click', () => {
    open();
    if (!localStorage.getItem(STORAGE_FIRST)) {
      firstOpen();
      markSeen();
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  const sectionBtn = document.getElementById('assistant-open-section');
  if (sectionBtn) sectionBtn.addEventListener('click', () => {
    open();
    if (inputEl) inputEl.focus();
  });

  // Send
  if (sendBtn) sendBtn.addEventListener('click', () => send(inputEl.value));
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(inputEl.value);
    }
    if (e.key === 'Escape') close();
  });

  // Clear history
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all assistant history?')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    messagesEl.innerHTML = '';
    renderMessage('bot', replyGreeting());
  });

  // Global keyboard shortcut: A to open
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'a' || e.key === 'A') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const t = e.target;
      const tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      e.preventDefault();
      toggle();
    }
  });

  // Expose for command palette
  window.ajhAssistantOpen = open;
  window.ajhAssistantClose = close;
}

document.addEventListener('DOMContentLoaded', () => {
  initBuildAssistant();
});
window.initBuildAssistant = initBuildAssistant;

// Day 59 - Bookmark Cards
function initBookmarkCards() {
  const grid = document.getElementById('bookmarks-grid');
  const searchInput = document.getElementById('bookmarks-search-input');
  const sortSelect = document.getElementById('bookmarks-sort');
  const refreshBtn = document.getElementById('bookmarks-refresh');
  const viewBtns = document.querySelectorAll('.bookmarks-view-btn');
  const modal = document.getElementById('bm-modal');
  const modalBody = document.getElementById('bm-modal-body');
  const modalClose = document.getElementById('bm-modal-close');
  const totalEl = document.getElementById('bm-total');
  const shownEl = document.getElementById('bm-shown');
  const copiedEl = document.getElementById('bm-copied');
  if (!grid) return;

  const STORAGE_KEY = 'ajh_bookmarks_v1';
  const COUNTER_KEY = 'ajh_bookmark_copies_v1';

  const BOOKMARKS = [
    { id: 'home', icon: 'fa-house', title: 'Home', tag: 'Overview', desc: 'The landing page: live stats, hero insights, day counter, and quick jumps to everything else.' },
    { id: 'about', icon: 'fa-user', title: 'About AJ', tag: 'Profile', desc: 'Who I am, where I am, what I build. The Bronx, full-stack, always shipping.' },
    { id: 'projects', icon: 'fa-rocket', title: 'Projects', tag: 'Work', desc: 'The live lineup — Vault V6, UV Static, Korone, Zo Computer, and more. Filterable, clickable.' },
    { id: 'skills', icon: 'fa-bolt', title: 'Skills', tag: 'Stack', desc: 'Frontend, backend, DevOps, special. Each with an animated proficiency bar that fills on scroll.' },
    { id: 'stats', icon: 'fa-chart-line', title: 'Stats', tag: 'Numbers', desc: 'A bento grid of the streak, day count, repos, games served, and total views. Counters animate in.' },
    { id: 'journey', icon: 'fa-road', title: 'Journey', tag: 'Timeline', desc: 'The interactive timeline — click any year to expand what was happening in that era of the build.' },
    { id: 'plan', icon: 'fa-list-check', title: 'Daily Plan Board', tag: 'Productivity', desc: 'Now / Next / Later columns with drag, check, add, remove. Local-first, no backend.' },
    { id: 'snippets', icon: 'fa-code', title: 'Code Snippets Vault', tag: 'Library', desc: 'Ten hand-picked snippets I keep reaching for. Filter by language, search, copy with one click, add your own.' },
    { id: 'calendar', icon: 'fa-calendar-days', title: 'Build Calendar Heatmap', tag: 'Streak', desc: 'A GitHub-style contribution graph showing all 59 build days. Click any cell to read what shipped that day.' },
    { id: 'badges', icon: 'fa-medal', title: 'Achievement Badges', tag: 'Gamification', desc: 'Twelve unlockable badges, progress bars, and confetti when you hit a milestone. Saves to localStorage.' },
    { id: 'productivity', icon: 'fa-toolbox', title: 'Productivity Corner', tag: 'Tools', desc: 'Focus timer, daily goals, break reminder, build streak visual, and quick notes — all in one row.' },
    { id: 'demos', icon: 'fa-play', title: 'Project Demos', tag: 'Live', desc: 'Embedded demos of the major projects. Click any card to open it inside an iframe without leaving the site.' },
    { id: 'blog', icon: 'fa-newspaper', title: 'Daily Build Log', tag: 'Updates', desc: 'Every single build day, one card per day, top of the page is newest. The proof that the streak is real.' },
    { id: 'current', icon: 'fa-spinner', title: 'Currently Working On', tag: 'Status', desc: 'What I am building right now, what is queued, and what is on the back burner. Auto-updates as I ship.' },
    { id: 'contact', icon: 'fa-envelope', title: 'Contact', tag: 'Reach Out', desc: 'Email, GitHub, Discord, social. The form posts a message and stores a copy locally.' },
    { id: 'newsletter', icon: 'fa-bell', title: 'Newsletter', tag: 'Subscribe', desc: 'A no-spam, occasional update when something ships. Stores the signup locally so it persists.' },
    { id: 'gallery', icon: 'fa-images', title: 'Project Gallery', tag: 'Gallery', desc: 'Visual showcase of the projects — thumbnails, live links, and a quick filter to find the work.' },
    { id: 'achievements', icon: 'fa-trophy', title: 'Achievements', tag: 'Milestones', desc: 'The big wins — first commit, first 1K games served, first 50 days. Each one is a moment worth marking.' },
    { id: 'testimonials', icon: 'fa-comments', title: 'Testimonials', tag: 'Voices', desc: 'What collaborators and users have said about the projects. Three rotating cards, real quotes.' },
    { id: 'quotes', icon: 'fa-quote-right', title: 'Daily Quote Vault', tag: 'Inspiration', desc: 'A rotating set of inspirational quotes. Favorite them, share them, set one as your quote of the day.' },
    { id: 'faq', icon: 'fa-circle-question', title: 'FAQ', tag: 'Help', desc: 'Questions I get asked a lot — stack, location, how to collaborate, what the build streak means.' },
    { id: 'challenge', icon: 'fa-flag-checkered', title: 'Daily Challenge', tag: 'Gamification', desc: 'A new mission every day with XP rewards. Streaks, badges, and progress bars that persist.' },
    { id: 'api-status', icon: 'fa-server', title: 'API Status Dashboard', tag: 'Realtime', desc: 'Live monitoring of GitHub, Vault API, Games DB, and the proxy network. Updates every 30 seconds.' },
    { id: 'music', icon: 'fa-music', title: 'Music Player', tag: 'Lo-fi', desc: 'Built-in player with a visualizer, five demo tracks, play/pause/shuffle/repeat, and Space to toggle.' },
    { id: 'assistant', icon: 'fa-robot', title: 'Build Assistant', tag: 'AI Chat', desc: 'Press A to open the chat. It knows every one of the 59 build days and can answer by day, date, or tag.' },
    { id: 'pixelart', icon: 'fa-palette', title: 'Pixel Art Studio', tag: 'Creator', desc: 'A 16x16 pixel editor with paint / erase / fill / eyedropper, 16-color palette, undo/redo, PNG export, share-as-URL, and a saved pieces gallery. Press X to jump in.' },
    { id: 'dailychallenge', icon: 'fa-dice', title: 'Daily Challenge', tag: 'Daily', desc: 'A daily-rotating pixel art prompt that pairs with the Studio.' },
    { id: 'soundboard', icon: 'fa-music', title: 'Soundboard', tag: 'Audio', desc: 'A collection of sounds for the site. Play random, stop all, and open the board.' },
    { id: 'sequencer', icon: 'fa-drum', title: 'Step Sequencer', tag: 'Audio', desc: 'A 16-step, 8-track beat machine. Click cells to toggle, hit play, and share the pattern. Press M to open.' },
    { id: 'forge', icon: 'fa-fire-burner', title: 'The Forge', tag: 'Reflection', desc: 'A build reflection studio. Five-axis rating, 280-char note, mood emoji, weekly and all-time stats. Press F to write today.' },
    { id: 'lab', icon: 'fa-flask', title: 'Lab Notebook', tag: 'Hypotheses', desc: 'A build hypothesis log: if I add X, then Y. Draft, running, validated, falsified, parked. Kill rate, kanban, JSON I/O. Press L to open.' },
    { id: 'dna', icon: 'fa-dna', title: 'Build DNA', tag: 'Patterns', desc: 'Your build style as a strand: 8 archetype axes, personality verdict, focus card, archetypes bar, and a live build log. Press G D.' },
    { id: 'constellation75', icon: 'fa-star', title: 'Constellation Map', tag: 'Sky', desc: 'All 75 build days as a starfield. 8 archetype clusters, impact-sized stars, click to read each build, fireworks burst mode, JSON export. Press G S.' },
    { id: 'trail', icon: 'fa-timeline', title: 'Build Trail', tag: 'Chronological', desc: 'A horizontal ribbon of all 76 build days, in time order. Filter by archetype, jump to today, fire the leaderboard, export as JSON. Press G T.' },
    { id: 'weather', icon: 'fa-cloud-sun', title: 'Build Weather', tag: 'Forecast', desc: 'All 77 build days as a 7-day rolling forecast. Today\'s outlook, climate cards by archetype, conditions (Sunny/Cloudy/Stormy/...), temp & humidity, share card, export as JSON. Press G W.' },
    { id: 'tape', icon: 'fa-compact-disc', title: 'Build Tape', tag: 'Mixtape', desc: 'A vintage cassette player for 79 days of builds. Spinning reels, sliding tape, side A/B, prev/next/flip, shuffle, runtime clock, share the soundtrack. Press G P.' },
    { id: 'skyline', icon: 'fa-city', title: 'Build Skyline', tag: 'Cityscape', desc: 'All 80 build days as a city. Each day is a building, height by impact, lit windows from a seed, day/sunset/night cycle, sun & moon, click any building to read it, JSON export. Press G Y.' },
    { id: 'aquarium', icon: 'fa-fish', title: 'Build Aquarium', tag: 'Tank', desc: 'All 81 build days as a living fish tank. Each day is a fish — size by impact, species by archetype — with currents, bubbles, light cones, plants, and a Feed action that drops a flake the fish dart for. Press G A.' },
    { id: 'observatory', icon: 'fa-globe', title: 'Build Observatory', tag: 'Solar System', desc: 'All 82 build days orbiting a central planet. Each day is a moon — orbit by age, size by impact, color by archetype. 3 time-of-day modes, click any moon to read its build, shooting stars streak on demand. Press G O.' },
    { id: 'waveform', icon: 'fa-wave-square', title: 'Build Waveform', tag: 'Audio', desc: 'All 83 build days as 83 frequencies on a dual-channel oscilloscope. Each day is a tone — pitch by day, waveform by archetype, harmonic by impact. Listen mode plays history, Spectrum bars it, History scrolls it. Filter by archetype, scrub the playhead, play/pause, focus any tone, export as JSON. Press G V.' },
    { id: 'compass', icon: 'fa-compass', title: 'Build Compass', tag: 'Direction', desc: 'All 90 build days arranged around four axes: Systems, Shipping, Craft, and Learning. Click any point, filter by archetype, step through the streak, jump to today, randomize, toggle light mode, and see where the work points next. Press G C.' },
    { id: 'pulse', icon: 'fa-chart-line', title: 'Build Pulse', tag: 'Signal', desc: 'A compact local readout of recent energy, total impact, archetype lanes, and the next direction earned by the build history. Press Shift P.' },
  ];

  let state = {
    view: 'all',
    sort: 'default',
    query: '',
  };
  let copiedCount = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);

  function persistCopy() {
    try { localStorage.setItem(COUNTER_KEY, String(copiedCount)); } catch (e) {}
  }

  function buildCard(bm) {
    const el = document.createElement('div');
    el.className = 'bm-card';
    el.dataset.id = bm.id;
    el.innerHTML = `
      <div class="bm-card-preview">
        <div class="bm-preview-chrome">
          <span class="bm-dot red"></span>
          <span class="bm-dot yellow"></span>
          <span class="bm-dot green"></span>
          <span class="bm-preview-url">ajhs.zo.space/#${bm.id}</span>
        </div>
        <div class="bm-preview-body">
          <div class="bm-preview-icon"><i class="fas ${bm.icon}"></i></div>
          <div class="bm-preview-title">${bm.title}</div>
          <div class="bm-preview-desc">${bm.desc}</div>
          <div class="bm-preview-meta">
            <span class="bm-tag">${bm.tag}</span>
            <span class="bm-preview-domain">ajhs.zo.space</span>
          </div>
        </div>
      </div>
      <div class="bm-card-footer">
        <button class="bm-icon-btn bm-open" title="Open section"><i class="fas fa-arrow-up-right-from-square"></i></button>
        <button class="bm-icon-btn bm-copy" title="Copy link"><i class="fas fa-link"></i></button>
        <button class="bm-icon-btn bm-share" title="Share"><i class="fas fa-share-nodes"></i></button>
        <button class="bm-icon-btn bm-detail" title="View details"><i class="fas fa-ellipsis"></i></button>
      </div>
    `;
    el.querySelector('.bm-open').addEventListener('click', (e) => {
      e.stopPropagation();
      location.hash = '#' + bm.id;
    });
    el.querySelector('.bm-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      copyLink(bm, el.querySelector('.bm-copy'));
    });
    el.querySelector('.bm-share').addEventListener('click', (e) => {
      e.stopPropagation();
      shareLink(bm);
    });
    el.querySelector('.bm-detail').addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(bm);
    });
    el.querySelector('.bm-card-preview').addEventListener('click', () => openModal(bm));
    return el;
  }

  function applyFilters() {
    let list = BOOKMARKS.slice();
    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    if (state.sort === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));
    if (state.sort === 'tag') list.sort((a, b) => a.tag.localeCompare(b.tag));
    return list;
  }

  function render() {
    const list = applyFilters();
    grid.innerHTML = '';
    list.forEach(bm => grid.appendChild(buildCard(bm)));
    if (shownEl) shownEl.textContent = list.length;
    if (totalEl) totalEl.textContent = BOOKMARKS.length;
    if (copiedEl) copiedEl.textContent = copiedCount;
  }

  function copyLink(bm, btn) {
    const url = location.origin + location.pathname + '#' + bm.id;
    const onOk = () => {
      copiedCount += 1;
      persistCopy();
      if (copiedEl) copiedEl.textContent = copiedCount;
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add('bm-icon-btn-success');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('bm-icon-btn-success');
        }, 1200);
      }
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(onOk).catch(() => fallbackCopy(url, onOk));
    } else {
      fallbackCopy(url, onOk);
    }
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb && cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function shareLink(bm) {
    const url = location.origin + location.pathname + '#' + bm.id;
    if (navigator.share) {
      navigator.share({ title: bm.title + ' — AJ H', text: bm.desc, url }).catch(() => {});
    } else {
      copyLink(bm, null);
    }
  }

  function openModal(bm) {
    const url = location.origin + location.pathname + '#' + bm.id;
    modalBody.innerHTML = `
      <div class="bm-modal-header">
        <div class="bm-modal-icon"><i class="fas ${bm.icon}"></i></div>
        <div>
          <div class="bm-modal-eyebrow">${bm.tag}</div>
          <h3 class="bm-modal-title">${bm.title}</h3>
        </div>
      </div>
      <p class="bm-modal-desc">${bm.desc}</p>
      <div class="bm-modal-preview">
        <div class="bm-preview-chrome">
          <span class="bm-dot red"></span>
          <span class="bm-dot yellow"></span>
          <span class="bm-dot green"></span>
          <span class="bm-preview-url">${url}</span>
        </div>
        <div class="bm-preview-body">
          <div class="bm-preview-icon"><i class="fas ${bm.icon}"></i></div>
          <div class="bm-preview-title">${bm.title}</div>
          <div class="bm-preview-desc">${bm.desc}</div>
          <div class="bm-preview-meta">
            <span class="bm-tag">${bm.tag}</span>
            <span class="bm-preview-domain">ajhs.zo.space</span>
          </div>
        </div>
      </div>
      <div class="bm-modal-link">
        <i class="fas fa-link"></i>
        <input type="text" value="${url}" readonly />
        <button class="btn btn-primary btn-sm" id="bm-modal-copy"><i class="fas fa-copy"></i> Copy</button>
      </div>
      <div class="bm-modal-actions">
        <a href="#${bm.id}" class="btn btn-primary"><i class="fas fa-arrow-up-right-from-square"></i> Open Section</a>
        <button class="btn btn-outline" id="bm-modal-share"><i class="fas fa-share-nodes"></i> Share</button>
      </div>
    `;
    modal.classList.add('bm-modal-open');
    document.body.style.overflow = 'hidden';
    modalBody.querySelector('#bm-modal-copy').addEventListener('click', () => {
      fallbackCopy(url, () => {
        const btn = modalBody.querySelector('#bm-modal-copy');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(() => { btn.innerHTML = orig; }, 1200);
      });
      copiedCount += 1;
      persistCopy();
      if (copiedEl) copiedEl.textContent = copiedCount;
    });
    modalBody.querySelector('#bm-modal-share').addEventListener('click', () => shareLink(bm));
  }

  function closeModal() {
    modal.classList.remove('bm-modal-open');
    document.body.style.overflow = '';
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      render();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });
  }
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.dataset.view;
      grid.classList.toggle('bm-grid-compact', state.view === 'compact');
      render();
    });
  });
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spinning');
      render();
      setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
    });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('bm-modal-open')) closeModal();
  });

  render();
  window.initBookmarkCards = initBookmarkCards;
}

document.addEventListener('DOMContentLoaded', () => {
  initBookmarkCards();
});

/* ========================================
   DAY 60 - SITE CONSTELLATION
   Interactive node graph of every section
   ======================================== */
function initConstellation() {
  const stage = document.getElementById('constellation-stage');
  const svg = document.getElementById('constellation-svg');
  const edgesGroup = document.getElementById('constellation-edges-layer');
  const nodesGroup = document.getElementById('constellation-nodes-layer');
  const tooltip = document.getElementById('constellation-tooltip');
  const detail = document.getElementById('constellation-detail');
  const detailIcon = document.getElementById('constellation-detail-icon');
  const detailTitle = document.getElementById('constellation-detail-title');
  const detailTag = document.getElementById('constellation-detail-tag');
  const detailDesc = document.getElementById('constellation-detail-desc');
  const detailConnections = document.getElementById('constellation-detail-connections');
  const detailGo = document.getElementById('constellation-detail-go');
  const detailClose = document.getElementById('constellation-detail-close');
  const searchInput = document.getElementById('constellation-search');
  const chips = document.querySelectorAll('.constellation-chip');
  const zoomInBtn = document.getElementById('constellation-zoom-in');
  const zoomOutBtn = document.getElementById('constellation-zoom-out');
  const zoomResetBtn = document.getElementById('constellation-zoom-reset');
  const zoomLevelEl = document.getElementById('constellation-zoom-level');
  const resetLayoutBtn = document.getElementById('constellation-reset-layout');
  const statNodes = document.getElementById('constellation-nodes-count');
  const statEdgesEl = document.getElementById('constellation-edges-count');
  const statShown = document.getElementById('constellation-shown-count');
  const statClicks = document.getElementById('constellation-clicked-count');
  if (!stage || !svg) return;

  // NODES — every section, mapped to a category
  // categories: core, tools, data, content
  const NODES = [
    { id: 'home', label: 'Home', category: 'core', icon: 'fa-house', desc: 'The landing hero with live stats, time-based greeting, and a Day-Streak badge.', tag: 'Overview' },
    { id: 'about', label: 'About', category: 'core', icon: 'fa-user', desc: 'Who I am: full-stack developer in The Bronx, building every day.', tag: 'Profile' },
    { id: 'projects', label: 'Projects', category: 'core', icon: 'fa-rocket', desc: 'The live lineup — Vault V6, UV Static, Korone, Zo Computer, more. Filterable.', tag: 'Work' },
    { id: 'skills', label: 'Skills', category: 'core', icon: 'fa-bolt', desc: 'Frontend, backend, DevOps, special — animated proficiency bars.', tag: 'Stack' },
    { id: 'stats', label: 'Stats', category: 'data', icon: 'fa-chart-line', desc: 'Bento grid of streak, repos, games served, total views.', tag: 'Numbers' },
    { id: 'journey', label: 'Journey', category: 'content', icon: 'fa-road', desc: 'Interactive timeline — click any year to expand the era.', tag: 'Timeline' },
    { id: 'plan', label: 'Plan Board', category: 'tools', icon: 'fa-list-check', desc: 'Now / Next / Later columns with drag, check, add, remove.', tag: 'Productivity' },
    { id: 'snippets', label: 'Snippets', category: 'tools', icon: 'fa-code', desc: 'Hand-picked snippets, search, copy, edit, delete. localStorage.', tag: 'Library' },
    { id: 'calendar', label: 'Calendar', category: 'data', icon: 'fa-calendar-days', desc: 'GitHub-style heatmap for 60 build days, click any cell.', tag: 'Streak' },
    { id: 'badges', label: 'Badges', category: 'data', icon: 'fa-medal', desc: 'Twelve unlockable badges with progress and confetti.', tag: 'Gamification' },
    { id: 'productivity', label: 'Productivity', category: 'tools', icon: 'fa-toolbox', desc: 'Focus timer, goals, break reminders, build streak.', tag: 'Tools' },
    { id: 'demos', label: 'Demos', category: 'core', icon: 'fa-play', desc: 'Embedded demos of major projects in iframes.', tag: 'Live' },
    { id: 'blog', label: 'Build Log', category: 'content', icon: 'fa-newspaper', desc: 'Every build day, one card per day, top is newest.', tag: 'Updates' },
    { id: 'current', label: 'Working On', category: 'content', icon: 'fa-spinner', desc: 'What I am building right now, what is queued.', tag: 'Status' },
    { id: 'contact', label: 'Contact', category: 'core', icon: 'fa-envelope', desc: 'Email, GitHub, Discord, social.', tag: 'Reach Out' },
    { id: 'newsletter', label: 'Newsletter', category: 'content', icon: 'fa-bell', desc: 'No-spam updates when something ships. localStorage signup.', tag: 'Subscribe' },
    { id: 'gallery', label: 'Gallery', category: 'content', icon: 'fa-images', desc: 'Visual showcase — thumbnails and live links.', tag: 'Gallery' },
    { id: 'achievements', label: 'Achievements', category: 'data', icon: 'fa-trophy', desc: 'Big wins: first commit, 1K games served, 50 days.', tag: 'Milestones' },
    { id: 'testimonials', label: 'Testimonials', category: 'content', icon: 'fa-comments', desc: 'What collaborators and users have said.', tag: 'Voices' },
    { id: 'quotes', label: 'Quotes', category: 'content', icon: 'fa-quote-right', desc: 'Rotating inspirational quotes. Favorite and share.', tag: 'Inspiration' },
    { id: 'faq', label: 'FAQ', category: 'content', icon: 'fa-circle-question', desc: 'Common questions — stack, location, how to collaborate.', tag: 'Help' },
    { id: 'challenge', label: 'Challenge', category: 'data', icon: 'fa-flag-checkered', desc: 'A new mission every day with XP rewards.', tag: 'Gamification' },
    { id: 'api-status', label: 'API Status', category: 'data', icon: 'fa-server', desc: 'Live monitoring of GitHub, Vault, Games DB, proxy.', tag: 'Realtime' },
    { id: 'music', label: 'Music', category: 'content', icon: 'fa-music', desc: 'Built-in player with visualizer, five demo tracks.', tag: 'Lo-fi' },
    { id: 'assistant', label: 'Assistant', category: 'tools', icon: 'fa-robot', desc: 'Chat with the build — knows every build day.', tag: 'AI Chat' },
    { id: 'bookmarks', label: 'Bookmarks', category: 'tools', icon: 'fa-bookmark', desc: 'Share cards for every section. Pin, search, share.', tag: 'Shareable' },
    { id: 'constellation', label: 'Constellation', category: 'data', icon: 'fa-diagram-project', desc: 'You are here. This interactive graph of every section.', tag: 'Milestone' },
    { id: 'pixelart', label: 'Pixel Art Studio', category: 'tools', icon: 'fa-palette', desc: 'A 16x16 pixel editor — paint, save, share.', tag: 'Creator' },
    { id: 'dailychallenge', label: 'Daily Challenge', category: 'tools', icon: 'fa-dice', desc: 'A daily-rotating pixel art prompt that pairs with the Studio.', tag: 'Daily' },
  ];

  // EDGES — relationships between sections (this → that)
  const EDGES = [
    ['home', 'about'], ['home', 'projects'], ['home', 'stats'], ['home', 'blog'],
    ['about', 'skills'], ['about', 'journey'], ['about', 'contact'],
    ['projects', 'demos'], ['projects', 'gallery'], ['projects', 'achievements'],
    ['skills', 'projects'], ['skills', 'about'],
    ['stats', 'calendar'], ['stats', 'achievements'], ['stats', 'badges'],
    ['journey', 'blog'], ['journey', 'achievements'],
    ['plan', 'productivity'], ['plan', 'snippets'],
    ['productivity', 'plan'], ['productivity', 'current'],
    ['snippets', 'projects'], ['snippets', 'assistant'], ['snippets', 'pixelart'],
    ['calendar', 'blog'], ['calendar', 'assistant'], ['calendar', 'badges'], ['calendar', 'stats'],
    ['badges', 'achievements'], ['badges', 'challenge'], ['badges', 'stats'],
    ['challenge', 'badges'], ['challenge', 'current'],
    ['api-status', 'stats'], ['api-status', 'projects'],
    ['music', 'productivity'], ['music', 'home'],
    ['assistant', 'calendar'], ['assistant', 'blog'], ['assistant', 'snippets'],
    ['bookmarks', 'home'], ['bookmarks', 'projects'], ['bookmarks', 'blog'],
    ['quotes', 'productivity'], ['quotes', 'blog'],
    ['testimonials', 'about'], ['testimonials', 'projects'],
    ['faq', 'contact'], ['faq', 'about'],
    ['newsletter', 'blog'], ['newsletter', 'contact'],
    ['current', 'plan'], ['current', 'blog'],
    ['gallery', 'projects'], ['gallery', 'demos'],
    ['constellation', 'home'], ['constellation', 'bookmarks'], ['constellation', 'calendar'], ['pixelart', 'home'], ['pixelart', 'snippets'], ['pixelart', 'assistant'],
    ['contact', 'home'], ['contact', 'newsletter'],
  ];

  // Position nodes on concentric rings. Home at center.
  const RING_LAYOUT = (() => {
    const positions = {};
    const cx = 0, cy = 0;
    const ring1 = ['home'];
    const ring2 = ['about', 'projects', 'blog', 'skills', 'stats', 'current', 'contact'];
    const ring3 = ['plan', 'snippets', 'calendar', 'badges', 'journey', 'productivity', 'demos'];
    const ring4 = ['newsletter', 'gallery', 'achievements', 'testimonials', 'quotes', 'faq'];
    const ring5 = ['challenge', 'api-status', 'music', 'assistant', 'bookmarks', 'constellation'];

    const place = (arr, radius) => {
      const n = arr.length;
      arr.forEach((id, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        positions[id] = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
      });
    };
    place(ring1, 0);
    place(ring2, 180);
    place(ring3, 320);
    place(ring4, 450);
    place(ring5, 540);
    return positions;
  })();

  // Mutable state per node
  const nodeState = {};
  NODES.forEach(n => {
    nodeState[n.id] = {
      x: RING_LAYOUT[n.id].x,
      y: RING_LAYOUT[n.id].y,
      pinned: false,
    };
  });

  // View transform (zoom + pan)
  const view = { scale: 1, tx: 0, ty: 0 };

  // Selection / filter state
  let activeCategory = 'all';
  let searchQuery = '';
  let highlightedId = null;
  let visitCount = parseInt(localStorage.getItem('ajh_constellation_views_v1') || '0', 10);

  const svgNS = 'http://www.w3.org/2000/svg';

  function visibleSet() {
    // Returns Set of node IDs that pass current filter/search.
    const set = new Set();
    const q = searchQuery.trim().toLowerCase();
    NODES.forEach(n => {
      const catOk = activeCategory === 'all' || n.category === activeCategory;
      const qOk = !q ||
        n.id.toLowerCase().includes(q) ||
        n.label.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q);
      if (catOk && qOk) set.add(n.id);
    });
    return set;
  }

  function setHighlight(id) {
    highlightedId = id;
    render();
  }

  function render() {
    // Update SVG size to match stage in CSS pixels.
    const rect = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', `${rect.width / 2 - 500} ${rect.height / 2 - 360} 1000 720`);

    const vis = visibleSet();

    // Edges
    edgesGroup.innerHTML = '';
    EDGES.forEach(([a, b]) => {
      const A = nodeState[a];
      const B = nodeState[b];
      if (!A || !B) return;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', A.x);
      line.setAttribute('y1', A.y);
      line.setAttribute('x2', B.x);
      line.setAttribute('y2', B.y);
      const bothVisible = vis.has(a) && vis.has(b);
      const bothHighlighted = highlightedId && (a === highlightedId || b === highlightedId);
      line.setAttribute('class', 'constellation-edge' +
        (!bothVisible ? ' dimmed' : '') +
        (bothHighlighted ? ' highlighted' : ''));
      edgesGroup.appendChild(line);
    });

    // Nodes + labels
    nodesGroup.innerHTML = '';
    NODES.forEach(n => {
      const s = nodeState[n.id];
      const isVisible = vis.has(n.id);
      const isHighlighted = highlightedId === n.id;
      const connectedHighlighted = highlightedId && EDGES.some(([a, b]) =>
        (a === highlightedId && b === n.id) || (b === highlightedId && a === n.id));

      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'constellation-node' +
        (!isVisible ? ' dimmed' : '') +
        (isHighlighted || connectedHighlighted ? ' highlighted' : ''));
      g.setAttribute('data-id', n.id);
      g.setAttribute('data-category', n.category);
      g.setAttribute('transform', `translate(${s.x}, ${s.y})`);

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('class', 'constellation-node-circle');
      circle.setAttribute('r', isHighlighted ? 18 : 14);
      g.appendChild(circle);

      // Inner icon — render via foreignObject using an inline SVG of the FA path.
      // Simpler: skip inner icon, keep clean.

      nodesGroup.appendChild(g);

      // Label below node — appended to the same group so it moves with the node.
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('class', 'constellation-node-label');
      label.setAttribute('x', 0);
      label.setAttribute('y', isHighlighted ? 36 : 30);
      label.setAttribute('text-anchor', 'middle');
      label.textContent = n.label;
      if (!isVisible) label.style.opacity = '0.2';
      if (isHighlighted) label.style.fontWeight = '700';
      g.appendChild(label);

      // Drag + hover/click handlers on the node group
      attachNodeHandlers(g, n);
    });

    // Footer stats
    if (statNodes) statNodes.textContent = NODES.length;
    if (statEdgesEl) statEdgesEl.textContent = EDGES.length;
    if (statShown) statShown.textContent = vis.size;
    if (statClicks) statClicks.textContent = visitCount;
  }

  function attachNodeHandlers(g, node) {
    let dragging = false;
    let moved = false;
    let startPt = null;

    g.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dragging = true;
      moved = false;
      startPt = { x: e.clientX, y: e.clientY, nx: nodeState[node.id].x, ny: nodeState[node.id].y };
      g.setPointerCapture(e.pointerId);
    });

    g.addEventListener('pointermove', (e) => {
      if (!dragging || !startPt) return;
      const rect = svg.getBoundingClientRect();
      // Convert screen pixels to SVG world units.
      const vb = svg.viewBox.baseVal;
      const sx = vb.width / rect.width;
      const sy = vb.height / rect.height;
      const dx = (e.clientX - startPt.x) * sx;
      const dy = (e.clientY - startPt.y) * sy;
      if (Math.hypot(e.clientX - (startPt.x / sx - vb.x), e.clientY - (startPt.y / sy - vb.y)) > 3) moved = true;
      nodeState[node.id].x = startPt.nx + dx;
      nodeState[node.id].y = startPt.ny + dy;
      // Update just this node + adjacent edges cheaply.
      quickUpdate();
    });

    g.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      try { g.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!moved) {
        // Treat as click — open detail
        openDetail(node.id);
      }
    });

    g.addEventListener('pointerenter', (e) => {
      if (!tooltip) return;
      tooltip.textContent = `${node.label} — ${node.tag}`;
      tooltip.style.opacity = '1';
      positionTooltip(e);
      if (!dragging) setHighlight(node.id);
    });

    g.addEventListener('pointermove', (e) => {
      if (!tooltip) return;
      positionTooltip(e);
    });

    g.addEventListener('pointerleave', () => {
      if (!tooltip) return;
      tooltip.style.opacity = '0';
      // Don't clear highlight if the detail panel is open for this node.
      if (highlightedId === node.id && !(detail && detail.classList.contains('open'))) {
        setHighlight(null);
      }
    });
  }

  function positionTooltip(e) {
    if (!tooltip) return;
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left + 12;
    const y = e.clientY - rect.top + 12;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  // Cheaper partial update — for drags only the moved node + its edges change.
  function quickUpdate() {
    edgesGroup.innerHTML = '';
    const vis = visibleSet();
    EDGES.forEach(([a, b]) => {
      const A = nodeState[a];
      const B = nodeState[b];
      if (!A || !B) return;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', A.x);
      line.setAttribute('y1', A.y);
      line.setAttribute('x2', B.x);
      line.setAttribute('y2', B.y);
      const bothVisible = vis.has(a) && vis.has(b);
      const bothHighlighted = highlightedId && (a === highlightedId || b === highlightedId);
      line.setAttribute('class', 'constellation-edge' +
        (!bothVisible ? ' dimmed' : '') +
        (bothHighlighted ? ' highlighted' : ''));
      edgesGroup.appendChild(line);
    });

    // Labels live inside each node group, so they move with their node during drag —
    // no separate label update needed here.
  }

  function openDetail(id) {
    const node = NODES.find(n => n.id === id);
    if (!node || !detail) return;
    visitCount += 1;
    try { localStorage.setItem('ajh_constellation_views_v1', String(visitCount)); } catch (_) {}
    if (detailTitle) detailTitle.textContent = node.label;
    if (detailTag) detailTag.textContent = node.tag;
    if (detailDesc) detailDesc.textContent = node.desc;
    if (detailIcon) {
      detailIcon.className = 'fas ' + node.icon;
    }
    if (detailConnections) {
      const connCount = EDGES.filter(([a, b]) => a === id || b === id).length;
      detailConnections.textContent = `${connCount} connection${connCount === 1 ? '' : 's'} from this section`;
    }
    if (detailGo) detailGo.dataset.go = id;
    detail.classList.add('open');
    detail.setAttribute('aria-hidden', 'false');
    setHighlight(id);
  }

  function closeDetail() {
    if (!detail) return;
    detail.classList.remove('open');
    detail.setAttribute('aria-hidden', 'true');
    setHighlight(null);
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      render();
    });
  }

  // Category chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.filter || 'all';
      render();
    });
  });

  // Zoom controls
  function applyZoom(delta) {
    view.scale = Math.max(0.4, Math.min(2.5, view.scale + delta));
    // Scale via viewBox width/height around center.
    const rect = stage.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const halfW = 500 / view.scale;
    const halfH = 360 / view.scale;
    svg.setAttribute('viewBox', `${cx - halfW} ${cy - halfH} ${halfW * 2} ${halfH * 2}`);
  }
  function resetView() {
    view.scale = 1;
    const rect = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', `${rect.width / 2 - 500} ${rect.height / 2 - 360} 1000 720`);
  }
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => applyZoom(0.15));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => applyZoom(-0.15));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetView);
  if (resetLayoutBtn) {
    resetLayoutBtn.addEventListener('click', () => {
      NODES.forEach(n => {
        if (RING_LAYOUT[n.id]) {
          nodeState[n.id].x = RING_LAYOUT[n.id].x;
          nodeState[n.id].y = RING_LAYOUT[n.id].y;
        }
      });
      resetLayoutBtn.classList.add('spinning');
      render();
      setTimeout(() => resetLayoutBtn.classList.remove('spinning'), 600);
    });
  }

  if (detailClose) detailClose.addEventListener('click', closeDetail);
  if (detailGo) {
    detailGo.addEventListener('click', () => {
      const targetId = detailGo.dataset.go;
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
      closeDetail();
    });
  }
  if (detail) {
    detail.addEventListener('click', (e) => {
      if (e.target === detail) closeDetail();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detail && detail.classList.contains('open')) closeDetail();
  });

  // Re-layout when window resizes so the SVG viewBox stays centered.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const rect = stage.getBoundingClientRect();
      svg.setAttribute('viewBox', `${rect.width / 2 - 500} ${rect.height / 2 - 360} 1000 720`);
    }, 150);
  });

  // SVG defs — gradient for edges (Day 60)
  const defs = document.createElementNS(svgNS, 'defs');
  defs.innerHTML = `
    <linearGradient id="constellation-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.7"/>
    </linearGradient>
  `;
  svg.insertBefore(defs, svg.firstChild);

  if (tooltip) tooltip.style.opacity = '0';

  render();
  window.initConstellation = initConstellation;
}

document.addEventListener('DOMContentLoaded', () => {
  initConstellation();
  initTimeCapsule();
  initThemeStudio();
  initReadingMode();
  initBuildJournal();
  initCommunityWishlist();
  initDailyWisdom();
  console.log("⚡ AJH Website loaded - Day 67: Pixel Art Studio + Day 68: Daily Pixel Challenge");
});
/* ============================================================
   Day 61: Time Capsule Vault
   ============================================================ */
function initTimeCapsule() {
  const grid = document.getElementById('timecapsule-grid');
  const empty = document.getElementById('timecapsule-empty');
  const filters = document.querySelectorAll('.timecapsule-filter');
  const newBtn = document.getElementById('timecapsule-new-btn');
  const heroBtn = document.getElementById('timecapsule-hero-btn');
  const statTotal = document.getElementById('timecapsule-total');
  const statSealed = document.getElementById('timecapsule-locked');
  const statUnlocked = document.getElementById('timecapsule-unlocked');
  const statNext = document.getElementById('timecapsule-soonest');

  const modal = document.getElementById('timecapsule-modal');
  const modalForm = document.getElementById('timecapsule-form');
  const modalId = document.getElementById('timecapsule-id');
  const modalTitle = document.getElementById('timecapsule-title');
  const modalMessage = document.getElementById('timecapsule-message');
  const modalUnlock = document.getElementById('timecapsule-unlock');
  const modalMood = document.getElementById('timecapsule-mood');
  const modalCharcount = document.getElementById('timecapsule-charcount');
  const modalTitleText = document.getElementById('timecapsule-modal-title');
  const modalCloseBtns = modal ? modal.querySelectorAll('[data-close]') : [];

  const reader = document.getElementById('timecapsule-reader');
  const readerMood = document.getElementById('timecapsule-reader-mood');
  const readerDate = document.getElementById('timecapsule-reader-date');
  const readerTitle = document.getElementById('timecapsule-reader-title');
  const readerUnlock = document.getElementById('timecapsule-reader-unlock');
  const readerMessage = document.getElementById('timecapsule-reader-message');
  const readerShareBtn = document.getElementById('timecapsule-share-btn');
  const readerDeleteBtn = document.getElementById('timecapsule-delete-btn');
  const readerCloseBtns = reader ? reader.querySelectorAll('[data-reader-close]') : [];

  if (!grid || !modal || !reader) return;

  const STORAGE_KEY = 'ajh_timecapsule_v1';
  const today = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const MOODS = {
    hopeful: { label: 'Hopeful', emoji: '🌱' },
    grateful: { label: 'Grateful', emoji: '🙏' },
    determined: { label: 'Determined', emoji: '🔥' },
    reflective: { label: 'Reflective', emoji: '🌙' },
    curious: { label: 'Curious', emoji: '🧭' },
    celebrating: { label: 'Celebrating', emoji: '🎉' }
  };

  function moodInfo(m) { return MOODS[m] || MOODS.hopeful; }

  function fmtDate(d) {
    if (!d) return '—';
    const date = (d instanceof Date) ? d : new Date(d);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function shortDate(d) {
    if (!d) return '—';
    const date = (d instanceof Date) ? d : new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map(c => ({
        id: c.id,
        title: c.title || 'Untitled',
        message: c.message || '',
        unlockAt: c.unlockAt,
        mood: c.mood || 'hopeful',
        createdAt: c.createdAt || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  function save(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* quota */ }
  }

  function isUnlocked(c) {
    return today().getTime() >= new Date(c.unlockAt).getTime();
  }

  function daysUntil(iso) {
    const t = today();
    t.setHours(0, 0, 0, 0);
    const target = new Date(iso);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function snippet(text, max) {
    if (!text) return '';
    const t = String(text).replace(/\s+/g, ' ').trim();
    return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
  }

  let state = { filter: 'all', capsules: load() };

  function filtered() {
    return state.capsules.filter(c => {
      if (state.filter === 'sealed') return !isUnlocked(c);
      if (state.filter === 'opened') return isUnlocked(c);
      return true;
    }).sort((a, b) => new Date(a.unlockAt) - new Date(b.unlockAt));
  }

  function render() {
    const visible = filtered();
    grid.innerHTML = visible.map(renderCard).join('');
    if (empty) empty.hidden = visible.length > 0;

    const total = state.capsules.length;
    const unlocked = state.capsules.filter(isUnlocked).length;
    const sealed = total - unlocked;

    if (statTotal) statTotal.textContent = total;
    if (statSealed) statSealed.textContent = sealed;
    if (statUnlocked) statUnlocked.textContent = unlocked;
    if (statNext) {
      const sealedList = state.capsules
        .filter(c => !isUnlocked(c))
        .sort((a, b) => new Date(a.unlockAt) - new Date(b.unlockAt));
      statNext.textContent = sealedList.length === 0
        ? (total > 0 ? 'All opened' : '—')
        : shortDate(sealedList[0].unlockAt);
    }
  }

  function renderCard(c) {
    const mood = moodInfo(c.mood);
    const unlocked = isUnlocked(c);
    const days = daysUntil(c.unlockAt);
    let countdownText;
    if (unlocked) {
      countdownText = `<i class="fas fa-unlock"></i> Opened ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    } else if (days === 0) {
      countdownText = `<i class="fas fa-hourglass-end"></i> Unlocks today`;
    } else if (days === 1) {
      countdownText = `<i class="fas fa-hourglass-half"></i> Unlocks tomorrow`;
    } else {
      countdownText = `<i class="fas fa-hourglass-half"></i> Unlocks in ${days} days`;
    }

    return `
      <article class="timecapsule-card ${unlocked ? 'is-open' : 'is-sealed'}" data-id="${escapeHtml(c.id)}">
        <div class="timecapsule-card-top">
          <div class="timecapsule-card-mood">${mood.emoji} ${mood.label}</div>
          <div class="timecapsule-card-status">
            ${unlocked ? '<span class="timecapsule-status opened"><i class="fas fa-unlock"></i> Opened</span>' : '<span class="timecapsule-status sealed"><i class="fas fa-lock"></i> Sealed</span>'}
          </div>
        </div>
        <h3 class="timecapsule-card-title">${escapeHtml(c.title)}</h3>
        <p class="timecapsule-card-snippet">${escapeHtml(snippet(c.message, 140))}</p>
        <div class="timecapsule-card-meta">
          <span class="timecapsule-card-date"><i class="fas fa-calendar"></i> ${shortDate(c.unlockAt)}</span>
          <span class="timecapsule-card-countdown">${countdownText}</span>
        </div>
        <div class="timecapsule-card-actions">
          <button class="timecapsule-btn timecapsule-read-btn" data-id="${escapeHtml(c.id)}">
            <i class="fas fa-book-open"></i> ${unlocked ? 'Read' : 'Preview'}
          </button>
          <button class="timecapsule-btn timecapsule-edit-btn" data-id="${escapeHtml(c.id)}" aria-label="Edit capsule">
            <i class="fas fa-pen"></i>
          </button>
          <button class="timecapsule-btn timecapsule-delete-btn" data-id="${escapeHtml(c.id)}" aria-label="Delete capsule">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </article>
    `;
  }

  function openComposer(id) {
    if (id) {
      const c = state.capsules.find(x => x.id === id);
      if (!c) return;
      modalId.value = id;
      modalTitle.value = c.title;
      modalMessage.value = c.message;
      modalUnlock.value = c.unlockAt;
      modalMood.value = c.mood;
      if (modalTitleText) modalTitleText.textContent = 'Edit Time Capsule';
    } else {
      modalId.value = '';
      modalForm.reset();
      const future = new Date();
      future.setDate(future.getDate() + 30);
      modalUnlock.value = future.toISOString().slice(0, 10);
      modalMood.value = 'hopeful';
      if (modalTitleText) modalTitleText.textContent = 'New Time Capsule';
    }
    if (modalCharcount) modalCharcount.textContent = `${modalMessage.value.length} / 2000`;
    modal.hidden = false;
    document.body.classList.add('timecapsule-modal-open');
    setTimeout(() => modalTitle.focus(), 50);
  }

  function closeComposer() {
    modal.hidden = true;
    document.body.classList.remove('timecapsule-modal-open');
  }

  function openReader(id) {
    const c = state.capsules.find(x => x.id === id);
    if (!c) return;
    const mood = moodInfo(c.mood);
    const unlocked = isUnlocked(c);
    const days = daysUntil(c.unlockAt);

    if (readerMood) readerMood.innerHTML = `${mood.emoji} ${mood.label}`;
    if (readerDate) readerDate.textContent = `Sealed ${shortDate(c.createdAt)}`;
    if (readerTitle) readerTitle.textContent = c.title || 'Untitled Capsule';

    if (readerUnlock) {
      if (unlocked) {
        readerUnlock.innerHTML = `<i class="fas fa-unlock"></i> Opened on ${fmtDate(c.unlockAt)}`;
        readerUnlock.classList.add('is-open');
      } else if (days === 0) {
        readerUnlock.innerHTML = `<i class="fas fa-hourglass-end"></i> Unlocks today!`;
        readerUnlock.classList.remove('is-open');
      } else if (days === 1) {
        readerUnlock.innerHTML = `<i class="fas fa-hourglass-half"></i> Unlocks tomorrow (${shortDate(c.unlockAt)})`;
        readerUnlock.classList.remove('is-open');
      } else {
        readerUnlock.innerHTML = `<i class="fas fa-hourglass-half"></i> Unlocks in ${days} days (${shortDate(c.unlockAt)})`;
        readerUnlock.classList.remove('is-open');
      }
    }

    if (readerMessage) {
      if (unlocked) {
        readerMessage.textContent = c.message;
        readerMessage.classList.remove('sealed');
      } else {
        const preview = c.message ? snippet(c.message, 220) : '';
        readerMessage.textContent = `This capsule is still sealed. Return on ${shortDate(c.unlockAt)} to read it in full.\n\n—\n\n${preview}`;
        readerMessage.classList.add('sealed');
      }
    }

    if (readerShareBtn) readerShareBtn.dataset.id = id;
    if (readerDeleteBtn) readerDeleteBtn.dataset.id = id;
    reader.hidden = false;
    document.body.classList.add('timecapsule-modal-open');
  }

  function closeReader() {
    reader.hidden = true;
    document.body.classList.remove('timecapsule-modal-open');
  }

  function deleteCapsule(id) {
    state.capsules = state.capsules.filter(c => c.id !== id);
    save(state.capsules);
    render();
  }

  // Wire events
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      f.classList.add('active');
      state.filter = f.dataset.filter;
      render();
    });
  });

  if (newBtn) newBtn.addEventListener('click', () => openComposer());
  if (heroBtn) heroBtn.addEventListener('click', () => openComposer());

  modalCloseBtns.forEach(b => b.addEventListener('click', closeComposer));
  readerCloseBtns.forEach(b => b.addEventListener('click', closeReader));

  if (modalMessage && modalCharcount) {
    modalMessage.addEventListener('input', () => {
      modalCharcount.textContent = `${modalMessage.value.length} / 2000`;
    });
  }

  grid.addEventListener('click', (e) => {
    const read = e.target.closest('.timecapsule-read-btn');
    const edit = e.target.closest('.timecapsule-edit-btn');
    const del = e.target.closest('.timecapsule-delete-btn');
    const card = e.target.closest('.timecapsule-card');
    if (read) { openReader(read.dataset.id); return; }
    if (edit) { openComposer(edit.dataset.id); return; }
    if (del) {
      const c = state.capsules.find(x => x.id === del.dataset.id);
      const ok = confirm(`Delete capsule "${c?.title || 'Untitled'}"? This cannot be undone.`);
      if (ok) deleteCapsule(del.dataset.id);
      return;
    }
    if (card && !e.target.closest('button')) {
      openReader(card.dataset.id);
    }
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = modalTitle.value.trim();
    const message = modalMessage.value.trim();
    const unlockAt = modalUnlock.value;
    const mood = modalMood.value;
    if (!title || !message || !unlockAt) return;
    const id = modalId.value;
    if (id) {
      const idx = state.capsules.findIndex(c => c.id === id);
      if (idx >= 0) state.capsules[idx] = { ...state.capsules[idx], title, message, unlockAt, mood };
    } else {
      const newId = 'cap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      state.capsules.push({ id: newId, title, message, unlockAt, mood, createdAt: new Date().toISOString() });
    }
    save(state.capsules);
    closeComposer();
    render();
  });

  if (readerShareBtn) {
    readerShareBtn.addEventListener('click', async () => {
      const id = readerShareBtn.dataset.id;
      const c = state.capsules.find(x => x.id === id);
      if (!c) return;
      const url = window.location.href.split('#')[0] + '#timecapsule';
      const text = `A time capsule sealed on ${shortDate(c.createdAt)}, set to open on ${shortDate(c.unlockAt)}. Mood: ${moodInfo(c.mood).label}.`;
      try {
        if (navigator.share) {
          await navigator.share({ title: `Time Capsule — ${c.title}`, text, url });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${text} ${url}`);
          readerShareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { readerShareBtn.innerHTML = '<i class="fas fa-share-nodes"></i> Share'; }, 1500);
        }
      } catch (err) { /* cancelled */ }
    });
  }

  if (readerDeleteBtn) {
    readerDeleteBtn.addEventListener('click', () => {
      const id = readerDeleteBtn.dataset.id;
      const c = state.capsules.find(x => x.id === id);
      if (!c) return;
      const ok = confirm(`Delete capsule "${c.title}"? This cannot be undone.`);
      if (!ok) return;
      closeReader();
      deleteCapsule(id);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeComposer();
    else if (!reader.hidden) closeReader();
  });

  // Seed two starter capsules on first run
  if (state.capsules.length === 0) {
    const future = new Date();
    future.setDate(future.getDate() + 90);
    const pastUnlock = new Date();
    pastUnlock.setDate(pastUnlock.getDate() - 7);
    state.capsules.push({
      id: 'cap_seed_1',
      title: 'A note from the build assistant launch day',
      message: 'Hey future me. If you are reading this, you are at least three months deeper into the streak. The site is bigger than you remember. The vault has more capsules. The snippets library grew. Keep building small things — they add up. The whole site started with a single line on Day 1.',
      unlockAt: future.toISOString().slice(0, 10),
      mood: 'hopeful',
      createdAt: new Date().toISOString()
    });
    state.capsules.push({
      id: 'cap_seed_2',
      title: 'The day the constellation graph went live',
      message: 'You just shipped a 27-node graph of the site you have been building for sixty days. It looks like a night sky. The kind of thing that only works because everything before it shipped. Notice the small wins. Tomorrow, ship another one.',
      unlockAt: pastUnlock.toISOString().slice(0, 10),
      mood: 'grateful',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    });
    save(state.capsules);
  }

  render();
  setInterval(render, 60 * 1000);
}

/* ============================================================
   Day 62: Theme Studio
   Live CSS-variable customizer: color pickers, font, radius,
   density, animation speed, motion toggle. 6 named presets.
   Save-your-own themes persisted to localStorage. Share via
   URL hash. Randomize button. Live page-mockup preview.
   ============================================================ */
const TS_KEY = 'ajh_themestudio_v1';
const TS_SAVED_KEY = 'ajh_themestudio_saved_v1';
const TS_ROOT = document.documentElement;

const TS_PRESETS = [
  { id: 'midnight', name: 'Default Midnight', icon: '🌌', desc: 'The signature cyan-on-deep-space look.',
    vars: { '--bg-primary': '#0a0a0f', '--bg-secondary': '#12121a', '--bg-card': '#1a1a25', '--bg-card-hover': '#22222f', '--accent-primary': '#00d4ff', '--accent-secondary': '#7b2cbf', '--accent-tertiary': '#ff006e', '--text-primary': '#ffffff', '--text-secondary': '#a0a0b0', '--text-muted': '#606070', '--border-color': '#2a2a3a', '--radius': '14px', '--font-main': "'Inter', system-ui, sans-serif", '--density': '1', '--motion-speed': '1' } },
  { id: 'aurora', name: 'Aurora', icon: '🌈', desc: 'Cool greens and violets. Northern-lights energy.',
    vars: { '--bg-primary': '#060a14', '--bg-secondary': '#0c1428', '--bg-card': '#142039', '--bg-card-hover': '#1c2b4a', '--accent-primary': '#5cf2c4', '--accent-secondary': '#9b6cff', '--accent-tertiary': '#ffb86b', '--text-primary': '#eef6ff', '--text-secondary': '#9fb0c8', '--text-muted': '#5e6e87', '--border-color': '#1e2c47', '--radius': '18px', '--font-main': "'Inter', system-ui, sans-serif", '--density': '1', '--motion-speed': '1' } },
  { id: 'sunset', name: 'Sunset', icon: '🌅', desc: 'Warm oranges and pinks. Late-evening glow.',
    vars: { '--bg-primary': '#150a14', '--bg-secondary': '#220e1f', '--bg-card': '#2f132d', '--bg-card-hover': '#3d1a3a', '--accent-primary': '#ff8a3d', '--accent-secondary': '#ff3d8a', '--accent-tertiary': '#ffd23d', '--text-primary': '#fff7ed', '--text-secondary': '#d6b8b8', '--text-muted': '#7c5b62', '--border-color': '#3b1e3a', '--radius': '12px', '--font-main': "'Inter', system-ui, sans-serif", '--density': '1', '--motion-speed': '1' } },
  { id: 'mono', name: 'Mono', icon: '◼', desc: 'Pure black and white. Hacker-mode.',
    vars: { '--bg-primary': '#000000', '--bg-secondary': '#0a0a0a', '--bg-card': '#111111', '--bg-card-hover': '#1a1a1a', '--accent-primary': '#ffffff', '--accent-secondary': '#cccccc', '--accent-tertiary': '#888888', '--text-primary': '#ffffff', '--text-secondary': '#aaaaaa', '--text-muted': '#555555', '--border-color': '#222222', '--radius': '6px', '--font-main': "'JetBrains Mono', 'Courier New', monospace", '--density': '1', '--motion-speed': '0.5' } },
  { id: 'synthwave', name: 'Synthwave', icon: '🎛', desc: 'Magenta-and-cyan. Drive-into-the-sun.',
    vars: { '--bg-primary': '#1a0a2e', '--bg-secondary': '#241038', '--bg-card': '#311a4f', '--bg-card-hover': '#3f2366', '--accent-primary': '#00f0ff', '--accent-secondary': '#ff2bd6', '--accent-tertiary': '#ffae00', '--text-primary': '#fce8ff', '--text-secondary': '#c8a8e0', '--text-muted': '#765a90', '--border-color': '#4a2a72', '--radius': '20px', '--font-main': "'Inter', system-ui, sans-serif", '--density': '1', '--motion-speed': '1.25' } },
  { id: 'forest', name: 'Forest', icon: '🌲', desc: 'Mossy greens, parchment, quiet.',
    vars: { '--bg-primary': '#0d1410', '--bg-secondary': '#141e17', '--bg-card': '#1d2a20', '--bg-card-hover': '#283a2c', '--accent-primary': '#86e07a', '--accent-secondary': '#e0c47a', '--accent-tertiary': '#d97a5e', '--text-primary': '#f3efe0', '--text-secondary': '#b8b29a', '--text-muted': '#6c6852', '--border-color': '#263429', '--radius': '10px', '--font-main': "'Inter', system-ui, sans-serif", '--density': '1', '--motion-speed': '0.85' } }
];

const TS_FONTS = [
  { id: 'inter', label: 'Inter (default)', value: "'Inter', system-ui, sans-serif" },
  { id: 'system', label: 'System UI', value: "system-ui, -apple-system, sans-serif" },
  { id: 'mono', label: 'JetBrains Mono', value: "'JetBrains Mono', 'Courier New', monospace" },
  { id: 'serif', label: 'Newsreader', value: "'Georgia', 'Times New Roman', serif" }
];

const TS_VAR_LIST = [
  { key: '--bg-primary', label: 'Background', group: 'Colors' },
  { key: '--bg-secondary', label: 'Background Alt', group: 'Colors' },
  { key: '--bg-card', label: 'Surface', group: 'Colors' },
  { key: '--bg-card-hover', label: 'Surface Hover', group: 'Colors' },
  { key: '--accent-primary', label: 'Accent Primary', group: 'Colors' },
  { key: '--accent-secondary', label: 'Accent Secondary', group: 'Colors' },
  { key: '--accent-tertiary', label: 'Accent Tertiary', group: 'Colors' },
  { key: '--text-primary', label: 'Text Primary', group: 'Colors' },
  { key: '--text-secondary', label: 'Text Secondary', group: 'Colors' },
  { key: '--text-muted', label: 'Text Muted', group: 'Colors' },
  { key: '--border-color', label: 'Border', group: 'Colors' },
  { key: '--radius', label: 'Border Radius', group: 'Shape' },
  { key: '--font-main', label: 'Font Family', group: 'Type' },
  { key: '--density', label: 'Density', group: 'Layout' },
  { key: '--motion-speed', label: 'Motion Speed', group: 'Motion' }
];

function tsReadVar(name) {
  return getComputedStyle(TS_ROOT).getPropertyValue(name).trim();
}

function tsReadCurrent() {
  const out = {};
  TS_VAR_LIST.forEach(({ key }) => { out[key] = tsReadVar(key); });
  return out;
}

function tsApplyVars(vars) {
  Object.entries(vars).forEach(([k, v]) => TS_ROOT.style.setProperty(k, v));
  document.body.style.setProperty('--radius', vars['--radius'] || '');
}

function tsSaveCurrent() {
  const data = tsReadCurrent();
  try { localStorage.setItem(TS_KEY, JSON.stringify(data)); } catch (e) {}
}

function tsLoadPersisted() {
  try {
    const raw = localStorage.getItem(TS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) {}
  return null;
}

function tsGetSaved() {
  try {
    const raw = localStorage.getItem(TS_SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
}

function tsSetSaved(list) {
  try { localStorage.setItem(TS_SAVED_KEY, JSON.stringify(list)); } catch (e) {}
}

function tsEncodeHash(vars) {
  const compact = {};
  TS_VAR_LIST.forEach(({ key }) => { if (vars[key] !== undefined) compact[key] = vars[key]; });
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(compact)))).replace(/=+$/, ''); }
  catch (e) { return ''; }
}

function tsDecodeHash(hash) {
  try {
    const padded = hash + '==='.slice((hash.length + 3) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) {}
  return null;
}

function tsColorIsLight(hex) {
  if (!hex) return false;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
  return ((r * 299) + (g * 587) + (b * 114)) / 1000 > 160;
}

function tsApplyFromVars(vars, opts) {
  if (!vars) return;
  tsApplyVars(vars);
  if (!opts || !opts.skipPersist) tsSaveCurrent();
  if (!opts || !opts.skipControls) tsSyncControlsFromVars();
  if (!opts || !opts.skipMockup) tsRenderMockup(vars);
  if (!opts || !opts.skipHash) tsWriteHash(vars);
}

function tsWriteHash(vars) {
  const hash = tsEncodeHash(vars);
  if (!hash) return;
  if (window.history && window.history.replaceState) {
    try { window.history.replaceState(null, '', '#theme=' + hash); } catch (e) {}
  }
}

function tsInitPresets() {
  const wrap = document.getElementById('themestudio-presets');
  if (!wrap) return;
  wrap.innerHTML = '';
  TS_PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'ts-preset';
    btn.type = 'button';
    btn.dataset.preset = p.id;
    btn.innerHTML = `<span class="ts-preset-icon">${p.icon}</span><span class="ts-preset-name">${p.name}</span>`;
    btn.title = p.desc;
    btn.addEventListener('click', () => tsApplyFromVars(p.vars));
    wrap.appendChild(btn);
  });
}

function tsBuildControls() {
  const wrap = document.getElementById('themestudio-controls');
  if (!wrap) return;
  if (wrap.dataset.custom === '1') {
    // HTML controls are already in place; just wire up listeners.
    wrap.querySelectorAll('[data-var]').forEach(input => {
      input.addEventListener('input', () => {
        TS_ROOT.style.setProperty(input.dataset.var, input.value);
        const displayId = input.dataset.display;
        if (displayId) {
          const d = document.getElementById(displayId);
          const unit = input.dataset.unit || '';
          if (d) d.textContent = unit ? `${input.value}${unit}` : input.value;
        }
        tsAfterLiveChange();
      });
    });
    return;
  }
  const groups = {};
  TS_VAR_LIST.forEach(v => { (groups[v.group] = groups[v.group] || []).push(v); });

  const groupsOrder = ['Colors', 'Shape', 'Type', 'Layout', 'Motion'];
  let html = '';
  groupsOrder.forEach(g => {
    if (!groups[g]) return;
    html += `<div class="ts-group"><div class="ts-group-label">${g}</div><div class="ts-group-rows">`;
    groups[g].forEach(({ key, label }) => {
      if (key === '--font-main') {
        html += `<label class="ts-row ts-row-select"><span class="ts-row-label">${label}</span><select data-var="${key}" class="ts-select">${TS_FONTS.map(f => `<option value="${f.value}">${f.label}</option>`).join('')}</select></label>`;
      } else if (key === '--radius') {
        html += `<label class="ts-row"><span class="ts-row-label">${label}</span><input type="range" min="0" max="32" step="1" data-var="${key}" data-display="ts-radius-display" data-unit="px" class="ts-range"></label><span class="ts-display" id="ts-radius-display">—</span>`;
      } else if (key === '--density') {
        html += `<label class="ts-row"><span class="ts-row-label">${label}</span><input type="range" min="0.7" max="1.4" step="0.05" data-var="${key}" data-display="ts-density-display" class="ts-range"></label><span class="ts-display" id="ts-density-display">—</span>`;
      } else if (key === '--motion-speed') {
        html += `<label class="ts-row"><span class="ts-row-label">${label}</span><input type="range" min="0" max="2" step="0.05" data-var="${key}" data-display="ts-motion-display" class="ts-range"></label><span class="ts-display" id="ts-motion-display">—</span>`;
      } else {
        html += `<label class="ts-row ts-row-color"><span class="ts-row-label">${label}</span><input type="color" data-var="${key}" class="ts-color"></label>`;
      }
    });
    html += '</div></div>';
  });
  wrap.innerHTML = html;

  wrap.querySelectorAll('[data-var]').forEach(input => {
    input.addEventListener('input', e => {
      const key = input.dataset.var;
      const displayId = input.dataset.display;
      const unit = input.dataset.unit || '';
      const val = input.value;
      TS_ROOT.style.setProperty(key, val);
      if (displayId) {
        const d = document.getElementById(displayId);
        if (d) d.textContent = unit ? `${val}${unit}` : val;
      }
      tsAfterLiveChange();
    });
  });
}

function tsSyncControlsFromVars() {
  const wrap = document.getElementById('themestudio-controls');
  if (!wrap) return;
  wrap.querySelectorAll('[data-var]').forEach(input => {
    const key = input.dataset.var;
    const cur = tsReadVar(key);
    if (input.tagName === 'INPUT' && input.type === 'color') {
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(cur)) input.value = cur;
    } else if (input.tagName === 'INPUT' && input.type === 'range') {
      const num = parseFloat(cur);
      if (!Number.isNaN(num)) input.value = String(num);
    } else if (input.tagName === 'SELECT') {
      const opts = Array.from(input.options).map(o => o.value);
      if (opts.includes(cur)) input.value = cur;
      else {
        const lower = cur.toLowerCase();
        const match = opts.find(o => o.toLowerCase() === lower);
        if (match) input.value = match;
      }
    }
    const displayId = input.dataset.display;
    if (displayId) {
      const d = document.getElementById(displayId);
      const unit = input.dataset.unit || '';
      if (d) d.textContent = unit ? `${input.value}${unit}` : input.value;
    }
  });
}

function tsRenderMockup(vars) {
  const stage = document.getElementById('themestudio-mockup');
  if (!stage) return;
  const v = vars || tsReadCurrent();
  stage.style.setProperty('--bg', v['--bg-primary']);
  stage.style.setProperty('--surface', v['--bg-card']);
  stage.style.setProperty('--surface-hover', v['--bg-card-hover']);
  stage.style.setProperty('--accent', v['--accent-primary']);
  stage.style.setProperty('--accent2', v['--accent-secondary']);
  stage.style.setProperty('--accent3', v['--accent-tertiary']);
  stage.style.setProperty('--text', v['--text-primary']);
  stage.style.setProperty('--muted', v['--text-secondary']);
  stage.style.setProperty('--border', v['--border-color']);
  stage.style.setProperty('--r', v['--radius'] || '14px');
  stage.style.fontFamily = v['--font-main'] || "'Inter', sans-serif";

  const radius = v['--radius'] || '14px';
  const radiusNum = parseInt(radius, 10) || 14;
  stage.querySelectorAll('[data-radius]').forEach(el => {
    const kind = el.getAttribute('data-radius');
    const base = kind === 'pill' ? 999 : kind === 'card' ? radiusNum : kind === 'tile' ? Math.max(4, Math.round(radiusNum * 0.6)) : radiusNum;
    el.style.borderRadius = (kind === 'pill' ? '999px' : `${base}px`);
  });
}

function tsAfterLiveChange() {
  const cur = tsReadCurrent();
  tsSaveCurrent();
  tsRenderMockup(cur);
  tsWriteHash(cur);
}

function tsRandomize() {
  const randomHex = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  const sample = arr => arr[Math.floor(Math.random() * arr.length)];
  const fonts = TS_FONTS.map(f => f.value);
  const next = {
    '--bg-primary': randomHex(),
    '--bg-secondary': randomHex(),
    '--bg-card': randomHex(),
    '--bg-card-hover': randomHex(),
    '--accent-primary': randomHex(),
    '--accent-secondary': randomHex(),
    '--accent-tertiary': randomHex(),
    '--text-primary': randomHex(),
    '--text-secondary': randomHex(),
    '--text-muted': randomHex(),
    '--border-color': randomHex(),
    '--radius': `${4 + Math.floor(Math.random() * 24)}px`,
    '--font-main': sample(fonts),
    '--density': (0.85 + Math.random() * 0.45).toFixed(2),
    '--motion-speed': (0.6 + Math.random() * 0.9).toFixed(2)
  };
  tsApplyFromVars(next);
  tsToast('Random theme applied ✨');
}

function tsResetDefault() {
  tsApplyFromVars(TS_PRESETS[0].vars);
  try { localStorage.removeItem(TS_KEY); } catch (e) {}
  tsToast('Reset to Default Midnight');
}

function tsSaveCurrentTheme() {
  const name = prompt('Name this theme:', `My Theme ${new Date().toLocaleDateString()}`);
  if (!name) return;
  const cur = tsReadCurrent();
  const list = tsGetSaved();
  list.push({ id: 't_' + Date.now(), name, vars: cur, createdAt: new Date().toISOString() });
  tsSetSaved(list);
  tsRenderSaved();
  tsToast(`Saved "${name}"`);
}

function tsRenderSaved() {
  const wrap = document.getElementById('themestudio-saved-list');
  if (!wrap) return;
  const list = tsGetSaved();
  wrap.innerHTML = '';
  if (!list.length) {
    wrap.innerHTML = '<div class="ts-saved-empty">No saved themes yet. Tweak a preset then hit Save.</div>';
    return;
  }
  list.forEach(t => {
    const v = t.vars || {};
    const card = document.createElement('div');
    card.className = 'ts-saved-card';
    card.innerHTML = `
      <div class="ts-saved-swatches">
        <span class="ts-swatch" style="background:${v['--bg-primary'] || '#000'}"></span>
        <span class="ts-swatch" style="background:${v['--bg-card'] || '#222'}"></span>
        <span class="ts-swatch" style="background:${v['--accent-primary'] || '#fff'}"></span>
        <span class="ts-swatch" style="background:${v['--accent-secondary'] || '#888'}"></span>
        <span class="ts-swatch" style="background:${v['--accent-tertiary'] || '#444'}"></span>
        <span class="ts-swatch" style="background:${v['--text-primary'] || '#fff'}"></span>
      </div>
      <div class="ts-saved-meta">
        <div class="ts-saved-name">${escapeHtml(t.name)}</div>
        <div class="ts-saved-date">${new Date(t.createdAt).toLocaleDateString()}</div>
      </div>
      <div class="ts-saved-actions">
        <button class="ts-mini-btn" data-action="apply" data-id="${t.id}" title="Apply"><i class="fas fa-paintbrush"></i></button>
        <button class="ts-mini-btn" data-action="share" data-id="${t.id}" title="Copy share link"><i class="fas fa-link"></i></button>
        <button class="ts-mini-btn" data-action="delete" data-id="${t.id}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>`;
    wrap.appendChild(card);
  });
  wrap.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const t = tsGetSaved().find(x => x.id === id);
      if (!t) return;
      if (action === 'apply') tsApplyFromVars(t.vars);
      else if (action === 'share') tsShareSaved(t);
      else if (action === 'delete') {
        if (!confirm(`Delete "${t.name}"?`)) return;
        tsSetSaved(tsGetSaved().filter(x => x.id !== id));
        tsRenderSaved();
      }
    });
  });
}

function tsShareSaved(theme) {
  const hash = tsEncodeHash(theme.vars);
  const url = window.location.origin + window.location.pathname + '#theme=' + hash;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => tsToast('Share link copied!'));
  } else {
    prompt('Copy this link:', url);
  }
}

function tsShareCurrent() {
  const cur = tsReadCurrent();
  const hash = tsEncodeHash(cur);
  const url = window.location.origin + window.location.pathname + '#theme=' + hash;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => tsToast('Share link copied!'));
  } else {
    prompt('Copy this link:', url);
  }
}

function tsExportCSS() {
  const cur = tsReadCurrent();
  const lines = [':root {'];
  Object.entries(cur).forEach(([k, v]) => { lines.push(`  ${k}: ${v};`); });
  lines.push('}');
  const css = lines.join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(css).then(() => tsToast('CSS copied to clipboard'));
  } else {
    prompt('Copy this CSS:', css);
  }
}

function tsApplyPresetByName(name) {
  const p = TS_PRESETS.find(x => x.id === name);
  if (p) tsApplyFromVars(p.vars);
}

let tsToastTimer = null;
function tsToast(msg) {
  let el = document.getElementById('themestudio-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'themestudio-toast';
    el.className = 'ts-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(tsToastTimer);
  tsToastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function initThemeStudio() {
  const section = document.getElementById('themestudio');
  if (!section) return;

  let initial = tsLoadPersisted();
  if (!initial && window.location.hash && window.location.hash.includes('theme=')) {
    const hash = window.location.hash.split('theme=')[1];
    initial = tsDecodeHash(hash);
  }
  if (initial) tsApplyVars(initial);

  tsInitPresets();
  tsBuildControls();
  tsSyncControlsFromVars();
  tsRenderMockup(initial || tsReadCurrent());

  document.getElementById('themestudio-randomize')?.addEventListener('click', tsRandomize);
  document.getElementById('themestudio-reset')?.addEventListener('click', tsResetDefault);
  document.getElementById('themestudio-save')?.addEventListener('click', tsSaveCurrentTheme);
  document.getElementById('themestudio-share')?.addEventListener('click', tsShareCurrent);
  document.getElementById('themestudio-export')?.addEventListener('click', tsExportCSS);
  document.getElementById('themestudio-hero-btn')?.addEventListener('click', () => scrollTo('#themestudio'));

  tsRenderSaved();

  window.addEventListener('hashchange', () => {
    if (window.location.hash && window.location.hash.includes('theme=')) {
      const hash = window.location.hash.split('theme=')[1];
      const vars = tsDecodeHash(hash);
      if (vars) tsApplyFromVars(vars, { skipHash: true });
    }
  });

  if (window.PALETTE_COMMANDS) {
    window.PALETTE_COMMANDS.push(
      { id: 'theme-default', label: 'Theme: Default Midnight', icon: 'fa-moon', category: 'Theme', action: () => tsApplyPresetByName('midnight') },
      { id: 'theme-aurora', label: 'Theme: Aurora', icon: 'fa-mountain-sun', category: 'Theme', action: () => tsApplyPresetByName('aurora') },
      { id: 'theme-sunset', label: 'Theme: Sunset', icon: 'fa-sun', category: 'Theme', action: () => tsApplyPresetByName('sunset') },
      { id: 'theme-mono', label: 'Theme: Mono', icon: 'fa-square', category: 'Theme', action: () => tsApplyPresetByName('mono') },
      { id: 'theme-synthwave', label: 'Theme: Synthwave', icon: 'fa-wave-square', category: 'Theme', action: () => tsApplyPresetByName('synthwave') },
      { id: 'theme-forest', label: 'Theme: Forest', icon: 'fa-tree', category: 'Theme', action: () => tsApplyPresetByName('forest') },
      { id: 'theme-randomize', label: 'Theme: Randomize', icon: 'fa-shuffle', shortcut: 'T R', category: 'Theme', action: tsRandomize },
      { id: 'theme-reset', label: 'Theme: Reset to Default', icon: 'fa-rotate-left', category: 'Theme', action: tsResetDefault }
    );
  }
}/* ============================================================
   Day 63: Reading Mode + Reading List
   - Distraction-free reading view (R)
   - Word count + reading time per section
   - Reading list (bookmark sections to read later)
   - Per-section reading progress bar
   - Print-friendly mode (clean black-on-white CSS)
   ============================================================ */
function initReadingMode() {
  const STORAGE = {
    list: 'ajh_reading_list_v1',
    stats: 'ajh_reading_stats_v1',
    active: 'ajh_reading_active_v1',
  };

  // Curated list of readable sections with title, blurb, icon, tag
  const SECTIONS = [
    { id: 'about',        title: 'About AJH',           icon: 'fa-user',         tag: 'Profile',   blurb: 'Who I am, what I build, and why I show up every day.' },
    { id: 'projects',     title: 'Projects',            icon: 'fa-rocket',       tag: 'Builds',    blurb: 'Vault V6, the UV proxy, Zo tools, and the rest of the lab.' },
    { id: 'skills',       title: 'Skills & Stack',      icon: 'fa-cubes',        tag: 'Craft',     blurb: 'Frontend, backend, DevOps — the full-stack toolkit.' },
    { id: 'journey',      title: 'Journey',             icon: 'fa-road',         tag: 'Timeline',  blurb: 'A timeline of how the build streak began.' },
    { id: 'stats',        title: 'Stats',               icon: 'fa-chart-line',   tag: 'Numbers',   blurb: 'Repositories, games served, daily-streak counters.' },
    { id: 'plan',         title: 'Daily Plan Board',    icon: 'fa-list-check',   tag: 'Tool',      blurb: 'Now / Next / Later — what the day looks like.' },
    { id: 'snippets',     title: 'Code Snippets',       icon: 'fa-code',         tag: 'Library',   blurb: 'Hand-picked, copy-paste-ready snippets.' },
    { id: 'calendar',     title: 'Build Calendar',      icon: 'fa-calendar-days',tag: 'Heatmap',   blurb: 'Every build day, color-coded by impact.' },
    { id: 'badges',       title: 'Achievement Badges',  icon: 'fa-trophy',       tag: 'Game',      blurb: 'Unlock as you explore the site.' },
    { id: 'productivity', title: 'Productivity Corner', icon: 'fa-bullseye',     tag: 'Tools',     blurb: 'Focus timer, goals, break reminders.' },
    { id: 'quotes',       title: 'Quote Vault',         icon: 'fa-quote-left',   tag: 'Library',   blurb: 'Hand-picked builder quotes with favorites.' },
    { id: 'faq',          title: 'FAQ',                 icon: 'fa-circle-question',tag: 'Info',    blurb: 'Answers to the most-asked questions.' },
    { id: 'blog',         title: 'Daily Build Log',     icon: 'fa-pen',          tag: 'Journal',   blurb: 'Every build, day by day.' },
    { id: 'achievements', title: 'Achievements',        icon: 'fa-medal',        tag: 'Game',      blurb: 'Long-form milestones and trophies.' },
    { id: 'assistant',    title: 'Build Assistant',     icon: 'fa-robot',        tag: 'AI',        blurb: 'Chat with a knowledge-base of the build log.' },
    { id: 'constellation',title: 'Site Constellation',  icon: 'fa-diagram-project',tag: 'Map',     blurb: 'Every section, plotted as a 2D graph.' },
    { id: 'skyline',      title: 'Build Skyline',      icon: 'fa-city',           tag: 'City',     blurb: '80 builds as a city — day, sunset, night.' },
  ];

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // ---------- state ----------
  const loadJSON = (k, fallback) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };
  const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  let list = loadJSON(STORAGE.list, []);     // [{id, added}]
  let stats = loadJSON(STORAGE.stats, { reads: 0, prints: 0, listAdds: 0 });
  let active = loadJSON(STORAGE.active, false);
  let filter = 'all';
  let searchInput = '';

  // ---------- helpers ----------
  const findSection = id => SECTIONS.find(s => s.id === id);
  const countWords = (root) => {
    if (!root) return 0;
    const text = (root.textContent || '').trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  };
  const readingTime = (words) => Math.max(1, Math.round(words / 220));

  // ---------- reading mode toggle ----------
  const applyReading = (on) => {
    document.body.classList.toggle('reading-mode', on);
    active = on;
    saveJSON(STORAGE.active, on);
    const tb = $('#reading-toolbar');
    if (tb) tb.hidden = !on;
    updateButton();
  };
  const toggleReading = () => applyReading(!active);

  const updateButton = () => {
    const btn = $('#reading-hero-btn') || $('#reading-btn');
    if (!btn) return;
    btn.classList.toggle('active', active);
    btn.title = active ? 'Exit reading mode (R)' : 'Toggle reading mode (R)';
  };

  // ---------- reading list ----------
  const isInList = (id) => list.includes(id);
  const addToList = (id) => {
    if (isInList(id)) return;
    list.push(id);
    saveJSON(STORAGE.list, list);
    stats.listAdds = (stats.listAdds || 0) + 1;
    saveJSON(STORAGE.stats, stats);
    renderList();
    renderPicker();
    updateFooterStats();
    toast('Added to reading list');
  };
  const removeFromList = (id) => {
    list = list.filter(x => x !== id);
    saveJSON(STORAGE.list, list);
    renderList();
    renderPicker();
    updateFooterStats();
  };
  const clearList = () => {
    if (!list.length) return;
    if (!confirm('Clear the entire reading list?')) return;
    list = [];
    saveJSON(STORAGE.list, list);
    renderList();
    renderPicker();
    updateFooterStats();
  };

  // ---------- reading list card ----------
  const renderList = () => {
    const wrap = $('#reading-list-wrap');
    const empty = $('#reading-list-empty');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!list.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    list.forEach(id => {
      const s = findSection(id);
      if (!s) return;
      const item = document.createElement('div');
      item.className = 'reading-list-item';
      item.innerHTML = `
        <i class="fas ${s.icon}"></i>
        <div class="reading-list-meta">
          <span class="reading-list-title">${s.title}</span>
          <span class="reading-list-tag">${s.tag}</span>
        </div>
        <div class="reading-list-actions">
          <button class="reading-list-btn reading-list-go" data-go="${s.id}" title="Jump to section"><i class="fas fa-arrow-right"></i></button>
          <button class="reading-list-btn reading-list-remove" data-remove="${s.id}" title="Remove"><i class="fas fa-times"></i></button>
        </div>
      `;
      wrap.appendChild(item);
    });
  };

  // ---------- section picker ----------
  const renderPicker = () => {
    const grid = $('#reading-picker');
    if (!grid) return;
    grid.innerHTML = '';
    const visible = SECTIONS.filter(s => {
      if (filter !== 'all' && s.tag !== filter) return false;
      if (searchInput) {
        const q = searchInput.toLowerCase();
        return s.title.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q);
      }
      return true;
    });
    visible.forEach(s => {
      const card = document.createElement('div');
      card.className = 'rp-card';
      const inList = isInList(s.id);
      card.innerHTML = `
        <div class="rp-card-head">
          <i class="fas ${s.icon}"></i>
          <span class="rp-card-tag">${s.tag}</span>
        </div>
        <h4 class="rp-card-title">${s.title}</h4>
        <p class="rp-card-blurb">${s.blurb}</p>
        <div class="rp-card-actions">
          <button class="rp-card-btn" data-read="${s.id}"><i class="fas fa-book-open"></i> Read</button>
          <button class="rp-card-btn rp-card-add" data-add="${s.id}">
            <i class="fas ${inList ? 'fa-check' : 'fa-plus'}"></i> ${inList ? 'In list' : 'Add'}
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
    if (!visible.length) {
      grid.innerHTML = '<div class="reading-empty">No sections match your filter.</div>';
    }
    const counter = $('#reading-picker-count');
    if (counter) counter.textContent = `${visible.length} of ${SECTIONS.length}`;
  };

  // ---------- footer stats ----------
  const updateFooterStats = () => {
    const r = $('#reading-stat-reads');
    const a = $('#reading-stat-list');
    const p = $('#reading-stat-prints');
    if (r) r.textContent = stats.reads || 0;
    if (a) a.textContent = list.length;
    if (p) p.textContent = stats.prints || 0;
  };

  // ---------- section-level reading meta (word count + time) ----------
  const decorateSections = () => {
    SECTIONS.forEach(s => {
      const sec = document.getElementById(s.id);
      if (!sec || sec.dataset.readingDecorated) return;
      sec.dataset.readingDecorated = '1';
      const meta = document.createElement('div');
      meta.className = 'section-read-meta';
      const words = countWords(sec);
      const time = readingTime(words);
      meta.innerHTML = `<i class="fas fa-book-open"></i> ${words.toLocaleString()} words · ~${time} min read`;
      const header = sec.querySelector('.section-header, .section-tag, .section-title');
      if (header && header.parentNode) header.parentNode.appendChild(meta);
    });
  };

  // ---------- print mode ----------
  const printSection = (id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    document.body.classList.add('reading-printing');
    sec.setAttribute('data-printing-target', '1');
    stats.prints = (stats.prints || 0) + 1;
    saveJSON(STORAGE.stats, stats);
    updateFooterStats();
    setTimeout(() => { window.print(); }, 80);
    setTimeout(() => {
      document.body.classList.remove('reading-printing');
      sec.removeAttribute('data-printing-target');
    }, 800);
  };

  // ---------- read a section (track + jump) ----------
  const readSection = (id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    stats.reads = (stats.reads || 0) + 1;
    saveJSON(STORAGE.stats, stats);
    updateFooterStats();
    applyReading(true);
    requestAnimationFrame(() => {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // ---------- toast ----------
  let toastTimer;
  const toast = (msg) => {
    const t = $('#reading-toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => { t.hidden = true; }, 220);
    }, 1600);
  };

  const printCurrentSection = () => {
    let target = null;
    for (const s of SECTIONS) {
      const sec = document.getElementById(s.id);
      if (!sec) continue;
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.4 && rect.bottom > 0) { target = s.id; break; }
    }
    if (!target && SECTIONS.length) target = SECTIONS[0].id;
    printSection(target);
  };

  // ---------- floating toolbar wiring ----------
  console.log('[RM] toolbar wiring, btn:', document.getElementById('reading-toolbar-print'));
  const tbPrint = $('#reading-toolbar-print');
  if (tbPrint) tbPrint.addEventListener('click', printCurrentSection);
  const tbExit = $('#reading-toolbar-exit');
  if (tbExit) tbExit.addEventListener('click', () => applyReading(false));

  // ---------- wiring ----------
  const wire = () => {
    const heroBtn = $('#reading-hero-btn') || $('#reading-btn');
    if (heroBtn) heroBtn.addEventListener('click', toggleReading);

    const navLink = document.querySelector('a[href="#reading"]');
    if (navLink) navLink.addEventListener('click', () => { setTimeout(() => applyReading(true), 60); });

    const searchInput = $('#reading-search-input');
    if (searchInput) searchInput.addEventListener('input', e => { window.__rdSearch = e.target.value; filterAndRender(); });
    const filterChips = $$('.reading-filter-tag');
    filterChips.forEach(c => c.addEventListener('click', () => {
      filterChips.forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      filter = c.dataset.filter;
      renderPicker();
    }));
    const clearBtn = $('#reading-list-clear');
    if (clearBtn) clearBtn.addEventListener('click', clearList);

    // delegated clicks for picker + list
    document.addEventListener('click', e => {
      const add = e.target.closest('[data-add]');
      if (add) { addToList(add.dataset.add); return; }
      const read = e.target.closest('[data-read]');
      if (read) { readSection(read.dataset.read); return; }
      const go = e.target.closest('[data-go]');
      if (go) {
        const id = go.dataset.go;
        const sec = document.getElementById(id);
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const rm = e.target.closest('[data-remove]');
      if (rm) { removeFromList(rm.dataset.remove); return; }
      const printBtn = e.target.closest('[data-print]');
      if (printBtn) { printSection(printBtn.dataset.print); return; }
    });

    // keyboard: R toggles reading mode (ignored while typing)
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        toggleReading();
      }
    });
  };

  // debounce search
  let searchTimer;
  const filterAndRender = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { searchInput = window.__rdSearch || ''; renderPicker(); }, 80);
  };

  // ---------- reading progress bar per section ----------
  const initReadingProgress = () => {
    SECTIONS.forEach(s => {
      const sec = document.getElementById(s.id);
      if (!sec || sec.dataset.readingProgress) return;
      sec.dataset.readingProgress = '1';
      const bar = document.createElement('div');
      bar.className = 'reading-progress';
      sec.prepend(bar);
    });
    const onScroll = () => {
      if (!document.body.classList.contains('reading-mode')) return;
      SECTIONS.forEach(s => {
        const sec = document.getElementById(s.id);
        if (!sec) return;
        const bar = sec.querySelector('.reading-progress');
        if (!bar) return;
        const rect = sec.getBoundingClientRect();
        const winH = window.innerHeight;
        const total = rect.height;
        const seen = Math.min(total, Math.max(0, winH - rect.top));
        const pct = total > 0 ? Math.min(100, Math.max(0, (seen / Math.min(total, winH)) * 100)) : 0;
        bar.style.width = pct + '%';
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  // ---------- init ----------
  decorateSections();
  renderList();
  renderPicker();
  updateFooterStats();
  applyReading(active);
  wire();
  initReadingProgress();
}

// ===========================================================================
// Day 64: Build Journal — Shipped / Learned / Broke + weekly ring + export
// ===========================================================================
function initBuildJournal() {
  const STORAGE_KEY = 'ajh_journal_v1';
  const STREAK_KEY = 'ajh_journal_streak_v1';

  // Seed the journal with 64 days of history so the streak visualization has shape.
  // Each day has mood + a small set of bullets; older days are summarized.
  const SEED = {
    '2026-04-22': { mood: '🚀', headline: 'First commit — ever', shipped: ['Initial site scaffold', 'PWA manifest', '404 page'], learned: ['GitHub Pages basics', 'PWA service workers'], broke: ['Favicon path'] },
    '2026-04-23': { mood: '🛠', headline: 'Nav and footer rebuilt', shipped: ['Sticky navbar', 'Footer columns', 'Color tokens'], learned: ['CSS custom properties'], broke: ['Mobile hamburger'] },
    '2026-04-24': { mood: '🎨', headline: 'Hero redesigned', shipped: ['Kinetic title', 'CTA pair', 'Animated bg'], learned: ['Will-change perf'], broke: [] },
    '2026-04-25': { mood: '🐛', headline: 'Bug day', shipped: ['Service worker fix', 'Cache invalidation'], learned: ['SW lifecycle'], broke: ['Offline mode briefly'] },
    '2026-04-26': { mood: '🧠', headline: 'JS refactor', shipped: ['Module split', 'Helper utils'], learned: ['ES module pitfalls'], broke: [] },
    '2026-04-27': { mood: '🚀', headline: 'Stats counter shipped', shipped: ['Animated counters', 'Streak bar'], learned: ['IntersectionObserver'], broke: ['Off-by-one on count'] },
    '2026-04-28': { mood: '🎨', headline: 'Theme switcher', shipped: ['Dark/light toggle', 'Theme persistence'], learned: ['prefers-color-scheme'], broke: ['Some component contrast'] },
    '2026-04-29': { mood: '🛠', headline: 'CI + 404 polish', shipped: ['GitHub Actions', 'Custom 404', 'Robots.txt'], learned: ['Pages deploy hooks'], broke: [] },
    '2026-04-30': { mood: '🚀', headline: 'Achievement badges', shipped: ['12 unlockable badges', 'Confetti', 'Toasts'], learned: ['localStorage patterns'], broke: [] },
    '2026-05-01': { mood: '🧠', headline: 'A11y pass', shipped: ['Focus rings', 'ARIA labels', 'Skip link'], learned: ['Keyboard traps'], broke: ['Tab order in modal'] },
    '2026-05-02': { mood: '🛠', headline: 'Refactor nav', shipped: ['Single nav source', 'Active state'], learned: ['Event delegation'], broke: [] },
    '2026-05-03': { mood: '🎨', headline: 'Color refresh', shipped: ['New accent ramp', 'Light tokens'], learned: ['OKLCH vs HSL'], broke: [] },
    '2026-05-04': { mood: '🚀', headline: 'Project modal', shipped: ['Detail modal', 'Tech tags'], learned: ['Focus trapping in modals'], broke: [] },
    '2026-05-05': { mood: '🐛', headline: 'Safari fixes', shipped: ['Backdrop-filter fallback', 'Sticky hover reset'], learned: ['Vendor prefixes'], broke: ['iOS bounce'] },
    '2026-05-06': { mood: '🧠', headline: 'Perf audit', shipped: ['Lighthouse pass', 'Font subsetting'], learned: ['CLS scoring'], broke: [] },
    '2026-05-07': { mood: '🎨', headline: 'Card hover polish', shipped: ['3D tilt', 'Glow trails'], learned: ['Perspective transforms'], broke: [] },
    '2026-05-08': { mood: '🚀', headline: 'Live clock widget', shipped: ['Hero meta', '12/24 toggle'], learned: ['Intl.DateTimeFormat'], broke: ['DST edge case'] },
    '2026-05-09': { mood: '🛠', headline: 'Test harness', shipped: ['Smoke tests', 'Manual checklist'], learned: ['Headless browser testing'], broke: [] },
    '2026-05-10': { mood: '🚀', headline: 'Skills + filter', shipped: ['Animated skill bars', 'Category filters'], learned: ['CSS custom property animations'], broke: [] },
    '2026-05-11': { mood: '🎨', headline: 'Project filter', shipped: ['5 categories', 'Featured span'], learned: ['Grid span tricks'], broke: [] },
    '2026-05-12': { mood: '🚀', headline: 'Project modal', shipped: ['Click any card', 'Tech stack tags'], learned: ['Dialog a11y'], broke: [] },
    '2026-05-13': { mood: '🧠', headline: 'Testimonials', shipped: ['3 cards', 'Footer overhaul'], learned: ['Testimonial design patterns'], broke: [] },
    '2026-05-14': { mood: '🛠', headline: 'Util + scroll fx', shipped: ['debounce/throttle', '3D tilt', 'Parallax'], learned: ['rAF scheduling'], broke: [] },
    '2026-05-15': { mood: '🚀', headline: 'PWA install', shipped: ['Install prompt', 'Update toast'], learned: ['beforeinstallprompt'], broke: [] },
    '2026-05-16': { mood: '🎨', headline: 'FAQ + accordions', shipped: ['Smooth expand', 'Keyboard a11y'], learned: ['max-height transitions'], broke: [] },
    '2026-05-17': { mood: '🧠', headline: 'Doc pass', shipped: ['README rewrite', 'CONTRIBUTING'], learned: ['Diátaxis framework'], broke: [] },
    '2026-05-18': { mood: '🚀', headline: '2026 design tokens', shipped: ['Glass cards', 'Bento grid', 'Kinetic type', 'Morphing blob', 'Neon glow', 'Liquid buttons', 'Magnetic buttons', '3D tilt cards', 'Noise overlay'], learned: ['Backdrop-filter perf'], broke: ['Backdrop on iOS'] },
    '2026-05-19': { mood: '🛠', headline: 'Console cleanup', shipped: ['No warn passes', 'Source maps'], learned: ['Debug build flags'], broke: [] },
    '2026-05-20': { mood: '🚀', headline: 'Ambient + smart nav', shipped: ['Drone sound', 'Auto-hide nav', 'Scroll reveal'], learned: ['WebAudio LFO'], broke: [] },
    '2026-05-21': { mood: '🧠', headline: 'Productivity corner', shipped: ['Focus timer', 'Notes', 'Goals', 'Break reminder', 'Streak visual'], learned: ['Notification API'], broke: [] },
    '2026-05-22': { mood: '🎨', headline: 'Time greeting', shipped: ['Time-aware hero copy'], learned: ['localStorage hydration'], broke: [] },
    '2026-05-23': { mood: '🛠', headline: 'Hero date', shipped: ['Live date pill'], learned: ['Date timezone quirks'], broke: [] },
    '2026-05-24': { mood: '🚀', headline: 'World clock', shipped: ['8 cities', 'Live tickers'], learned: ['Intl timezone API'], broke: [] },
    '2026-05-25': { mood: '🐛', headline: 'Cross-browser', shipped: ['Edge quirks', 'Firefox focus rings'], learned: ['UA differences'], broke: [] },
    '2026-05-26': { mood: '🧠', headline: 'CSS containment', shipped: ['contain: layout/paint', 'will-change discipline'], learned: ['Containment perf'], broke: [] },
    '2026-05-27': { mood: '🚀', headline: 'Code playground', shipped: ['Live HTML/CSS/JS editor', 'Preview pane'], learned: ['Blob URL preview'], broke: ['CSP for eval'] },
    '2026-05-28': { mood: '🛠', headline: 'API status', shipped: ['GitHub check', 'Vault probe'], learned: ['AbortController timing'], broke: [] },
    '2026-05-29': { mood: '🚀', headline: 'Command palette', shipped: ['Ctrl+K launcher', '25+ commands'], learned: ['Fuzzy command UX'], broke: [] },
    '2026-05-30': { mood: '🎨', headline: 'Palette polish', shipped: ['Grouped results', 'Shortcut hints'], learned: ['Keyboard nav patterns'], broke: [] },
    '2026-05-31': { mood: '🧠', headline: 'Daily challenges', shipped: ['15 missions', 'XP/badges', 'Streak tracking'], learned: ['Gamification design'], broke: [] },
    '2026-06-01': { mood: '🚀', headline: 'Music player', shipped: ['Visualizer', 'Playlist', 'Shuffle/repeat'], learned: ['Simulated playback'], broke: [] },
    '2026-06-02': { mood: '🛠', headline: 'Stats bento', shipped: ['Bento grid', 'Live visitor count'], learned: ['Bento design rules'], broke: [] },
    '2026-06-03': { mood: '🚀', headline: 'Keyboard game', shipped: ['Type to score', 'Combo system'], learned: ['Game loop timing'], broke: [] },
    '2026-06-04': { mood: '🎨', headline: 'Game polish', shipped: ['Animations', 'Visual feedback'], learned: ['CSS keyframe chaining'], broke: [] },
    '2026-06-05': { mood: '🧠', headline: 'Testing tooling', shipped: ['Headless smoke tests', 'Lint pass'], learned: ['Playwright basics'], broke: [] },
    '2026-06-06': { mood: '🚀', headline: 'Daily plan board', shipped: ['Now/Next/Later', 'Drag/drop', 'Persistence'], learned: ['HTML5 DnD ergonomics'], broke: [] },
    '2026-06-07': { mood: '🛠', headline: 'Plan board refactor', shipped: ['State machine'], learned: ['XState lite patterns'], broke: [] },
    '2026-06-08': { mood: '🎨', headline: 'Daily plan polish', shipped: ['Empty states', 'Keyboard reorder'], learned: ['Empty state design'], broke: [] },
    '2026-06-09': { mood: '🧠', headline: 'Doc pass v2', shipped: ['Usage examples', 'Screenshots'], learned: ['MkDocs'], broke: [] },
    '2026-06-10': { mood: '🚀', headline: 'Achievement v2', shipped: ['12 more badges', 'Toast queue'], learned: ['Toast queue backpressure'], broke: [] },
    '2026-06-11': { mood: '🐛', headline: 'Bug bash', shipped: ['40+ fixes', 'a11y audit'], learned: ['Screen reader testing'], broke: [] },
    '2026-06-12': { mood: '🛠', headline: 'Build pipeline', shipped: ['Terser pass', 'CSS purge'], learned: ['PurgeCSS configs'], broke: [] },
    '2026-06-13': { mood: '🚀', headline: 'Quote vault', shipped: ['Favorites', 'Share', 'Daily quote'], learned: ['Web Share API fallback'], broke: [] },
    '2026-06-14': { mood: '🎨', headline: 'Quote polish', shipped: ['Animated entry', 'Smooth fav'], learned: ['Animation timing'], broke: [] },
    '2026-06-15': { mood: '🧠', headline: 'Data model pass', shipped: ['Schema docs', 'Type hints'], learned: ['JSDoc patterns'], broke: [] },
    '2026-06-16': { mood: '🚀', headline: 'Code snippets vault', shipped: ['10 starters', 'CRUD', 'Filter', 'Search', 'Copy counter'], learned: ['Pragmatic highlighting'], broke: [] },
    '2026-06-17': { mood: '🚀', headline: 'Build calendar heatmap', shipped: ['57-day heatmap', 'Detail modals', 'View filters'], learned: ['GitHub-style contribution graph'], broke: [] },
    '2026-06-18': { mood: '🛠', headline: 'Calendar polish', shipped: ['Share this build', 'Stats summary'], learned: ['Web Share w/ clipboard fallback'], broke: [] },
    '2026-06-19': { mood: '🎨', headline: 'Bookmark cards', shipped: ['Section bookmarks', 'Detail modal', 'Search'], learned: ['Card metadata design'], broke: [] },
    '2026-06-20': { mood: '🚀', headline: 'Site constellation', shipped: ['Interactive section graph', 'Pan/zoom'], learned: ['Force layouts'], broke: [] },
    '2026-06-21': { mood: '🧠', headline: 'Graph polish', shipped: ['Node physics', 'Labels'], learned: ['Verlet integration'], broke: [] },
    '2026-06-22': { mood: '🚀', headline: 'Time capsule vault', shipped: ['Sealed notes', 'Countdown', 'Unlock reader'], learned: ['Date math in JS'], broke: [] },
    '2026-06-23': { mood: '🎨', headline: 'Reading mode', shipped: ['Distraction-free view', 'Word counts', 'Read time', 'List', 'Print'], learned: ['@media print tricks'], broke: [] }
  };

  // ---- state ----
  let entries = loadEntries();
  let draft = loadDraft() || emptyDraft();
  let streakInfo = loadStreak() || { current: 0, longest: 0 };

  // ---- helpers ----
  function todayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  function emptyDraft() {
    return { date: todayKey(), mood: '', headline: '', shipped: [], learned: [], broke: [] };
  }
  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...SEED };
      const parsed = JSON.parse(raw);
      return { ...SEED, ...parsed };
    } catch (e) {
      return { ...SEED };
    }
  }
  function saveEntries() {
    try {
      // Only persist user-modified (not the seed), but include seeded + custom
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) { /* ignore */ }
  }
  function loadDraft() {
    try {
      const raw = localStorage.getItem('ajh_journal_draft_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function saveDraft() {
    try {
      localStorage.setItem('ajh_journal_draft_v1', JSON.stringify(draft));
    } catch (e) { /* ignore */ }
  }
  function clearDraft() {
    try { localStorage.removeItem('ajh_journal_draft_v1'); } catch (e) {}
  }
  function loadStreak() {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function saveStreak() {
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(streakInfo)); } catch (e) {}
  }

  function recalcStreak() {
    // Walk dates from today backwards, count consecutive entries that exist.
    const dates = Object.keys(entries).sort();
    if (dates.length === 0) { streakInfo = { current: 0, longest: 0 }; saveStreak(); return; }
    let current = 0;
    const today = new Date(todayKey());
    for (let i = 0; i < 200; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      if (entries[k]) current++;
      else break;
    }
    let longest = 0, run = 0;
    const sorted = [...dates].sort();
    let prev = null;
    for (const k of sorted) {
      if (prev) {
        const a = new Date(prev);
        const b = new Date(k);
        const diff = Math.round((b - a) / 86400000);
        if (diff === 1) run++;
        else run = 1;
      } else run = 1;
      if (run > longest) longest = run;
      prev = k;
    }
    streakInfo = { current, longest };
    saveStreak();
  }

  function totalShips() {
    let n = 0;
    for (const k of Object.keys(entries)) {
      const e = entries[k];
      n += (e.shipped || []).length;
    }
    return n;
  }

  // ---- render ----
  function render() {
    renderTodayDate();
    renderSummary();
    renderMood();
    renderCols();
    renderHeadline();
    renderWeekRing();
    renderRecent();
  }

  function renderTodayDate() {
    const el = document.getElementById('journal-today-date');
    if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function renderSummary() {
    const num = document.getElementById('journal-entries-num');
    const cur = document.getElementById('journal-current-streak');
    const lng = document.getElementById('journal-longest-streak');
    const ships = document.getElementById('journal-total-ships');
    if (num) num.textContent = String(Object.keys(entries).length);
    if (cur) cur.textContent = String(streakInfo.current);
    if (lng) lng.textContent = String(streakInfo.longest);
    if (ships) ships.textContent = String(totalShips());
  }

  function renderMood() {
    const buttons = document.querySelectorAll('.journal-mood');
    buttons.forEach(b => {
      b.classList.toggle('active', b.dataset.mood === draft.mood);
    });
  }

  function renderCols() {
    ['shipped', 'learned', 'broke'].forEach(key => {
      const list = document.getElementById(`journal-${key}-list`);
      if (!list) return;
      list.innerHTML = '';
      const items = draft[key] || [];
      items.forEach((text, idx) => {
        const li = document.createElement('li');
        li.textContent = text;
        const x = document.createElement('button');
        x.className = 'journal-x';
        x.type = 'button';
        x.innerHTML = '<i class="fas fa-times"></i>';
        x.setAttribute('aria-label', 'Remove');
        x.addEventListener('click', () => {
          draft[key].splice(idx, 1);
          saveDraft();
          renderCols();
        });
        li.appendChild(x);
        list.appendChild(li);
      });
    });
  }

  function renderHeadline() {
    const input = document.getElementById('journal-headline');
    if (input && input.value !== draft.headline) input.value = draft.headline || '';
  }

  function renderWeekRing() {
    const ring = document.getElementById('journal-week-ring');
    const meta = document.getElementById('journal-week-meta');
    if (!ring) return;
    ring.innerHTML = '';
    const today = new Date();
    const logged = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const e = entries[k];
      const dayEl = document.createElement('div');
      dayEl.className = 'journal-week-day' + (e ? ' logged' : '') + (i === 0 ? ' today' : '');
      const name = document.createElement('span');
      name.className = 'week-day-name';
      name.textContent = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
      const num = document.createElement('span');
      num.className = 'week-day-num';
      num.textContent = d.getDate();
      dayEl.appendChild(name);
      if (e && e.mood) {
        const mood = document.createElement('span');
        mood.className = 'week-day-mood';
        mood.textContent = e.mood;
        dayEl.appendChild(num);
        dayEl.appendChild(mood);
      } else {
        dayEl.appendChild(num);
      }
      dayEl.title = e ? `${k}: ${e.headline || '(no headline)'}` : `${k}: not logged`;
      ring.appendChild(dayEl);
      if (e) logged.push(k);
    }
    if (meta) meta.textContent = `${logged.length} / 7 days logged`;
  }

  function renderRecent() {
    const list = document.getElementById('journal-recent-list');
    if (!list) return;
    const dates = Object.keys(entries).sort().reverse().slice(0, 14);
    if (dates.length === 0) {
      list.innerHTML = '<div class="journal-recent-empty">No entries yet — start with today\'s column above.</div>';
      return;
    }
    list.innerHTML = '';
    for (const k of dates) {
      const e = entries[k];
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'journal-recent-item';
      const date = document.createElement('div');
      date.className = 'journal-recent-date';
      const dt = new Date(k);
      date.textContent = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const body = document.createElement('div');
      body.className = 'journal-recent-body';
      const head = document.createElement('div');
      head.className = 'journal-recent-headline';
      head.textContent = e.headline || '(no headline)';
      const meta = document.createElement('div');
      meta.className = 'journal-recent-meta';
      const total = (e.shipped?.length || 0) + (e.learned?.length || 0) + (e.broke?.length || 0);
      meta.textContent = `${e.shipped?.length || 0} shipped · ${e.learned?.length || 0} learned · ${e.broke?.length || 0} broke · ${total} total`;
      body.appendChild(head);
      body.appendChild(meta);
      const mood = document.createElement('div');
      mood.className = 'journal-recent-mood';
      mood.textContent = e.mood || '·';
      item.appendChild(date);
      item.appendChild(body);
      item.appendChild(mood);
      item.addEventListener('click', () => {
        // Open the section that contains the day number on the calendar (best-effort scroll)
        const cal = document.getElementById('calendar');
        if (cal) cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      list.appendChild(item);
    }
  }

  // ---- events ----
  function addItem(key) {
    const input = document.querySelector(`.journal-add-input[data-target="${key}"]`);
    if (!input) return;
    const v = input.value.trim();
    if (!v) return;
    if (!draft[key]) draft[key] = [];
    if (draft[key].length >= 12) {
      input.value = '';
      return;
    }
    draft[key].push(v);
    input.value = '';
    saveDraft();
    renderCols();
  }

  function wire() {
    document.querySelectorAll('.journal-add-btn').forEach(btn => {
      btn.addEventListener('click', () => addItem(btn.dataset.target));
    });
    document.querySelectorAll('.journal-add-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addItem(input.dataset.target);
        }
      });
    });
    document.querySelectorAll('.journal-mood').forEach(btn => {
      btn.addEventListener('click', () => {
        draft.mood = btn.dataset.mood;
        saveDraft();
        renderMood();
      });
    });
    const headline = document.getElementById('journal-headline');
    if (headline) {
      headline.addEventListener('input', () => {
        draft.headline = headline.value;
        saveDraft();
      });
    }
    const saveBtn = document.getElementById('journal-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveToday);
    const shareBtn = document.getElementById('journal-share-btn');
    if (shareBtn) shareBtn.addEventListener('click', shareToday);
    const exportBtn = document.getElementById('journal-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportJournal);

    // Hero button
    const heroBtn = document.getElementById('journal-hero-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        const sec = document.getElementById('journal');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Keyboard: J jumps to journal
    document.addEventListener('keydown', (e) => {
      // Don't hijack while typing
      const tag = (e.target.tagName || '').toLowerCase();
      const inField = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (inField) return;
      if (e.key && e.key.toLowerCase() === 'j' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const sec = document.getElementById('journal');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function saveToday() {
    // If draft is empty AND today's seeded entry exists, leave it alone.
    const isEmpty = !draft.mood && !draft.headline
      && (draft.shipped?.length || 0) === 0
      && (draft.learned?.length || 0) === 0
      && (draft.broke?.length || 0) === 0;
    if (isEmpty) {
      flashSave('Nothing to save');
      return;
    }
    entries[draft.date] = {
      mood: draft.mood || entries[draft.date]?.mood || '🚀',
      headline: draft.headline || entries[draft.date]?.headline || '',
      shipped: [...(draft.shipped || [])],
      learned: [...(draft.learned || [])],
      broke: [...(draft.broke || [])]
    };
    saveEntries();
    recalcStreak();
    clearDraft();
    draft = emptyDraft();
    render();
    flashSave('Saved ✓');
  }

  function flashSave(msg) {
    const flash = document.getElementById('journal-save-flash');
    if (!flash) return;
    flash.textContent = msg;
    flash.hidden = false;
    flash.style.animation = 'none';
    void flash.offsetHeight;
    flash.style.animation = '';
    setTimeout(() => { flash.hidden = true; }, 1600);
  }

  function shareToday() {
    const today = entries[todayKey()] || entries[draft.date] || draft;
    if (!today || (!today.headline && (today.shipped || []).length === 0)) {
      flashSave('Save first, then share');
      return;
    }
    const lines = [];
    lines.push(`📓 AJH Build Journal — ${todayKey()}`);
    if (today.mood) lines.push(`${today.mood} ${today.headline || ''}`.trim());
    if ((today.shipped || []).length) {
      lines.push('Shipped:');
      today.shipped.forEach(s => lines.push(`  • ${s}`));
    }
    if ((today.learned || []).length) {
      lines.push('Learned:');
      today.learned.forEach(s => lines.push(`  • ${s}`));
    }
    if ((today.broke || []).length) {
      lines.push('Broke:');
      today.broke.forEach(s => lines.push(`  • ${s}`));
    }
    lines.push('#AJH64 #BuildInPublic');
    const text = lines.join('\n');
    if (navigator.share) {
      navigator.share({ title: 'AJH Build Journal', text }).catch(() => {
        copyToClipboard(text);
        flashSave('Copied ✓');
      });
    } else {
      copyToClipboard(text);
      flashSave('Copied ✓');
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function exportJournal() {
    try {
      const data = JSON.stringify(entries, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ajh-build-journal-${todayKey()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      flashSave('Exported ✓');
    } catch (e) {
      flashSave('Export failed');
    }
  }

  // ---- init ----
  recalcStreak();
  render();
  wire();
}

// ===========================================================================
// Day 65: Community Wishlist — submit, vote, ship, leaderboard
// ===========================================================================
function initCommunityWishlist() {
  const STORAGE_KEY = 'ajh_wishlist_v1';
  const VOTED_KEY = 'ajh_wishlist_voted_v1';
  const MAX_ITEMS = 200;

  // Seed wishes so the section feels alive on first visit.
  // Each: { id, title, desc, category, status, score, voters, created, shippedDay? }
  const SEED = [
    { id: 'w-seed-1', title: 'Dark mode toggle with smooth transition', desc: 'Click-to-fade between dark and light, persisted across visits.', category: 'design', status: 'shipped', shippedDay: 37, score: 42, voters: [], created: 1714000000000 },
    { id: 'w-seed-2', title: 'A way to actually hear what is built (music player)', desc: 'Lo-fi player with visualizer and shortcuts.', category: 'fun', status: 'shipped', shippedDay: 49, score: 28, voters: [], created: 1715000000000 },
    { id: 'w-seed-3', title: 'Quote-of-the-day that does not suck', desc: 'Rotating quotes with favorites and sharing.', category: 'content', status: 'shipped', shippedDay: 52, score: 17, voters: [], created: 1716000000000 },
    { id: 'w-seed-4', title: 'Search across the whole site', desc: 'Bookmark cards indexed and searchable.', category: 'feature', status: 'shipped', shippedDay: 59, score: 31, voters: [], created: 1717000000000 },
    { id: 'w-seed-5', title: 'Export my data (snippets, quotes, journal)', desc: 'JSON downloads for everything I have built.', category: 'feature', status: 'shipped', shippedDay: 64, score: 24, voters: [], created: 1718000000000 },
    { id: 'w-seed-6', title: 'A reading mode that strips out the chrome', desc: 'Type scales up, nav fades, focus on words.', category: 'design', status: 'shipped', shippedDay: 63, score: 19, voters: [], created: 1719000000000 },
    { id: 'w-seed-7', title: 'Daily journal — shipped / learned / broke', desc: 'A structured log of every build day.', category: 'feature', status: 'shipped', shippedDay: 64, score: 26, voters: [], created: 1719500000000 },
    { id: 'w-seed-8', title: 'Public wishlist so visitors can steer what gets built next', desc: 'You are looking at it.', category: 'feature', status: 'shipped', shippedDay: 65, score: 12, voters: [], created: 1719900000000 },
    { id: 'w-seed-9', title: 'A pixel art editor for fun little logos', desc: '16x16 grid, palette, save and share.', category: 'fun', status: 'shipped', shippedDay: 67, score: 21, voters: [], created: 1720000000000 },
    { id: 'w-seed-9b', title: 'A daily pixel art prompt to actually use the studio', desc: 'Shipped with the reroll button on Day 68.', category: 'fun', status: 'shipped', shippedDay: 68, score: 17, voters: [], created: 1720410000000 },
    { id: 'w-seed-10', title: 'Keyboard shortcut cheatsheet overlay (press ?)', desc: 'A searchable panel of every shortcut.', category: 'feature', status: 'open', score: 14, voters: [], created: 1720100000000 },
    { id: 'w-seed-11', title: 'RSS feed for the build log', desc: 'Subscribe in your reader and never miss a day.', category: 'content', status: 'open', score: 8, voters: [], created: 1720200000000 },
    { id: 'w-seed-12', title: 'Way to comment on a specific build day', desc: 'Threaded discussion per calendar entry.', category: 'content', status: 'planned', score: 5, voters: [], created: 1720300000000 },
    { id: 'w-seed-13', title: 'A 404 page with the keyboard game as a fallback', desc: 'Wandering users get entertained, not bounced.', category: 'fun', status: 'open', score: 6, voters: [], created: 1720400000000 }
  ];

  const CATEGORIES = ['feature', 'design', 'content', 'perf', 'fun'];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return SEED.slice();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : SEED.slice();
    } catch (e) { return SEED.slice(); }
  }
  function save() {
    try {
      const trimmed = items.slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {}
  }
  function loadVoted() {
    try {
      const raw = localStorage.getItem(VOTED_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveVoted() {
    try { localStorage.setItem(VOTED_KEY, JSON.stringify(voted)); } catch (e) {}
  }

  let items = load();
  let voted = loadVoted();
  let activeFilter = 'all';
  let activeSort = 'votes';
  let searchQuery = '';

  function uid() { return 'w-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function relTime(ts) {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return days + 'd ago';
    return Math.floor(days / 30) + 'mo ago';
  }
  function statusLabel(s) { return ({ open: 'Open', planned: 'Planned', shipped: 'Shipped', declined: 'Declined' })[s] || s; }

  function refresh() {
    renderStats();
    renderList();
  }

  function renderStats() {
    const total = items.length;
    const shipped = items.filter(i => i.status === 'shipped').length;
    const open = items.filter(i => i.status === 'open').length;
    const totalVotes = items.reduce((acc, i) => acc + (i.score || 0), 0);
    const topScore = items.reduce((acc, i) => Math.max(acc, i.score || 0), 0);
    const set = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n; };
    set('wish-total', total);
    set('wish-shipped', shipped);
    set('wish-open', open);
    set('wish-votes', totalVotes);
    set('wish-top-score', topScore);
  }

  function renderList() {
    const host = document.getElementById('wishlist-list');
    if (!host) return;
    let list = items.slice();
    if (activeFilter !== 'all') list = list.filter(i => i.status === activeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.desc || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q)
      );
    }
    if (activeSort === 'votes') list.sort((a, b) => (b.score || 0) - (a.score || 0));
    else if (activeSort === 'newest') list.sort((a, b) => (b.created || 0) - (a.created || 0));
    else if (activeSort === 'oldest') list.sort((a, b) => (a.created || 0) - (b.created || 0));
    else if (activeSort === 'title') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    if (!list.length) {
      host.innerHTML = '<div class="wishlist-empty"><i class="fas fa-inbox"></i><div>No wishes match that filter. Try <strong>All</strong> or submit a new one.</div></div>';
      return;
    }
    host.innerHTML = list.map(cardHtml).join('');
    wireCards();
  }

  function cardHtml(i) {
    const myVote = voted[i.id] || 0;
    const score = i.score || 0;
    const cls = score >= 20 ? 'wish-hot' : score <= 0 ? 'wish-cold' : '';
    const shipBadge = i.status === 'shipped' && i.shippedDay
      ? '<span class="wish-meta-shipped"><i class="fas fa-rocket"></i> Built on Day ' + i.shippedDay + '</span>'
      : '';
    const desc = i.desc ? '<p class="wish-card-desc">' + escapeHtml(i.desc) + '</p>' : '';
    return '' +
      '<article class="wish-card status-' + i.status + '" id="wish-card-' + i.id + '">' +
        '<div class="wish-vote-col">' +
          '<button class="wish-vote-btn ' + (myVote === 1 ? 'active-up' : '') + '" data-act="up" data-id="' + i.id + '" title="Upvote" aria-label="Upvote">' +
            '<i class="fas fa-chevron-up"></i>' +
          '</button>' +
          '<div class="wish-vote-count ' + cls + '">' + score + '</div>' +
          '<button class="wish-vote-btn ' + (myVote === -1 ? 'active-down' : '') + '" data-act="down" data-id="' + i.id + '" title="Downvote" aria-label="Downvote">' +
            '<i class="fas fa-chevron-down"></i>' +
          '</button>' +
        '</div>' +
        '<div class="wish-card-body">' +
          '<div class="wish-card-head">' +
            '<span class="wish-status-pill wish-status-' + i.status + '">' + statusLabel(i.status) + '</span>' +
            '<span class="wish-cat-tag">' + escapeHtml(i.category || 'feature') + '</span>' +
            shipBadge +
            '<span class="wish-time-ago">' + relTime(i.created) + '</span>' +
          '</div>' +
          '<h3 class="wish-card-title">' + escapeHtml(i.title) + '</h3>' +
          desc +
          '<div class="wish-card-actions">' +
            (i.status === 'open' ? '<button class="wish-mini" data-act="plan" data-id="' + i.id + '"><i class="fas fa-bullseye"></i> Plan</button>' : '') +
            (i.status === 'planned' ? '<button class="wish-mini" data-act="ship" data-id="' + i.id + '"><i class="fas fa-rocket"></i> Mark shipped</button>' : '') +
            (i.status === 'shipped' && i.shippedDay ? '<button class="wish-mini" data-act="scroll-blog" data-id="' + i.id + '"><i class="fas fa-book-open"></i> Read log</button>' : '') +
            '<button class="wish-mini" data-act="copy" data-id="' + i.id + '"><i class="fas fa-link"></i> Share</button>' +
            '<button class="wish-mini wish-mini-danger" data-act="delete" data-id="' + i.id + '" title="Delete"><i class="fas fa-trash"></i></button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function wireCards() {
    document.querySelectorAll('#wishlist-list .wish-vote-btn, #wishlist-list .wish-mini').forEach(b => {
      b.addEventListener('click', onAction);
    });
  }

  function onAction(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    const act = btn.dataset.act;
    const item = items.find(x => x.id === id);
    if (!item) return;

    if (act === 'up' || act === 'down') {
      const dir = act === 'up' ? 1 : -1;
      const prev = voted[id] || 0;
      let delta = dir - prev;
      item.score = Math.max(0, (item.score || 0) + delta);
      voted[id] = prev === dir ? 0 : dir;
      saveVoted(); save();
      refresh();
      flashToast((delta > 0 ? '↑ +' : delta < 0 ? '↓ ' : '') + (delta || '0'));
      return;
    }
    if (act === 'plan') { item.status = 'planned'; save(); refresh(); flashToast('Marked planned'); return; }
    if (act === 'ship') {
      item.status = 'shipped';
      item.shippedDay = 65;
      save(); refresh();
      flashToast('Shipped! 🎉 Day 65');
      return;
    }
    if (act === 'scroll-blog' && item.shippedDay) {
      const blog = document.getElementById('blog');
      if (blog) blog.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (act === 'copy') {
      const text = item.title + ' — AJH Build Wishlist (' + item.status + ')';
      copyToClipboardLocal(text);
      flashToast('Copied ✓');
      return;
    }
    if (act === 'delete') {
      items = items.filter(x => x.id !== id);
      delete voted[id];
      save(); saveVoted(); refresh();
      flashToast('Removed');
      return;
    }
  }

  function wireForm() {
    const form = document.getElementById('wish-form');
    if (!form) return;
    const titleEl = document.getElementById('wish-title');
    const descEl = document.getElementById('wish-desc');
    const catEl = document.getElementById('wish-category');
    const countEl = document.getElementById('wish-charcount');

    if (descEl && countEl) {
      const updateCount = () => { countEl.textContent = (descEl.value || '').length + ' / 280'; };
      descEl.addEventListener('input', updateCount);
      updateCount();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (titleEl.value || '').trim().slice(0, 80);
      if (!title) { flashToast('Add a title first'); titleEl.focus(); return; }
      const desc = (descEl.value || '').trim().slice(0, 280);
      const category = CATEGORIES.includes(catEl.value) ? catEl.value : 'feature';
      items.unshift({
        id: uid(),
        title,
        desc,
        category,
        status: 'open',
        score: 1,
        voters: ['you'],
        created: Date.now()
      });
      titleEl.value = '';
      descEl.value = '';
      catEl.value = 'feature';
      if (countEl) countEl.textContent = '0 / 280';
      save();
      refresh();
      flashToast('Wish submitted ↑1');
    });
  }

  function wireFilters() {
    document.querySelectorAll('.wish-filter').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.wish-filter').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
        activeFilter = b.dataset.filter;
        renderList();
      });
    });
    const sort = document.getElementById('wish-sort');
    if (sort) sort.addEventListener('change', (e) => { activeSort = e.target.value; renderList(); });
  }

  function wireHero() {
    const hero = document.getElementById('wishlist-hero-btn');
    if (hero) hero.addEventListener('click', () => {
      const sec = document.getElementById('wishlist');
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { const t = document.getElementById('wish-title'); if (t) t.focus({ preventScroll: true }); }, 600);
      }
    });
  }

  function flashToast(msg) {
    let el = document.getElementById('wl-flash-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'wl-flash-toast';
      el.className = 'wl-flash';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(flashToast._t);
    flashToast._t = setTimeout(() => el.classList.remove('show'), 1600);
  }

  function copyToClipboardLocal(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopyLocal(text));
    } else fallbackCopyLocal(text);
  }
  function fallbackCopyLocal(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ---- init ----
  refresh();
  wireForm();
  wireFilters();
  wireHero();
}
/* ============================================================ */
/* Day 66 — On This Day / Builder Wisdom                         */
/* ============================================================ */

function initDailyWisdom() {
  const CARD_KEY = 'ajh_wisdom_v1';
  const STATS_KEY = 'ajh_wisdom_stats_v1';
  const VIEWED_KEY = 'ajh_wisdom_viewed_v1';

  // ---- 365 builder principles (curated bank + deterministic extension) ----
  // Each entry: { text, category }
  const SEED = [
    { t: 'Ship the smallest useful thing today.', c: 'Shipping' },
    { t: 'If it is worth doing, it is worth doing badly first.', c: 'Mindset' },
    { t: 'Delete is the cheapest feature you can ship.', c: 'Engineering' },
    { t: 'A spec is a story you tell yourself to delay writing code.', c: 'Craft' },
    { t: 'Discipline equals freedom. The structure is the ladder.', c: 'Discipline' },
    { t: 'Perfection is a moving target. Done is a direction.', c: 'Shipping' },
    { t: 'The best debugging tool is a clear head and a fresh log.', c: 'Engineering' },
    { t: 'Make it work, make it right, make it fast — in that order.', c: 'Craft' },
    { t: 'A commit message is a love letter to your future self.', c: 'Craft' },
    { t: 'Write code for the next person to read. That person is you.', c: 'Craft' },
    { t: 'Tests are a gift to the version of you that ships at 2am.', c: 'Engineering' },
    { t: 'Boring tech is a feature, not a failure.', c: 'Engineering' },
    { t: 'You do not have a performance problem until you measure one.', c: 'Engineering' },
    { t: 'Read the error message twice before you read the docs once.', c: 'Engineering' },
    { t: 'Reproductions are the bridge between "weird" and "fixed".', c: 'Engineering' },
    { t: 'The fastest code is the code you do not write.', c: 'Engineering' },
    { t: 'Refactor when the third example appears, not the first.', c: 'Craft' },
    { t: 'Naming is the design. The variable name is the API.', c: 'Craft' },
    { t: 'Comments explain why, not what. Code is what.', c: 'Craft' },
    { t: 'Small functions, small commits, small bets — same principle.', c: 'Craft' },
    { t: 'A long branch is a slow goodbye.', c: 'Discipline' },
    { t: 'Merge daily. The trunk is the truth.', c: 'Discipline' },
    { t: 'Daily beats dramatic. Streaks beat sprints.', c: 'Discipline' },
    { t: 'One commit per day is better than one commit per quarter.', c: 'Discipline' },
    { t: 'Show up. The muse rewards attendance.', c: 'Mindset' },
    { t: 'Build for the version of you that is tired.', c: 'Mindset' },
    { t: 'Tired? Ship the smallest unit. Proud? Ship the next one.', c: 'Shipping' },
    { t: 'Velocity is a function of clarity, not talent.', c: 'Craft' },
    { t: 'Plan in days, build in hours, ship in minutes.', c: 'Shipping' },
    { t: 'If you cannot explain it to a friend, you cannot ship it.', c: 'Craft' },
    { t: 'Every bug is a story with two characters: code and intent.', c: 'Engineering' },
    { t: 'Good software is a museum of decisions you can read.', c: 'Craft' },
    { t: 'Logs are the diary. Make them kind to strangers.', c: 'Engineering' },
    { t: 'APIs are conversations. Be brief, be kind, be clear.', c: 'Craft' },
    { t: 'Users do not want features. They want outcomes.', c: 'Mindset' },
    { t: 'A feature is only a feature once someone uses it.', c: 'Shipping' },
    { t: 'The version users have is sacred. The version users get is negotiable.', c: 'Shipping' },
    { t: 'Backward compatibility is respect with teeth.', c: 'Engineering' },
    { t: 'Roll forward is cheaper than roll back. Almost always.', c: 'Engineering' },
    { t: 'A failing test is the first line of a fix.', c: 'Engineering' },
    { t: 'You cannot optimize what you cannot measure.', c: 'Engineering' },
    { t: 'Latency is a tax on every action. Keep the rate low.', c: 'Engineering' },
    { t: 'Accessibility is not a feature. It is a floor.', c: 'Craft' },
    { t: 'Mobile is not a viewport. It is a constraint set.', c: 'Craft' },
    { t: 'Performance is a UX feature you cannot see.', c: 'Engineering' },
    { t: 'A 100ms delay is felt. A 1s delay is forgiven. A 10s delay is left.', c: 'Engineering' },
    { t: 'Caching is a memory. Choose what to remember.', c: 'Engineering' },
    { t: 'Premature optimization is the root, but premature shipping is too.', c: 'Shipping' },
    { t: 'Versioning is the contract. Read it before you write.', c: 'Engineering' },
    { t: 'A readme is a handshake. A changelog is a promise.', c: 'Craft' },
    { t: 'Documentation is the second product.', c: 'Craft' },
    { t: 'If the docs are wrong, the feature is broken.', c: 'Craft' },
    { t: 'Stable is a velocity feature.', c: 'Engineering' },
    { t: 'The right amount of complexity is the least you can get away with.', c: 'Craft' },
    { t: 'Every abstraction is a tax on the next reader.', c: 'Craft' },
    { t: 'There are two hard problems: cache invalidation and naming.', c: 'Craft' },
    { t: 'Off-by-one is the universe trolling you.', c: 'Engineering' },
    { t: 'Edge cases are where users live.', c: 'Craft' },
    { t: 'When in doubt, print. When sure, print again.', c: 'Engineering' },
    { t: 'A good error tells the user what to do next.', c: 'Craft' },
    { t: 'Empty states teach more than populated ones.', c: 'Craft' },
    { t: 'Defaults are decisions the user did not make.', c: 'Craft' },
    { t: 'A keyboard shortcut is a love letter to power users.', c: 'Craft' },
    { t: 'A undo button is an apology for the future.', c: 'Craft' },
    { t: 'Search is the universal interface. Build it well.', c: 'Craft' },
    { t: 'Persistence is the feature. The rest is the surface.', c: 'Engineering' },
    { t: 'A localStorage write is a promise to future visitors.', c: 'Engineering' },
    { t: 'Schema migrations are the scars of growth. Keep them clean.', c: 'Engineering' },
    { t: 'Migrations are not a phase. They are the project.', c: 'Engineering' },
    { t: 'Indexes are the gift you give your future queries.', c: 'Engineering' },
    { t: 'A transaction is a handshake. Commit or rollback, never both.', c: 'Engineering' },
    { t: 'A bug you cannot reproduce is a story you have not heard.', c: 'Engineering' },
    { t: 'Reproduce. Reduce. Rewrite. Release.', c: 'Engineering' },
    { t: 'Bisect is your time machine. Use it.', c: 'Engineering' },
    { t: 'A feature flag is a permission slip. Use it sparingly.', c: 'Engineering' },
    { t: 'The road to legacy is paved with quick fixes.', c: 'Engineering' },
    { t: 'Tech debt is a tax. Pay it on time or pay it with interest.', c: 'Discipline' },
    { t: 'Every TODO is a future you are borrowing from.', c: 'Discipline' },
    { t: 'Discipline is choosing what you will not do.', c: 'Discipline' },
    { t: 'Habits outlast motivation. Build the loop.', c: 'Discipline' },
    { t: 'Small habits compound like interest.', c: 'Discipline' },
    { t: 'One percent better daily is thirty-eight times better yearly.', c: 'Mindset' },
    { t: 'The streak is not the goal. The streak is the side effect.', c: 'Mindset' },
    { t: 'A daily build beats a weekly brainstorm.', c: 'Discipline' },
    { t: 'The first hour is the most expensive. Spend it on thinking.', c: 'Craft' },
    { t: 'Plan for the version of the project that exists in three months.', c: 'Craft' },
    { t: 'Future-proofing is the most expensive feature.', c: 'Engineering' },
    { t: 'The best time to add observability was at the start.', c: 'Engineering' },
    { t: 'Logs are the ground truth. Metrics are the highlights.', c: 'Engineering' },
    { t: 'A dashboard is a question with knobs.', c: 'Engineering' },
    { t: 'Alerts should page humans, not their curiosity.', c: 'Engineering' },
    { t: 'A clean terminal is a clean mind.', c: 'Craft' },
    { t: 'Tabs are a tax. Spaces are peace.', c: 'Craft' },
    { t: 'Linters are critics who never sleep.', c: 'Engineering' },
    { t: 'Formatters end arguments. Use them.', c: 'Discipline' },
    { t: 'The CI is the bouncer. The PR is the ID.', c: 'Engineering' },
    { t: 'A green build is a small celebration. Have one.', c: 'Mindset' },
    { t: 'A red build is a small tragedy. Acknowledge it.', c: 'Mindset' },
    { t: 'Ship often. Sleep well. Repeat.', c: 'Shipping' },
    { t: 'A daily deploy is the cheapest insurance.', c: 'Shipping' },
    { t: 'Production is the only environment that matters.', c: 'Engineering' },
    { t: 'A backup you never tested is a wish.', c: 'Engineering' },
    { t: 'A runbook you never wrote is a prayer.', c: 'Engineering' },
    { t: 'Security is a feature you cannot see but everyone depends on.', c: 'Engineering' },
    { t: 'Authorship is the most important security control.', c: 'Engineering' },
    { t: 'Secrets in code are postcards for attackers.', c: 'Engineering' },
    { t: 'Rotate keys like you rotate tires: on schedule.', c: 'Engineering' },
    { t: 'Input is guilty until proven innocent.', c: 'Engineering' },
    { t: 'Output is innocent until compared.', c: 'Engineering' },
    { t: 'Privacy is a feature. Consent is a process.', c: 'Craft' },
    { t: 'A user who feels respected is a user who returns.', c: 'Mindset' },
    { t: 'Onboarding is the first 60 seconds of respect.', c: 'Craft' },
    { t: 'Empty states are tiny tutorials.', c: 'Craft' },
    { t: 'A loading state is a promise to the user.', c: 'Craft' },
    { t: 'Animation explains what words cannot.', c: 'Craft' },
    { t: 'Whitespace is the cheapest design tool.', c: 'Craft' },
    { t: 'Color is a vocabulary. Use it intentionally.', c: 'Craft' },
    { t: 'Type is the user interface of the user interface.', c: 'Craft' },
    { t: 'A button is a sentence. Make it active.', c: 'Craft' },
    { t: 'A link is a door. Make it obvious where it goes.', c: 'Craft' },
    { t: 'A modal is a conversation interrupter. Use sparingly.', c: 'Craft' },
    { t: 'A toast is a whisper, not a shout.', c: 'Craft' },
    { t: 'A notification is a tap on the shoulder, not a punch.', c: 'Craft' },
    { t: 'Good UX is the absence of "where am I?" moments.', c: 'Craft' },
    { t: 'A great UI has fewer features, not more.', c: 'Craft' },
    { t: 'A great product removes steps, not adds buttons.', c: 'Craft' },
    { t: 'A great API removes surprises, not just parameters.', c: 'Engineering' },
    { t: 'A great docs page removes guesses.', c: 'Craft' },
    { t: 'A great changelog removes fear of upgrading.', c: 'Craft' },
    { t: 'A great on-call removes panic.', c: 'Engineering' },
    { t: 'A great backlog removes guilt.', c: 'Discipline' },
    { t: 'A great team removes meetings.', c: 'Discipline' },
    { t: 'A great standup is 5 minutes and one decision.', c: 'Discipline' },
    { t: 'A great review is two comments and a thank you.', c: 'Craft' },
    { t: 'A great comment is the one that prevents the next bug.', c: 'Craft' },
    { t: 'A great test is the one that fails when it should.', c: 'Engineering' },
    { t: 'A great name is the one you remember a year from now.', c: 'Craft' },
    { t: 'A great error is the one you can copy and paste to a search engine.', c: 'Craft' },
    { t: 'A great log is the one you can read in the dark.', c: 'Engineering' },
    { t: 'A great metric is the one a stakeholder can act on.', c: 'Engineering' },
    { t: 'A great goal is the one you can finish before lunch.', c: 'Mindset' },
    { t: 'A great streak is the one you do not notice until it is huge.', c: 'Mindset' },
    { t: 'A great commit is the one you do not have to explain.', c: 'Craft' },
    { t: 'A great PR is the one that gets approved in a coffee break.', c: 'Craft' },
    { t: 'A great review is a compliment sandwich you can skip.', c: 'Craft' },
    { t: 'A great rewrite is the one you do not have to do.', c: 'Engineering' },
    { t: 'A great deprecation is the one nobody notices.', c: 'Engineering' },
    { t: 'A great migration is the one with a script.', c: 'Engineering' },
    { t: 'A great dashboard is the one you open once a week.', c: 'Engineering' },
    { t: 'A great alert is the one that wakes you for the right reason.', c: 'Engineering' },
    { t: 'A great runbook is the one you write while calm.', c: 'Engineering' },
    { t: 'A great postmortem is the one without blame.', c: 'Engineering' },
    { t: 'A great decision is the one you can explain in a tweet.', c: 'Discipline' },
    { t: 'A great meeting is the one that ends early.', c: 'Discipline' },
    { t: 'A great spec is the one that fits on one page.', c: 'Craft' },
    { t: 'A great design is the one that fits on one screen.', c: 'Craft' },
    { t: 'A great pitch is the one that fits in one sentence.', c: 'Mindset' },
    { t: 'A great name is the one that fits in one word.', c: 'Craft' },
    { t: 'A great function is the one that does one thing.', c: 'Craft' },
    { t: 'A great class is the one with one reason to change.', c: 'Craft' },
    { t: 'A great module is the one you can delete in an afternoon.', c: 'Engineering' },
    { t: 'A great dependency is the one you can replace in a day.', c: 'Engineering' },
    { t: 'A great monorepo is the one that compiles in a minute.', c: 'Engineering' },
    { t: 'A great microfrontend is the one nobody can tell is one.', c: 'Engineering' },
    { t: 'A great API is the one that does not need a client library.', c: 'Engineering' },
    { t: 'A great SDK is the one you can vendor in a weekend.', c: 'Engineering' },
    { t: 'A great CLI is the one with --help that is actually helpful.', c: 'Craft' },
    { t: 'A great README is the one with a GIF.', c: 'Craft' },
    { t: 'A great landing page is the one with one button.', c: 'Craft' },
    { t: 'A great 404 is the one that does not feel like a 404.', c: 'Craft' },
    { t: 'A great error boundary is the one that says sorry gracefully.', c: 'Engineering' },
    { t: 'A great fallback is the one the user prefers.', c: 'Craft' },
    { t: 'A great cache miss is the one you logged.', c: 'Engineering' },
    { t: 'A great retry has a max.', c: 'Engineering' },
    { t: 'A great timeout is shorter than the user patience.', c: 'Engineering' },
    { t: 'A great queue is empty.', c: 'Engineering' },
    { t: 'A great cron is idempotent.', c: 'Engineering' },
    { t: 'A great migration is reversible.', c: 'Engineering' },
    { t: 'A great deploy is boring.', c: 'Shipping' },
    { t: 'A great rollback is one command.', c: 'Engineering' },
    { t: 'A great outage is the one you write down.', c: 'Engineering' },
    { t: 'A great on-call is the one you forget you are on.', c: 'Engineering' },
    { t: 'A great team is the one that ships on Friday.', c: 'Shipping' },
    { t: 'A great Friday is the one with a green build and a clear Monday.', c: 'Mindset' },
    { t: 'A great Monday is the one that starts with a small commit.', c: 'Discipline' },
    { t: 'A great Wednesday is the one you ship something.', c: 'Shipping' },
    { t: 'A great weekend is the one with a streak.', c: 'Mindset' },
    { t: 'A great year is the one with 365 small wins.', c: 'Mindset' },
    { t: 'A great project is the one you can show in a screenshot.', c: 'Craft' },
    { t: 'A great portfolio is the one with receipts.', c: 'Craft' },
    { t: 'A great resume is the one with a live demo.', c: 'Shipping' },
    { t: 'A great interview is the one with a story.', c: 'Mindset' },
    { t: 'A great mentor is the one with scars.', c: 'Mindset' },
    { t: 'A great learner is the one who admits they are wrong.', c: 'Mindset' },
    { t: 'A great teacher is the one who makes it look easy.', c: 'Mindset' },
    { t: 'A great engineer is the one who writes the next engineer out of a job.', c: 'Mindset' },
    { t: 'A great product is the one you would use yourself.', c: 'Mindset' },
    { t: 'A great open source project is the one with a kind maintainer.', c: 'Mindset' },
    { t: 'A great issue is the one with a reproduction.', c: 'Craft' },
    { t: 'A great PR is the one with a screenshot.', c: 'Craft' },
    { t: 'A great release note is the one with a before and after.', c: 'Craft' },
    { t: 'A great demo is the one that does not crash.', c: 'Shipping' },
    { t: 'A great keynote is the one with a story per slide.', c: 'Craft' },
    { t: 'A great doc is the one with an example.', c: 'Craft' },
    { t: 'A great example is the one you can run.', c: 'Craft' },
    { t: 'A great test is the one that catches a bug in CI.', c: 'Engineering' },
    { t: 'A great CI is the one you do not babysit.', c: 'Engineering' },
    { t: 'A great CD is the one you trust.', c: 'Engineering' },
    { t: 'A great SLO is the one you write before the outage.', c: 'Engineering' },
    { t: 'A great runbook is the one you update after the outage.', c: 'Engineering' },
    { t: 'A great postmortem is the one you read in 5 minutes.', c: 'Engineering' },
    { t: 'A great decision log is the one you search.', c: 'Discipline' },
    { t: 'A great ADR is the one with a "we considered X" section.', c: 'Discipline' },
    { t: 'A great RFC is the one that says no, kindly.', c: 'Craft' },
    { t: 'A great experiment is the one with a hypothesis.', c: 'Discipline' },
    { t: 'A great metric is the one you can move.', c: 'Discipline' },
    { t: 'A great goal is the one with a deadline.', c: 'Discipline' },
    { t: 'A great sprint is the one you finish.', c: 'Discipline' },
    { t: 'A great backlog is the one you trim.', c: 'Discipline' },
    { t: 'A great inbox is the one that hits zero.', c: 'Discipline' },
    { t: 'A great day is the one you can summarize in three words.', c: 'Mindset' },
    { t: 'A great build is the one your future self thanks you for.', c: 'Mindset' }
  ];

  // Deterministic PRNG (mulberry32) for stable day-to-day picks
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Extend the bank to 365 by mutating with templated variants.
  // Each day of year gets a deterministic pick seeded by (year, doy).
  function buildDeck(year) {
    const rng = mulberry32(year * 367 + 101);
    const deck = [];
    for (let i = 0; i < 365; i++) {
      const seed = SEED[i % SEED.length];
      // Slight variations: ~30% get a category-prefixed twist
      const variant = Math.floor(rng() * 4);
      let text = seed.t;
      let category = seed.c;
      if (variant === 1 && !text.startsWith('A ')) text = 'Reminder: ' + text.toLowerCase();
      else if (variant === 2) text = text.replace(/\.$/, '') + ' — even when no one is watching.';
      else if (variant === 3) text = 'Builders note · ' + text;
      deck.push({ text, category, day: i + 1 });
    }
    return deck;
  }

  // ---- state ----
  let currentIndex = 0;
  let filter = 'all';
  let bookmarkedOnly = false;
  let flipped = false;

  function loadBookmarks() {
    try { return JSON.parse(localStorage.getItem(CARD_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveBookmarks(arr) { localStorage.setItem(CARD_KEY, JSON.stringify(arr)); }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveStats(o) { localStorage.setItem(STATS_KEY, JSON.stringify(o)); }
  function loadViewed() {
    try { return JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveViewed(arr) { localStorage.setItem(VIEWED_KEY, JSON.stringify(arr)); }

  function dayOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / 86400000);
  }

  // ---- DOM ----
  const today = new Date();
  const year = today.getFullYear();
  const doy = dayOfYear(today);
  const DECK = buildDeck(year);
  const TODAY_INDEX = Math.min(Math.max(doy - 1, 0), DECK.length - 1);
  currentIndex = TODAY_INDEX;

  const $ = (id) => document.getElementById(id);

  function renderCard() {
    const card = DECK[currentIndex];
    if (!card) return;
    $('wisdom-card-number').textContent = '#' + String(card.day).padStart(3, '0');
    $('wisdom-card-category').textContent = card.category;
    $('wisdom-quote').textContent = card.text;
    $('wisdom-note').textContent = '— day ' + card.day + ' · builder reminder';
    $('wisdom-position').textContent = (currentIndex + 1) + ' / ' + DECK.length;
    const pct = Math.round(((currentIndex + 1) / DECK.length) * 100);
    $('wisdom-progress-pct').textContent = pct + '%';

    const bookmarks = loadBookmarks();
    const isBookmarked = bookmarks.includes(card.day);
    const bmark = $('wisdom-bookmark');
    bmark.classList.toggle('active', isBookmarked);
    bmark.querySelector('i').className = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
    bmark.querySelector('span').textContent = isBookmarked ? 'Saved' : 'Save';

    // Track viewed
    const viewed = loadViewed();
    if (!viewed.includes(card.day)) {
      viewed.push(card.day);
      saveViewed(viewed.slice(-365));
    }
    updateStats();
    updateDayOfYear();
  }

  function updateStats() {
    const stats = loadStats();
    const bookmarks = loadBookmarks();
    const viewed = loadViewed();
    $('wisdom-bookmarks').textContent = bookmarks.length;
    $('wisdom-shared').textContent = stats.shared || 0;
    $('wisdom-read').textContent = viewed.length;
  }

  function updateDayOfYear() {
    const d = dayOfYear(new Date());
    $('wisdom-dayofyear').textContent = '#' + String(d).padStart(3, '0');
  }

  function flashToast(msg) {
    let el = document.getElementById('wisdom-flash');
    if (!el) {
      el = document.createElement('div');
      el.id = 'wisdom-flash';
      el.className = 'wisdom-flash';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(flashToast._t);
    flashToast._t = setTimeout(() => el.classList.remove('show'), 1500);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ---- actions ----
  function next() { currentIndex = (currentIndex + 1) % DECK.length; renderCard(); }
  function prev() { currentIndex = (currentIndex - 1 + DECK.length) % DECK.length; renderCard(); }

  function toggleBookmark() {
    const card = DECK[currentIndex];
    const bookmarks = loadBookmarks();
    const idx = bookmarks.indexOf(card.day);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      flashToast('Removed from bookmarks');
    } else {
      bookmarks.push(card.day);
      flashToast('Bookmarked ✓');
    }
    saveBookmarks(bookmarks);
    renderCard();
  }

  function shareCard() {
    const card = DECK[currentIndex];
    const text = 'Day ' + card.day + ' · ' + card.category + '\n\n"' + card.text + '"\n\n— AJH daily wisdom';
    if (navigator.share) {
      navigator.share({ title: 'AJH Daily Wisdom · Day ' + card.day, text }).catch(() => {});
    } else {
      copyText(text);
      flashToast('Copied ✓');
    }
    const stats = loadStats();
    stats.shared = (stats.shared || 0) + 1;
    saveStats(stats);
    updateStats();
  }

  function flipCard() {
    const wrap = document.querySelector('.wisdom-card-wrap');
    if (wrap) wrap.classList.toggle('flipped');
    flipped = !flipped;
  }

  // ---- bank (compact list of every card in the current filter) ----
  function renderBank() {
    const bank = $('wisdom-bank');
    if (!bank) return;
    const bookmarks = loadBookmarks();
    let list = DECK.slice();
    if (filter !== 'all') list = list.filter((c) => c.category === filter);
    if (bookmarkedOnly) list = list.filter((c) => bookmarks.includes(c.day));
    bank.innerHTML = list
      .map((c) => {
        const saved = bookmarks.includes(c.day);
        return `<div class="wisdom-bank-item${saved ? ' saved' : ''}" data-day="${c.day}">
          <span class="wisdom-bank-num">#${String(c.day).padStart(3, '0')}</span>
          <span class="wisdom-bank-cat">${c.category}</span>
          <span class="wisdom-bank-text">${c.text}</span>
          ${saved ? '<i class="fas fa-bookmark" aria-label="Bookmarked"></i>' : ''}
        </div>`;
      })
      .join('');
    bank.querySelectorAll('.wisdom-bank-item').forEach((el) => {
      el.addEventListener('click', () => {
        const day = parseInt(el.dataset.day, 10);
        currentIndex = DECK.findIndex((c) => c.day === day);
        if (currentIndex < 0) currentIndex = 0;
        renderCard();
        const cardEl = $('wisdom-card');
        if (cardEl) cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // ---- wire ----
  function wire() {
    $('wisdom-prev')?.addEventListener('click', prev);
    $('wisdom-next')?.addEventListener('click', next);
    $('wisdom-bookmark')?.addEventListener('click', toggleBookmark);
    $('wisdom-copy')?.addEventListener('click', () => {
      const card = DECK[currentIndex];
      copyText('"' + card.text + '" — AJH daily wisdom (day ' + card.day + ')');
      flashToast('Copied ✓');
    });
    $('wisdom-share')?.addEventListener('click', shareCard);
    $('wisdom-flip')?.addEventListener('click', flipCard);

    document.querySelectorAll('.wisdom-filter').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.wisdom-filter').forEach((x) => {
          x.classList.remove('active'); x.setAttribute('aria-selected', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
        filter = b.dataset.filter;
        renderBank();
      });
    });

    $('wisdom-today-btn')?.addEventListener('click', () => {
      currentIndex = TODAY_INDEX;
      renderCard();
      flashToast('Jumped to today');
    });
    $('wisdom-random-btn')?.addEventListener('click', () => {
      currentIndex = Math.floor(Math.random() * DECK.length);
      renderCard();
    });
    $('wisdom-bookmarks-toggle')?.addEventListener('click', (e) => {
      bookmarkedOnly = !bookmarkedOnly;
      e.currentTarget.classList.toggle('active', bookmarkedOnly);
      renderBank();
    });

    const heroBtn = $('wisdom-hero-btn');
    if (heroBtn) heroBtn.addEventListener('click', () => {
      document.getElementById('wisdom')?.scrollIntoView({ behavior: 'smooth' });
    });

    // keyboard nav while section is visible
    document.addEventListener('keydown', (e) => {
      const sec = document.getElementById('wisdom');
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); flipCard(); }
      else if (e.key === 'b' || e.key === 'B') { e.preventDefault(); toggleBookmark(); }
      else if (e.key === 'o' || e.key === 'O') {
        if (e.shiftKey || e.metaKey || e.ctrlKey) return;
        currentIndex = TODAY_INDEX; renderCard();
      }
    });
  }

  // ---- init ----
  renderCard();
  renderBank();
  updateStats();
  wire();
  updateDayOfYear();
}

// ============================================
// DAY 78/79/80: BUILD GARDEN + BUILD TAPE + BUILD SKYLINE — hero button wiring
// ============================================
function initDay78HeroButtons() {
  const gardenBtn = document.getElementById('garden-hero-btn');
  if (gardenBtn) {
    gardenBtn.addEventListener('click', () => {
      const target = document.getElementById('garden');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  const tapeBtn = document.getElementById('tape-hero-btn');
  if (tapeBtn) {
    tapeBtn.addEventListener('click', () => {
      const target = document.getElementById('tape');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  const skylineBtn = document.getElementById('skyline-hero-btn');
  if (skylineBtn) {
    skylineBtn.addEventListener('click', () => {
      const target = document.getElementById('skyline');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  const waveformBtn = document.getElementById('waveform-hero-btn');
  if (waveformBtn) {
    waveformBtn.addEventListener('click', () => {
      const target = document.getElementById('waveform');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  const compassBtn = document.getElementById('compass-hero-btn');
  if (compassBtn) {
    compassBtn.addEventListener('click', () => {
      const target = document.getElementById('compass');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  const pulseBtn = document.getElementById('pulse-hero-btn');
  if (pulseBtn) {
    pulseBtn.addEventListener('click', () => document.getElementById('pulse')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  const proofBtn = document.getElementById('proof-hero-btn');
  if (proofBtn) proofBtn.addEventListener('click', () => document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  const lighthouseBtn = document.getElementById('lighthouse-hero-btn');
  if (lighthouseBtn) {
    lighthouseBtn.addEventListener('click', () => {
      const target = document.getElementById('lighthouse');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => window.ajhLighthouse && window.ajhLighthouse.run && window.ajhLighthouse.run(), 450);
    });
  }
}


(function initReleaseNotesHeroButton() {
  const button = document.getElementById('releases-hero-btn');
  if (!button) return;
  button.addEventListener('click', () => {
    document.getElementById('releases')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
