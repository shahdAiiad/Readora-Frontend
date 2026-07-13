const ThemeManager = {
  init() {
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.currentTheme = localStorage.getItem('readora_theme') || 'dark';
    
    this.applyTheme(this.currentTheme);

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('readora_theme', theme);
    this.currentTheme = theme;
    
    if (this.themeToggleBtn) {
      const icon = this.themeToggleBtn.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.className = 'ph ph-moon';
        } else {
          icon.className = 'ph ph-sun';
        }
      }
    }
  },

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});
