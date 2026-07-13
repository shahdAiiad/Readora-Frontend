const AuthManager = {
  state: {
    user: null
  },

  init() {
    this.injectModalStyles();
    this.initPasswordToggles();
    this.bindEvents();
    this.restoreSession();
    this.bindAuthPageForms();
    this.renderAuthUI();

    if (this.isProfilePage() && !this.state.user) {
      this.showLoginGateModal();
      return;
    }

    if (this.isAuthPage() && this.state.user) {
      window.location.replace('index.html');
    }
  },

  initPasswordToggles() {
    document.querySelectorAll('.auth-password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-auth-password-toggle');
        const input = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        if (input && icon) {
          if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'ph ph-eye-slash';
          } else {
            input.type = 'password';
            icon.className = 'ph ph-eye';
          }
        }
      });
    });
  },

  bindEvents() {
    document.addEventListener('click', (event) => {
      const authRequiredTrigger = event.target.closest('[data-require-auth]');
      if (authRequiredTrigger) {
        if (!this.state.user) {
          event.preventDefault();
          event.stopPropagation();
          this.showLoginGateModal();
          return;
        }

        if (authRequiredTrigger.getAttribute('data-require-auth') === 'favorite') {
          event.preventDefault();
          event.stopPropagation();
          this.toggleFavoriteState(authRequiredTrigger);
        }
        return;
      }

      const protectedLink = event.target.closest('a[href="profile.html"], a[href="./profile.html"], a[href="/profile.html"], a[href="edit-profile.html"], a[href="./edit-profile.html"], a[href="/edit-profile.html"]');
      if (protectedLink) {
        if (!this.state.user) {
          event.preventDefault();
          this.showLoginGateModal();
        }
        return;
      }

      const dropdownToggle = event.target.closest('[data-auth-menu-toggle]');
      if (dropdownToggle) {
        event.preventDefault();
        this.toggleUserMenu();
        return;
      }

      if (!event.target.closest('[data-auth-menu-toggle]') && !event.target.closest('[data-auth-menu]')) {
        this.closeUserMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeUserMenu();
        this.hideLoginGateModal();
      }
    });
  },

  bindAuthPageForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
          const lang = window.LanguageManager || (typeof LanguageManager !== 'undefined' ? LanguageManager : null);
          const msg = lang ? lang.get('auth_validation_fill_login') : 'Please enter your email and password.';
          this.showMessage('error', msg);
          return;
        }

        this.login(email, password);
      });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const confirm = document.getElementById('signup-confirm').value.trim();
        
        const lang = window.LanguageManager || (typeof LanguageManager !== 'undefined' ? LanguageManager : null);

        if (!name || !email || !password || !confirm) {
          this.showMessage('error', lang ? lang.get('auth_validation_fill_signup') : 'Please fill in all required fields.');
          return;
        }

        if (password !== confirm) {
          this.showMessage('error', lang ? lang.get('auth_validation_passwords_match') : 'Passwords do not match.');
          return;
        }
        
        if (password.length < 6) {
          this.showMessage('error', lang ? lang.get('auth_error_weak_password') : 'Password should be at least 6 characters.');
          return;
        }

        this.login(email, password, name);
      });
    }
  },

  restoreSession() {
    const savedUser = localStorage.getItem('readora_user');
    if (savedUser) {
      try {
        this.state.user = JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem('readora_user');
      }
    }
  },

  login(email, password, name = null) {
    const normalizedEmail = email.toLowerCase();
    
    // Check global db
    let usersDb = JSON.parse(localStorage.getItem('readora_users_db') || '{}');
    
    let user = usersDb[normalizedEmail];
    
    if (!user) {
      const displayName = name || (normalizedEmail.split('@')[0].replace(/[._-]/g, ' '));
      user = {
        id: 'user-' + Date.now(),
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: normalizedEmail,
        password,
        avatar: 'https://picsum.photos/seed/readora-user/200/200',
        bio: 'قارئ شغوف | عضو منذ 2026',
        stats: {
          chapters: 124,
          completed: 12,
          hours: 45
        },
        favorites: [],
        progress: {}
      };
      usersDb[normalizedEmail] = user;
      localStorage.setItem('readora_users_db', JSON.stringify(usersDb));
    } else {
      // Update password if logging in again? We can ignore for fake login
    }

    localStorage.setItem('readora_user', JSON.stringify(user));
    
    // Set active favorites and progress for the app
    localStorage.setItem('readora_favorites', JSON.stringify(user.favorites || []));
    localStorage.setItem('readora_progress', JSON.stringify(user.progress || {}));
    
    this.state.user = user;
    this.clearMessage();
    this.renderAuthUI();
    window.location.href = 'index.html';
  },

  logout() {
    // Before logging out, sync current favorites/progress back to DB
    if (this.state.user) {
      let usersDb = JSON.parse(localStorage.getItem('readora_users_db') || '{}');
      if (usersDb[this.state.user.email]) {
        usersDb[this.state.user.email].favorites = JSON.parse(localStorage.getItem('readora_favorites') || '[]');
        usersDb[this.state.user.email].progress = JSON.parse(localStorage.getItem('readora_progress') || '{}');
        localStorage.setItem('readora_users_db', JSON.stringify(usersDb));
      }
    }

    localStorage.removeItem('readora_user');
    localStorage.removeItem('readora_profile_state');
    localStorage.removeItem('readora_profile_updated');
    
    // Clear app data for guest mode
    localStorage.setItem('readora_favorites', JSON.stringify([]));
    localStorage.setItem('readora_progress', JSON.stringify({}));

    this.state.user = null;
    this.renderAuthUI();
    window.location.href = 'index.html';
  },

  renderAuthUI() {
    const target = document.getElementById('auth-header-slot');
    if (!target) return;

    const lang = window.LanguageManager || (typeof LanguageManager !== 'undefined' ? LanguageManager : null);
    const user = this.state.user;

    if (!user) {
      target.innerHTML = `
        <a href="login.html" class="btn btn-primary auth-login-btn" style="padding: 0.5rem 1rem;">
          <i class="ph ph-sign-in"></i>
          <span data-i18n="auth_login_link">Login</span>
        </a>
      `;
    } else {
      target.innerHTML = `
        <div style="position: relative; display: flex; align-items: center;">
          <button type="button" class="btn-icon" data-auth-menu-toggle style="padding: 0; border: 2px solid var(--accent-primary); overflow: hidden; width: 38px; height: 38px;">
            <img src="${user.avatar || 'https://picsum.photos/seed/avatar/200/200'}" alt="User" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
          </button>
          <div id="readora-user-menu" class="lang-dropdown" style="min-width: 180px; padding: 0.5rem;">
            <div style="padding: 0.5rem; text-align: center; border-bottom: 1px solid var(--glass-border); margin-bottom: 0.5rem;">
              <strong style="display: block; font-size: 0.95rem; color: var(--text-primary);">${user.name || 'User'}</strong>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">${user.email}</span>
            </div>
            <a href="profile.html" class="lang-option" style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-start;"><i class="ph ph-user"></i> <span data-i18n="nav_profile">Profile</span></a>
            <a href="favorites.html" class="lang-option" style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-start;"><i class="ph ph-heart"></i> <span data-i18n="nav_favorites">Favorites</span></a>
            <button type="button" class="lang-option" style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-start; color: var(--danger); width: 100%; margin-top: 0.25rem;" onclick="AuthManager.logout()"><i class="ph ph-sign-out"></i> <span data-i18n="auth_logout">Logout</span></button>
          </div>
        </div>
      `;
    }

    if (lang && lang.translatePage) {
      lang.translatePage();
    }
    
    // Call App.initNavLoginOverflow if available to handle mobile layout
    if (window.App && typeof window.App.initNavLoginOverflow === 'function') {
      window.App.initNavLoginOverflow();
    }

    this.renderProfilePage();
  },

  toggleUserMenu() {
    const menu = document.getElementById('readora-user-menu');
    if (!menu) return;
    menu.classList.toggle('open');
  },

  closeUserMenu() {
    const menu = document.getElementById('readora-user-menu');
    if (menu) {
      menu.classList.remove('open');
    }
  },

  injectModalStyles() {
    if (document.getElementById('readora-auth-gate-style')) return;

    const style = document.createElement('style');
    style.id = 'readora-auth-gate-style';
    style.textContent = `
      .auth-gate-backdrop {
        position: fixed;
        inset: 0;
        background: var(--body-overlay-start);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25rem;
        z-index: 2000;
      }

      .auth-gate-modal {
        width: min(100%, 420px);
        border-radius: var(--radius-xl, 24px);
        padding: 2rem;
        text-align: center;
      }

      .auth-gate-modal i {
        font-size: 3rem;
        color: var(--accent-primary);
        margin-bottom: 1rem;
      }

      .auth-gate-modal h3 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
      }

      .auth-gate-modal p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .auth-gate-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .auth-gate-actions .btn {
        min-width: 120px;
      }
    `;
    document.head.appendChild(style);
  },

  showLoginGateModal(options = {}) {
    if (document.getElementById('readora-auth-gate')) {
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'readora-auth-gate';
    backdrop.className = 'auth-gate-backdrop fade-in';
    
    const titleKey = options.titleKey || 'auth_login';
    const messageKey = options.messageKey || 'auth_login_subtitle';
    const primaryLabelKey = options.primaryLabelKey || 'auth_login_link';
    const secondaryLabelKey = options.secondaryLabelKey || 'cancel';
    const redirectTo = options.redirectTo || 'login.html';

    const lang = window.LanguageManager || (typeof LanguageManager !== 'undefined' ? LanguageManager : null);

    backdrop.innerHTML = `
      <div class="auth-gate-modal glass-card" role="dialog" aria-modal="true" aria-labelledby="auth-gate-title">
        <i class="ph ph-lock-key"></i>
        <h3 id="auth-gate-title" data-i18n="${titleKey}">${lang ? lang.get(titleKey) : 'Login'}</h3>
        <p data-i18n="${messageKey}">${lang ? lang.get(messageKey) : 'Sign in to continue.'}</p>
        <div class="auth-gate-actions">
          <a href="${redirectTo}" class="btn btn-primary" data-auth-gate-login data-i18n="${primaryLabelKey}">${lang ? lang.get(primaryLabelKey) : 'Login'}</a>
          <button type="button" class="btn btn-secondary" data-auth-gate-cancel data-i18n="${secondaryLabelKey}">${lang ? lang.get(secondaryLabelKey) : 'Cancel'}</button>
        </div>
      </div>
    `;

    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        this.hideLoginGateModal();
      }
    });

    backdrop.querySelector('[data-auth-gate-cancel]')?.addEventListener('click', () => {
      this.hideLoginGateModal();
    });

    document.body.appendChild(backdrop);
    
    if (lang && lang.translatePage) {
      lang.translatePage();
    }
  },

  hideLoginGateModal() {
    const modal = document.getElementById('readora-auth-gate');
    if (modal) {
      modal.remove();
    }
  },

  toggleFavoriteState(trigger) {
    const itemId = trigger.getAttribute('data-item-id');
    if (!itemId) return;

    const storedFavorites = JSON.parse(localStorage.getItem('readora_favorites') || '[]');
    const favorites = Array.isArray(storedFavorites) ? storedFavorites : [];
    const isFavorite = favorites.includes(itemId);
    const nextFavorites = isFavorite
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];

    localStorage.setItem('readora_favorites', JSON.stringify(nextFavorites));

    // Update user state and DB
    if (this.state.user) {
      this.state.user.favorites = nextFavorites;
      localStorage.setItem('readora_user', JSON.stringify(this.state.user));
      let usersDb = JSON.parse(localStorage.getItem('readora_users_db') || '{}');
      if (usersDb[this.state.user.email]) {
        usersDb[this.state.user.email].favorites = nextFavorites;
        localStorage.setItem('readora_users_db', JSON.stringify(usersDb));
      }
    }

    const icon = trigger.querySelector('i');
    if (icon) {
      const isActive = !isFavorite;
      icon.classList.toggle('ph-fill', isActive);
      icon.classList.toggle('ph', !isActive);
      icon.style.color = isActive ? 'var(--danger)' : '';
    }

    const label = trigger.querySelector('span');
    if (label) {
      label.textContent = isFavorite ? 'Add to Favorites' : 'Remove from Favorites';
    }

    const event = new Event('favoritesUpdated');
    document.dispatchEvent(event);
    
    // Show Toast
    if (window.App && typeof window.App.showToast === 'function') {
        const lang = window.LanguageManager || (typeof LanguageManager !== 'undefined' ? LanguageManager : null);
        const msg = !isFavorite ? (lang ? lang.get('fav_added') : 'Added to favorites') : (lang ? lang.get('fav_removed') : 'Removed from favorites');
        window.App.showToast(msg);
    }
  },

  renderProfilePage() {
    const user = this.state.user || this.getStoredUser();
    const displayName = document.getElementById('profile-display-name');
    const displayBio = document.getElementById('profile-display-bio');
    const displayEmail = document.getElementById('profile-display-email');
    const displayAvatar = document.getElementById('profile-display-avatar');
    const chaptersValue = document.getElementById('profile-stat-chapters');
    const completedValue = document.getElementById('profile-stat-completed');
    const hoursValue = document.getElementById('profile-stat-hours');
    const logoutButton = document.getElementById('profile-logout-btn');

    if (displayName && user) {
      displayName.textContent = user.name || user.displayName || user.fullName || 'Readora User';
    }

    if (displayBio && user) {
      displayBio.textContent = user.bio || 'قارئ شغوف | عضو منذ 2026';
    }

    if (displayEmail && user) {
      displayEmail.textContent = user.email || 'demo@example.com';
    }

    if (displayAvatar && user) {
      displayAvatar.src = user.avatar || 'https://picsum.photos/seed/avatar/200/200';
      displayAvatar.alt = user.name || user.email || 'User avatar';
    }

    if (chaptersValue && user) {
      chaptersValue.textContent = user.stats?.chapters || 124;
    }

    if (completedValue && user) {
      completedValue.textContent = user.stats?.completed || 12;
    }

    if (hoursValue && user) {
      hoursValue.textContent = user.stats?.hours || 45;
    }

    if (logoutButton) {
      logoutButton.onclick = () => this.logout();
    }
  },

  getStoredUser() {
    try {
      const savedUser = localStorage.getItem('readora_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  },

  isAuthPage() {
    return window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');
  },

  isProfilePage() {
    return window.location.pathname.includes('profile.html');
  },

  showMessage(type, message) {
    const messageBox = document.getElementById('auth-message');
    if (!messageBox) return;
    messageBox.className = `auth-message ${type}`;
    messageBox.textContent = message;
  },

  clearMessage() {
    const messageBox = document.getElementById('auth-message');
    if (messageBox) {
      messageBox.textContent = '';
      messageBox.className = 'auth-message';
    }
  }
};

window.AuthManager = AuthManager;

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
});
