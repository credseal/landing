/**
 * IdentArk Loading States & Skeleton UI
 * Handles loading spinners, skeleton screens, empty states, and error states
 */

(function(global) {
  'use strict';

  class LoadingStateManager {
    constructor() {
      this._globalLoading = false;
      this._listeners = new Set();

      // Listen to API loading state changes
      window.addEventListener('api:loadingStateChange', (e) => {
        this._globalLoading = e.detail.isLoading;
        this._notifyListeners();
      });
    }

    onLoadingStateChange(callback) {
      this._listeners.add(callback);
      return () => this._listeners.delete(callback);
    }

    _notifyListeners() {
      this._listeners.forEach(cb => cb(this._globalLoading));
    }

    isLoading() {
      return this._globalLoading;
    }
  }

  /**
   * Skeleton screen templates
   */
  const SkeletonTemplates = {
    // Single line of text
    text: () => `
      <div class="skeleton skeleton-text" style="width: 80%; height: 16px; border-radius: 4px;"></div>
    `,

    // Paragraph (multiple lines)
    paragraph: (lines = 3) => `
      ${Array(lines).fill(0).map((_, i) => `
        <div class="skeleton skeleton-text" style="width: ${100 - i * 10}%; height: 16px; border-radius: 4px; margin-bottom: ${i < lines - 1 ? '8px' : '0'};"></div>
      `).join('')}
    `,

    // Avatar
    avatar: (size = 40) => `
      <div class="skeleton skeleton-circle" style="width: ${size}px; height: ${size}px; border-radius: 50%;"></div>
    `,

    // Card
    card: () => `
      <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div class="skeleton skeleton-circle" style="width: 40px; height: 40px; border-radius: 50%;"></div>
          <div style="flex: 1;">
            <div class="skeleton skeleton-text" style="width: 60%; height: 16px; border-radius: 4px; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text" style="width: 80%; height: 12px; border-radius: 4px;"></div>
          </div>
        </div>
        <div class="skeleton skeleton-text" style="width: 100%; height: 12px; border-radius: 4px; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="width: 100%; height: 12px; border-radius: 4px;"></div>
      </div>
    `,

    // Table row
    tableRow: (columns = 4) => `
      <tr>
        ${Array(columns).fill(0).map(() => `
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div class="skeleton skeleton-text" style="width: 80%; height: 16px; border-radius: 4px;"></div>
          </td>
        `).join('')}
      </tr>
    `,

    // Button
    button: () => `
      <div class="skeleton skeleton-text" style="width: 120px; height: 40px; border-radius: 6px;"></div>
    `,

    // Grid item
    gridItem: () => `
      <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div class="skeleton skeleton-text" style="width: 100%; height: 80px; border-radius: 6px; margin-bottom: 12px;"></div>
        <div class="skeleton skeleton-text" style="width: 80%; height: 16px; border-radius: 4px; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="width: 100%; height: 12px; border-radius: 4px;"></div>
      </div>
    `
  };

  /**
   * UI State Manager
   */
  class UIStateManager {
    /**
     * Show skeleton screen for loading
     */
    static showSkeleton(element, type = 'text', count = 1, options = {}) {
      if (!element) return;

      const template = SkeletonTemplates[type];
      if (!template) {
        console.warn(`[LoadingStates] Unknown skeleton type: ${type}`);
        return;
      }

      const content = Array(count).fill(0).map(() => template(options.rows || options.columns)).join('');
      element.innerHTML = content;
      element.classList.add('loading');
    }

    /**
     * Show loading spinner
     */
    static showSpinner(element, message = 'Loading...') {
      if (!element) return;

      element.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 16px;
        ">
          <div class="spinner" style="
            width: 32px;
            height: 32px;
            border: 3px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          "></div>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">${message}</p>
        </div>
      `;
      element.classList.add('loading');
    }

    /**
     * Show empty state
     */
    static showEmpty(element, config = {}) {
      if (!element) return;

      const {
        icon = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>',
        title = 'No data',
        message = 'Nothing to display here',
        action = null,
        actionText = 'Get started'
      } = config;

      const actionHTML = action ? `
        <a href="${action}" class="btn btn-primary" style="margin-top: 16px;">
          ${actionText}
        </a>
      ` : '';

      element.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        ">
          <div style="
            margin-bottom: 16px;
            opacity: 0.5;
          ">
            ${icon}
          </div>
          <h3 style="
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
          ">
            ${title}
          </h3>
          <p style="
            margin: 0;
            font-size: 14px;
            max-width: 300px;
          ">
            ${message}
          </p>
          ${actionHTML}
        </div>
      `;
      element.classList.remove('loading');
    }

    /**
     * Show error state
     */
    static showError(element, config = {}) {
      if (!element) return;

      const {
        title = 'Error loading data',
        message = 'An error occurred while loading the data.',
        onRetry = null
      } = config;

      const retryHTML = onRetry ? `
        <button onclick="this.closest('[data-error-state]').dispatchEvent(new CustomEvent('retry'))"
          style="
            margin-top: 16px;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
          ">
          Try Again
        </button>
      ` : '';

      element.setAttribute('data-error-state', 'true');
      element.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 8px;
        ">
          <div style="
            margin-bottom: 12px;
            color: #dc2626;
          ">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h3 style="
            margin: 0 0 8px 0;
            color: #dc2626;
            font-size: 16px;
            font-weight: 600;
          ">
            ${title}
          </h3>
          <p style="
            margin: 0;
            color: #7f1d1d;
            font-size: 14px;
            max-width: 300px;
          ">
            ${message}
          </p>
          ${retryHTML}
        </div>
      `;

      if (onRetry) {
        element.addEventListener('retry', onRetry);
      }

      element.classList.remove('loading');
    }

    /**
     * Hide loading state
     */
    static clear(element) {
      if (!element) return;
      element.innerHTML = '';
      element.classList.remove('loading');
      element.removeAttribute('data-error-state');
    }

    /**
     * Add loading class to element
     */
    static setLoading(element, isLoading = true) {
      if (!element) return;
      if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
      } else {
        element.classList.remove('loading');
        element.setAttribute('aria-busy', 'false');
      }
    }
  }

  /**
   * Global spinner overlay
   */
  class GlobalSpinner {
    static show(message = 'Loading...') {
      if (!GlobalSpinner._overlay) {
        GlobalSpinner._createOverlay();
      }

      GlobalSpinner._overlay.querySelector('p').textContent = message;
      GlobalSpinner._overlay.style.display = 'flex';
    }

    static hide() {
      if (GlobalSpinner._overlay) {
        GlobalSpinner._overlay.style.display = 'none';
      }
    }

    static _createOverlay() {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.5);
        z-index: 99998;
        gap: 16px;
      `;

      overlay.innerHTML = `
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <p style="
          color: white;
          font-size: 14px;
          margin: 0;
          font-weight: 500;
        "></p>
      `;

      document.body.appendChild(overlay);
      GlobalSpinner._overlay = overlay;
    }
  }

  // Add CSS animations if not already present
  if (!document.querySelector('style[data-loading-states]')) {
    const style = document.createElement('style');
    style.setAttribute('data-loading-states', 'true');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          #f3f4f6 25%,
          #e5e7eb 50%,
          #f3f4f6 75%
        );
        background-size: 1000px 100%;
        animation: shimmer 2s infinite;
      }

      .skeleton-text {
        height: 16px;
        border-radius: 4px;
      }

      .skeleton-circle {
        border-radius: 50%;
      }

      .loading {
        opacity: 0.6;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  // Export to global scope
  global.LoadingStateManager = LoadingStateManager;
  global.UIStateManager = UIStateManager;
  global.GlobalSpinner = GlobalSpinner;
  global.SkeletonTemplates = SkeletonTemplates;

  // Create global instance
  global.LoadingStates = new LoadingStateManager();

})(window);
