const App = {
  init() {
    this.initMobileMenu();
    this.initNavbarScroll();
    this.initBookmarks();
    this.initNavLoginOverflow();
    this.initActiveNav();
  },

  initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  showToast(message, type = 'success') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'profile-toast'; // reusing profile-toast styles
      document.body.appendChild(toast);
    }
    
    // Set appropriate color based on type
    if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    } else {
      toast.style.background = 'linear-gradient(135deg, #6f4cff, #10b981)';
    }

    toast.textContent = message;
    
    // Force reflow
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
          icon.className = 'ph ph-x';
        } else {
          icon.className = 'ph ph-list';
        }
      });
    }
  },

  initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }
  },

  // Mobile only: keeps the navbar on a single row and the Login button
  // always fully visible. If the row doesn't have room for it, the
  // button is moved into the hamburger menu (nav-links). Desktop and
  // tablet layouts are never touched (guarded by the 768px check).
  initNavLoginOverflow() {
    const MOBILE_BREAKPOINT = 768;
    const navContainer = document.querySelector('.nav-container');
    const authSlot = document.getElementById('auth-header-slot');
    const navLoginItem = document.getElementById('nav-login-item');

    if (!navContainer || !authSlot || !navLoginItem) return;

    const observer = new MutationObserver(() => evaluate());

    function evaluate() {
      // Stop observing while we move nodes ourselves, so our own
      // changes never re-trigger this same callback (would loop).
      observer.disconnect();

      if (window.innerWidth > MOBILE_BREAKPOINT) {
        if (navLoginItem.firstChild) {
          authSlot.appendChild(navLoginItem.firstChild);
        }
        navLoginItem.classList.remove('has-login');
        observer.observe(authSlot, { childList: true });
        return;
      }

      const loginBtn = authSlot.querySelector('.auth-login-btn') || navLoginItem.querySelector('.auth-login-btn');

      if (!loginBtn) {
        // No Login button to place (e.g. user is signed in).
        observer.observe(authSlot, { childList: true });
        return;
      }

      // Measure with the button back in its natural spot first.
      if (navLoginItem.contains(loginBtn)) {
        authSlot.appendChild(loginBtn);
        navLoginItem.classList.remove('has-login');
      }

      const overflowing = navContainer.scrollWidth > navContainer.clientWidth + 1;
      if (overflowing) {
        navLoginItem.appendChild(loginBtn);
        navLoginItem.classList.add('has-login');
      }

      observer.observe(authSlot, { childList: true });
    }

    evaluate();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(evaluate, 120);
    });
  },

  initBookmarks() {
    // Basic initialization for bookmarks/favorites in LocalStorage
    if (!localStorage.getItem('readora_favorites')) {
      localStorage.setItem('readora_favorites', JSON.stringify([]));
    }
    if (!localStorage.getItem('readora_progress')) {
      localStorage.setItem('readora_progress', JSON.stringify({}));
    }
  },
  
  createCardHTML(item, isManga = false) {
    const lang = LanguageManager.currentLang;
    const title = lang === 'ar' ? item.titleAr : item.titleEn;
    
    return `
      <a href="novel.html?id=${item.id}&type=${isManga ? 'manga' : 'novel'}" class="item-card glass-card fade-in">
        <div class="card-image-wrapper">
          <div class="card-badge"><i class="ph-fill ph-star"></i> ${item.rating}</div>
          <img src="${item.cover}" alt="${title}" class="card-image" loading="lazy">
          <div class="card-overlay">
            <button class="btn-icon" type="button" aria-label="Favorite" data-require-auth="favorite" data-item-id="${item.id}"><i class="ph ph-heart"></i></button>
          </div>
        </div>
        <div class="card-info" style="padding: 0 0.5rem 0.5rem;">
          <h3 class="card-title">${title}</h3>
          <span class="card-author">${item.author}</span>
          <div class="card-meta">
            <span>${item.category}</span>
            <span><i class="ph ph-book-open"></i> ${item.chapters} ${LanguageManager.get('chapters')}</span>
          </div>
        </div>
      </a>
    `;
  },
  
  createSkeletonCard() {
      return `
      <div class="item-card glass-card skeleton-card">
        <div class="card-image-wrapper skeleton"></div>
        <div class="card-info" style="padding: 0 0.5rem 0.5rem;">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-author"></div>
          <div class="skeleton skeleton-meta"></div>
        </div>
      </div>
      `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
