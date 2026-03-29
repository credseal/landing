/**
 * CredSeal Error Boundary System
 * Global error handling with UI fallbacks and reporting
 */

(function(global) {
  'use strict';

  class ErrorBoundary {
    constructor(config = {}) {
      this.isDev = config.isDev !== false;
      this.reportingURL = config.reportingURL; // Optional Sentry-like endpoint
      this.handlers = [];
      this._errorLog = [];
      this._maxErrorLog = 50;

      this._setupGlobalHandlers();
      this._injectErrorUI();
    }

    /**
     * Setup global error handlers
     */
    _setupGlobalHandlers() {
      // Unhandled errors
      window.addEventListener('error', (e) => {
        this._handleError(e.error || new Error(e.message), {
          type: 'uncaught',
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        });
      });

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (e) => {
        this._handleError(e.reason || new Error('Unhandled Promise Rejection'), {
          type: 'unhandledRejection'
        });
      });
    }

    /**
     * Handle error and log it
     */
    _handleError(error, context = {}) {
      const errorInfo = {
        message: error.message || String(error),
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      };

      this._errorLog.push(errorInfo);
      if (this._errorLog.length > this._maxErrorLog) {
        this._errorLog.shift();
      }

      // Log to console in dev
      if (this.isDev) {
        console.error('[ErrorBoundary]', errorInfo);
      }

      // Report to backend (if configured)
      if (this.reportingURL) {
        this._reportError(errorInfo);
      }

      // Call registered handlers
      this.handlers.forEach(handler => {
        try {
          handler(error, errorInfo);
        } catch (handlerError) {
          console.error('[ErrorBoundary] Handler error:', handlerError);
        }
      });
    }

    /**
     * Report error to backend
     */
    async _reportError(errorInfo) {
      try {
        await fetch(this.reportingURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo),
          credentials: 'include'
        });
      } catch (error) {
        if (this.isDev) {
          console.warn('[ErrorBoundary] Failed to report error:', error);
        }
      }
    }

    /**
     * Register error handler callback
     */
    onError(handler) {
      this.handlers.push(handler);
    }

    /**
     * Get error log
     */
    getErrorLog() {
      return [...this._errorLog];
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
      this._errorLog = [];
    }

    /**
     * Create error UI container
     */
    _injectErrorUI() {
      const container = document.createElement('div');
      container.id = 'error-boundary-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        z-index: 99999;
        background: rgba(0,0,0,0.8);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;

      container.innerHTML = `
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 8px;
          padding: 32px;
          max-width: 600px;
          width: 90%;
          box-shadow: 0 20px 25px rgba(0,0,0,0.15);
        ">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="
              width: 60px;
              height: 60px;
              margin: 0 auto 16px;
              background: #fee2e2;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #dc2626;
            ">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2 style="margin: 0 0 8px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
              Something went wrong
            </h2>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              We encountered an unexpected error. Try reloading the page.
            </p>
          </div>

          <div id="error-details-section" style="margin: 24px 0; display: none;">
            <details style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
              <summary style="cursor: pointer; color: #374151; font-weight: 500; font-size: 13px; user-select: none;">
                Error Details
              </summary>
              <pre id="error-details" style="
                margin: 12px 0 0 0;
                padding: 12px;
                background: #fff;
                border-radius: 4px;
                overflow-x: auto;
                font-size: 11px;
                color: #6b7280;
                line-height: 1.4;
              "></pre>
            </details>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="error-retry" style="
              padding: 10px 24px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              Try Again
            </button>
            <button id="error-dismiss" style="
              padding: 10px 24px;
              background: #e5e7eb;
              color: #374151;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#d1d5db'" onmouseout="this.style.background='#e5e7eb'">
              Dismiss
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      this._errorContainer = container;
    }

    /**
     * Show error UI
     */
    showError(message, error = null, onRetry = null) {
      const container = this._errorContainer;
      if (!container) return;

      const detailsSection = container.querySelector('#error-details-section');
      const detailsContent = container.querySelector('#error-details');
      const retryBtn = container.querySelector('#error-retry');
      const dismissBtn = container.querySelector('#error-dismiss');

      // Update message
      container.querySelector('p').textContent = message;

      // Show error details if provided
      if (error && this.isDev) {
        detailsSection.style.display = 'block';
        detailsContent.textContent = error.stack || String(error);
      } else {
        detailsSection.style.display = 'none';
      }

      // Setup retry button
      retryBtn.onclick = () => {
        this.hideError();
        if (onRetry) {
          onRetry();
        } else {
          window.location.reload();
        }
      };

      // Setup dismiss button
      dismissBtn.onclick = () => {
        this.hideError();
      };

      // Show container
      container.style.display = 'flex';
    }

    /**
     * Hide error UI
     */
    hideError() {
      const container = this._errorContainer;
      if (container) {
        container.style.display = 'none';
      }
    }
  }

  /**
   * Wrap a function in error boundary
   */
  function withErrorBoundary(fn, onError = null) {
    return function(...args) {
      try {
        const result = fn.apply(this, args);

        if (result instanceof Promise) {
          return result.catch(error => {
            if (onError) onError(error);
            throw error;
          });
        }

        return result;
      } catch (error) {
        if (onError) onError(error);
        throw error;
      }
    };
  }

  /**
   * Wrap async function in error boundary
   */
  async function withAsyncErrorBoundary(fn, onError = null) {
    try {
      return await fn();
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  }

  /**
   * Create a module-level error boundary
   */
  class ModuleErrorBoundary {
    constructor(moduleName, errorBoundary) {
      this.moduleName = moduleName;
      this.errorBoundary = errorBoundary;
      this.isHealthy = true;
    }

    async execute(fn, fallback = null) {
      try {
        this.isHealthy = true;
        return await fn();
      } catch (error) {
        this.isHealthy = false;

        this.errorBoundary._handleError(error, {
          type: 'moduleError',
          module: this.moduleName
        });

        // Return fallback value if provided
        if (fallback !== null) {
          return fallback;
        }

        throw error;
      }
    }

    wrap(fn) {
      return async (...args) => {
        return this.execute(() => fn(...args));
      };
    }
  }

  // Global singleton
  let globalErrorBoundary = null;

  function getErrorBoundary(config) {
    if (!globalErrorBoundary) {
      globalErrorBoundary = new ErrorBoundary(config);
    }
    return globalErrorBoundary;
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getErrorBoundary({ isDev: true });
    });
  } else {
    getErrorBoundary({ isDev: true });
  }

  // Export to global scope
  global.ErrorBoundary = ErrorBoundary;
  global.ModuleErrorBoundary = ModuleErrorBoundary;
  global.getErrorBoundary = getErrorBoundary;
  global.withErrorBoundary = withErrorBoundary;
  global.withAsyncErrorBoundary = withAsyncErrorBoundary;

})(window);
