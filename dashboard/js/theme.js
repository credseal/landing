/**
 * Theme Toggle - Dark/Light Mode Support
 * Supports system preference detection and persistent storage
 */

const Theme = {
  STORAGE_KEY: 'credseal-theme',

  // Initialize theme on page load
  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Priority: saved preference > system preference > default (dark)
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.set(theme, false);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.set(e.matches ? 'dark' : 'light', false);
      }
    });

    // Add theme toggle button to all pages
    this.addToggleButton();
  },

  // Set theme
  set(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);

    if (save) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }

    // Update toggle button icon
    this.updateToggleIcon(theme);
  },

  // Toggle between light and dark
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.set(next);

    // Show notification
    this.showThemeNotification(next);
  },

  // Get current theme
  get() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  // Add toggle button to header
  addToggleButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    // Check if button already exists
    if (document.getElementById('theme-toggle')) return;

    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'btn-icon';
    button.title = 'Toggle theme';
    button.onclick = () => Theme.toggle();
    button.innerHTML = this.getIcon(this.get());

    // Insert at the beginning of header actions
    headerActions.insertBefore(button, headerActions.firstChild);
  },

  // Update toggle button icon
  updateToggleIcon(theme) {
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.innerHTML = this.getIcon(theme);
    }
  },

  // Get icon for theme
  getIcon(theme) {
    if (theme === 'dark') {
      // Sun icon for dark mode (click to switch to light)
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`;
    } else {
      // Moon icon for light mode (click to switch to dark)
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;
    }
  },

  // Show theme change notification
  showThemeNotification(theme) {
    const existing = document.querySelector('.theme-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `
      ${this.getIcon(theme)}
      <span>${theme === 'dark' ? 'Dark' : 'Light'} mode enabled</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
};

// Mobile Navigation
const MobileNav = {
  init() {
    this.addHamburgerButton();
    this.addOverlay();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
  },

  addHamburgerButton() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    // Check if button already exists
    if (document.getElementById('mobile-menu-btn')) return;

    const button = document.createElement('button');
    button.id = 'mobile-menu-btn';
    button.className = 'btn-icon mobile-menu-btn';
    button.title = 'Menu';
    button.onclick = () => this.toggle();
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    `;

    // Insert at the beginning of header
    const headerLeft = header.querySelector('.header-left');
    if (headerLeft) {
      headerLeft.insertBefore(button, headerLeft.firstChild);
    }
  },

  addOverlay() {
    if (document.getElementById('sidebar-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className = 'sidebar-overlay';
    overlay.onclick = () => this.close();
    document.body.appendChild(overlay);
  },

  toggle() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar.classList.contains('mobile-open')) {
      this.close();
    } else {
      sidebar.classList.add('mobile-open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  handleResize() {
    if (window.innerWidth > 768) {
      this.close();
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  MobileNav.init();
});

// Also run immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  Theme.init();
  MobileNav.init();
}
