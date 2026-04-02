/**
 * IdentArk Auth State Management
 * Handles authentication, token expiry, and session management
 */

(function(global) {
  'use strict';

  class AuthState {
    constructor(config = {}) {
      this.apiClient = config.apiClient || getAPIClient();
      this.loginURL = config.loginURL || '/login.html';
      this.dashboardURL = config.dashboardURL || '/dashboard/index.html';
      this.keepaliveInterval = config.keepaliveInterval || 5 * 60 * 1000; // 5 minutes
      this.tokenExpiryBuffer = config.tokenExpiryBuffer || 60 * 1000; // 1 minute

      this._user = null;
      this._org = null;
      this._isAuthenticated = false;
      this._keepaliveTimer = null;
      this._tokenExpireTimer = null;
      this._storageListeners = [];

      // Listen for changes in other tabs
      window.addEventListener('storage', (e) => this._onStorageChange(e));
    }

    /**
     * Initialize auth on page load
     */
    async init() {
      try {
        // Check if token exists
        const token = this.apiClient.getToken();
        if (!token) {
          this._redirectToLogin('no-token');
          return;
        }

        // Fetch current user
        const userData = await this.apiClient.getMe();
        this._setUser(userData.user);
        this._setOrg(userData.org);

        this._setupTokenExpiry(userData);
        this._setupKeepalive();
        this._isAuthenticated = true;

        // Notify listeners
        this._notifyAuthStateChange();
      } catch (error) {
        console.warn('[AuthState] Init failed:', error);

        // Check if error is auth-related
        if (error instanceof APIError && error.isUnauthorized()) {
          this._redirectToLogin('unauthorized');
        } else {
          // Show error but don't redirect (in case of network issues)
          console.error('[AuthState] Failed to fetch user:', error);
        }
      }
    }

    /**
     * Set current user
     */
    _setUser(user) {
      this._user = user;
      localStorage.setItem('identark_user', JSON.stringify(user));
    }

    /**
     * Get current user
     */
    getUser() {
      if (!this._user) {
        const stored = localStorage.getItem('identark_user');
        if (stored) {
          try {
            this._user = JSON.parse(stored);
          } catch (e) {
            console.warn('Failed to parse stored user');
          }
        }
      }
      return this._user;
    }

    /**
     * Set current org
     */
    _setOrg(org) {
      this._org = org;
      localStorage.setItem('identark_org', JSON.stringify(org));
    }

    /**
     * Get current org
     */
    getOrg() {
      if (!this._org) {
        const stored = localStorage.getItem('identark_org');
        if (stored) {
          try {
            this._org = JSON.parse(stored);
          } catch (e) {
            console.warn('Failed to parse stored org');
          }
        }
      }
      return this._org;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
      return this._isAuthenticated && !!this.apiClient.getToken();
    }

    /**
     * Setup token expiry detection
     */
    _setupTokenExpiry(userData) {
      // Clear existing timer
      if (this._tokenExpireTimer) {
        clearTimeout(this._tokenExpireTimer);
      }

      // If we have expiry info from server, use it
      if (userData.expires_at) {
        const expiresAt = new Date(userData.expires_at).getTime();
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now - this.tokenExpiryBuffer;

        if (timeUntilExpiry > 0) {
          this._tokenExpireTimer = setTimeout(() => {
            this._onTokenExpiry();
          }, timeUntilExpiry);
        } else {
          // Token already expired
          this._onTokenExpiry();
        }
      }
    }

    /**
     * Setup session keepalive ping
     */
    _setupKeepalive() {
      if (this._keepaliveTimer) {
        clearInterval(this._keepaliveTimer);
      }

      this._keepaliveTimer = setInterval(async () => {
        try {
          await this.apiClient.getMe();
        } catch (error) {
          console.warn('[AuthState] Keepalive failed:', error);

          if (error instanceof APIError && error.isUnauthorized()) {
            this._onTokenExpiry();
          }
        }
      }, this.keepaliveInterval);
    }

    /**
     * Handle token expiry
     */
    _onTokenExpiry() {
      console.warn('[AuthState] Token expired');
      this._cleanup();
      this._redirectToLogin('expired');
    }

    /**
     * Perform logout
     */
    async logout() {
      try {
        await this.apiClient.logout();
      } catch (error) {
        console.warn('[AuthState] Logout request failed:', error);
      } finally {
        this._cleanup();
        this._redirectToLogin('logout');
      }
    }

    /**
     * Cleanup timers and state
     */
    _cleanup() {
      if (this._keepaliveTimer) {
        clearInterval(this._keepaliveTimer);
        this._keepaliveTimer = null;
      }

      if (this._tokenExpireTimer) {
        clearTimeout(this._tokenExpireTimer);
        this._tokenExpireTimer = null;
      }

      this._isAuthenticated = false;
      this._user = null;
      this._org = null;

      // Clear stored data
      localStorage.removeItem('identark_access_token');
      localStorage.removeItem('identark_user');
      localStorage.removeItem('identark_org');
    }

    /**
     * Redirect to login page
     */
    _redirectToLogin(reason) {
      const url = new URL(this.loginURL, window.location.origin);
      if (reason) {
        url.searchParams.set('reason', reason);
        url.searchParams.set('returnTo', window.location.href);
      }
      window.location.href = url.toString();
    }

    /**
     * Handle storage changes (from other tabs)
     */
    _onStorageChange(event) {
      if (event.key === 'identark_access_token') {
        if (!event.newValue) {
          // Token was cleared in another tab
          this._cleanup();
          this._redirectToLogin('logout-other-tab');
        }
      }
    }

    /**
     * Notify auth state change listeners
     */
    _notifyAuthStateChange() {
      const event = new CustomEvent('auth:stateChange', {
        detail: {
          isAuthenticated: this._isAuthenticated,
          user: this._user,
          org: this._org
        }
      });
      window.dispatchEvent(event);
    }

    /**
     * Register auth state change listener
     */
    onStateChange(callback) {
      this._storageListeners.push(callback);
      window.addEventListener('auth:stateChange', (e) => {
        callback(e.detail);
      });
    }
  }

  // Global singleton
  let authStateInstance = null;

  function getAuthState(config) {
    if (!authStateInstance) {
      authStateInstance = new AuthState(config);
    }
    return authStateInstance;
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getAuthState().init();
    });
  } else {
    getAuthState().init();
  }

  // Export to global scope
  global.AuthState = AuthState;
  global.getAuthState = getAuthState;

})(window);
