/**
 * IdentArk Dashboard - Core JavaScript
 * Handles UI interactions, state management, and API calls
 */

(function() {
  'use strict';

  // ────────────────────────────────────────────────────────────────────────────
  // Configuration
  // ────────────────────────────────────────────────────────────────────────────

  const CONFIG = {
    apiBase: 'https://identark-cloud.fly.dev/v1',
    toastDuration: 4000,
    storageKeys: {
      sidebarCollapsed: 'identark_sidebar_collapsed',
      welcomeDismissed: 'identark_welcome_dismissed',
      theme: 'identark_theme'
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────────────────────────────────

  const state = {
    user: null,
    org: null,
    isLoading: false
  };

  // ────────────────────────────────────────────────────────────────────────────
  // DOM Ready
  // ────────────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initSidebar();
    initUserMenu();
    initWelcomeBanner();
    initModals();
    initToasts();
    initForms();
    initTables();
    initClipboard();
    initKeyboardNav();
    initServiceWorker();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Sidebar
  // ────────────────────────────────────────────────────────────────────────────

  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    if (!sidebar) return;

    // Mobile menu toggle
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !mobileMenuBtn?.contains(e.target)) {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
      }
    });

    // Restore collapsed state
    const isCollapsed = localStorage.getItem(CONFIG.storageKeys.sidebarCollapsed) === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // User Menu
  // ────────────────────────────────────────────────────────────────────────────

  function initUserMenu() {
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (!userMenuBtn || !userDropdown) return;

    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userDropdown.classList.remove('open');
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        userDropdown.classList.remove('open');
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Welcome Banner
  // ────────────────────────────────────────────────────────────────────────────

  function initWelcomeBanner() {
    const banner = document.getElementById('welcome-banner');
    const closeBtn = document.getElementById('welcome-close');

    if (!banner) return;

    // Check if dismissed
    const isDismissed = localStorage.getItem(CONFIG.storageKeys.welcomeDismissed) === 'true';
    if (isDismissed) {
      banner.style.display = 'none';
      return;
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        localStorage.setItem(CONFIG.storageKeys.welcomeDismissed, 'true');
      });
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Modals
  // ────────────────────────────────────────────────────────────────────────────

  function initModals() {
    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    // Close modal on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.open');
        if (openModal) {
          closeModal(openModal.id);
        }
      }
    });

    // Close buttons
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Focus first input
      const firstInput = modal.querySelector('input, textarea, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Toasts
  // ────────────────────────────────────────────────────────────────────────────

  let toastContainer = null;

  function initToasts() {
    // Create toast container if it doesn't exist
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }

  function showToast(message, type = 'info') {
    if (!toastContainer) initToasts();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
      <button class="toast-close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      removeToast(toast);
    });

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      removeToast(toast);
    }, CONFIG.toastDuration);

    return toast;
  }

  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 200);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Forms
  // ────────────────────────────────────────────────────────────────────────────

  function initForms() {
    // Handle form submissions
    document.querySelectorAll('form[data-ajax]').forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });

    // Password visibility toggles
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (input && input.type === 'password') {
          input.type = 'text';
          btn.classList.add('visible');
        } else if (input) {
          input.type = 'password';
          btn.classList.remove('visible');
        }
      });
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Loading...';
    }

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const action = form.action || form.dataset.action;
      const method = form.method?.toUpperCase() || 'POST';

      const response = await fetch(action, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Request failed');
      }

      // Handle success
      if (form.dataset.successRedirect) {
        window.location.href = form.dataset.successRedirect;
      } else if (form.dataset.successMessage) {
        showToast(form.dataset.successMessage, 'success');
        form.reset();
      } else {
        showToast('Success!', 'success');
      }

      // Dispatch custom event
      form.dispatchEvent(new CustomEvent('form:success', { detail: result }));

    } catch (error) {
      showToast(error.message, 'error');
      form.dispatchEvent(new CustomEvent('form:error', { detail: error }));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Tables
  // ────────────────────────────────────────────────────────────────────────────

  function initTables() {
    // Sortable table headers
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        const column = th.dataset.sort;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = th.classList.contains('sort-asc');

        // Reset all headers
        table.querySelectorAll('th[data-sort]').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });

        // Sort rows
        rows.sort((a, b) => {
          const aVal = a.querySelector(`td:nth-child(${th.cellIndex + 1})`)?.textContent || '';
          const bVal = b.querySelector(`td:nth-child(${th.cellIndex + 1})`)?.textContent || '';
          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        // Update header
        th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

        // Re-append rows
        rows.forEach(row => tbody.appendChild(row));
      });
    });

    // Row selection
    document.querySelectorAll('table[data-selectable]').forEach(table => {
      const selectAll = table.querySelector('th input[type="checkbox"]');
      const checkboxes = table.querySelectorAll('td input[type="checkbox"]');

      if (selectAll) {
        selectAll.addEventListener('change', () => {
          checkboxes.forEach(cb => {
            cb.checked = selectAll.checked;
            cb.closest('tr').classList.toggle('selected', selectAll.checked);
          });
        });
      }

      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          cb.closest('tr').classList.toggle('selected', cb.checked);

          if (selectAll) {
            const allChecked = Array.from(checkboxes).every(c => c.checked);
            const someChecked = Array.from(checkboxes).some(c => c.checked);
            selectAll.checked = allChecked;
            selectAll.indeterminate = someChecked && !allChecked;
          }
        });
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Clipboard
  // ────────────────────────────────────────────────────────────────────────────

  function initClipboard() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy || btn.previousElementSibling?.textContent;

        if (!text) return;

        try {
          await navigator.clipboard.writeText(text.trim());

          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
          btn.classList.add('copied');

          setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.classList.remove('copied');
          }, 2000);

        } catch (err) {
          showToast('Failed to copy', 'error');
        }
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Utilities
  // ────────────────────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;

    return d.toLocaleDateString();
  }

  function debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // API Helpers
  // ────────────────────────────────────────────────────────────────────────────

  async function api(endpoint, options = {}) {
    const url = `${CONFIG.apiBase}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation Detection
  // ────────────────────────────────────────────────────────────────────────────

  function initKeyboardNav() {
    // Detect keyboard vs mouse navigation for focus styles
    document.body.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (window.CommandPalette) {
          CommandPalette.open();
        }
      }

      // Escape to close modals/menus
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.active, .modal.open');
        if (openModal) {
          closeModal(openModal.id);
        }
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Service Worker Registration
  // ────────────────────────────────────────────────────────────────────────────

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/dashboard/sw.js', {
            scope: '/dashboard/'
          });

          console.log('[IdentArk] Service Worker registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Every hour

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('New version available. Refresh to update.', 'info');
              }
            });
          });

        } catch (error) {
          console.warn('[IdentArk] Service Worker registration failed:', error);
        }
      });
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Loading States
  // ────────────────────────────────────────────────────────────────────────────

  function showLoading(element) {
    if (!element) return;
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
  }

  function hideLoading(element) {
    if (!element) return;
    element.classList.remove('loading');
    element.setAttribute('aria-busy', 'false');
  }

  function createSkeleton(type = 'text', count = 1) {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = `skeleton skeleton-${type}`;
      skeletons.push(el);
    }
    return skeletons;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Expose Public API
  // ────────────────────────────────────────────────────────────────────────────

  window.IdentArk = {
    openModal,
    closeModal,
    showToast,
    showLoading,
    hideLoading,
    createSkeleton,
    api,
    formatDate,
    escapeHtml,
    debounce,
    state
  };

})();
