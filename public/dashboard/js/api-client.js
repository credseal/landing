/**
 * IdentArk API Client
 * Real API client module with auth, retry, and error handling
 */

(function(global) {
  'use strict';

  class APIClient {
    constructor(config = {}) {
      this.baseURL = config.baseURL || 'https://credseal-cloud.fly.dev/v1';
      this.tokenRefreshURL = config.tokenRefreshURL || (this.baseURL + '/auth/refresh');
      this.maxRetries = config.maxRetries || 3;
      this.retryDelay = config.retryDelay || 1000; // ms
      this.requestTimeout = config.requestTimeout || 30000; // ms

      this._isRefreshing = false;
      this._refreshQueue = [];
      this._loadingState = new Map();
    }

    /**
     * Get auth token from httpOnly cookie or localStorage
     */
    getToken() {
      // Try httpOnly cookie first (from browser)
      const cookieToken = this._getCookieToken();
      if (cookieToken) return cookieToken;

      // Fallback to localStorage JWT (for demo/dev)
      return localStorage.getItem('identark_access_token');
    }

    /**
     * Extract token from httpOnly cookie
     */
    _getCookieToken() {
      const match = document.cookie.match(/access_token=([^;]+)/);
      return match ? match[1] : null;
    }

    /**
     * Set auth token (for localStorage mode)
     */
    setToken(token) {
      if (token) {
        localStorage.setItem('identark_access_token', token);
      } else {
        localStorage.removeItem('identark_access_token');
      }
    }

    /**
     * Refresh auth token
     */
    async refreshToken() {
      if (this._isRefreshing) {
        return new Promise((resolve, reject) => {
          this._refreshQueue.push({ resolve, reject });
        });
      }

      this._isRefreshing = true;

      try {
        const response = await fetch(this.tokenRefreshURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        const newToken = data.access_token || data.token;

        if (newToken) {
          this.setToken(newToken);
        }

        // Resolve queued requests
        this._refreshQueue.forEach(item => item.resolve(newToken));
        this._refreshQueue = [];

        return newToken;
      } catch (error) {
        console.error('[API Client] Token refresh error:', error);
        this._refreshQueue.forEach(item => item.reject(error));
        this._refreshQueue = [];

        // Redirect to login
        window.location.href = '/login.html?expired=true';
        throw error;
      } finally {
        this._isRefreshing = false;
      }
    }

    /**
     * Make HTTP request with retry logic
     */
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const method = (options.method || 'GET').toUpperCase();
      let lastError;

      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          const response = await this._fetch(url, {
            method,
            headers: this._getHeaders(options.headers),
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'include',
            signal: this._getAbortSignal()
          });

          // Handle 401 Unauthorized
          if (response.status === 401) {
            const newToken = await this.refreshToken();
            if (attempt < this.maxRetries && newToken) {
              continue; // Retry with new token
            }
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new APIError(
              errorData.message || errorData.error || `HTTP ${response.status}`,
              response.status,
              errorData
            );

            // Don't retry on client errors
            if (response.status >= 400 && response.status < 500) {
              throw error;
            }

            lastError = error;

            if (attempt < this.maxRetries) {
              await this._delay(this.retryDelay * Math.pow(2, attempt - 1));
              continue;
            }
            throw error;
          }

          return await response.json();
        } catch (error) {
          lastError = error;

          // Don't retry timeout errors beyond max retries
          if (error instanceof APIError && error.status >= 400 && error.status < 500) {
            throw error;
          }

          if (attempt < this.maxRetries) {
            await this._delay(this.retryDelay * Math.pow(2, attempt - 1));
            continue;
          }
        }
      }

      throw lastError || new Error('Request failed after retries');
    }

    /**
     * Fetch with timeout
     */
    _fetch(url, options) {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.requestTimeout)
        )
      ]);
    }

    /**
     * Get abort signal for request cancellation
     */
    _getAbortSignal() {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), this.requestTimeout);
      return controller.signal;
    }

    /**
     * Build headers with auth
     */
    _getHeaders(customHeaders = {}) {
      const token = this.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return headers;
    }

    /**
     * Delay for exponential backoff
     */
    _delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Track loading state for UI
     */
    setLoading(key, value) {
      if (value) {
        this._loadingState.set(key, true);
      } else {
        this._loadingState.delete(key);
      }
      this._notifyLoadingStateChange();
    }

    isLoading(key) {
      return this._loadingState.has(key);
    }

    isAnyLoading() {
      return this._loadingState.size > 0;
    }

    _notifyLoadingStateChange() {
      window.dispatchEvent(new CustomEvent('api:loadingStateChange', {
        detail: { isLoading: this.isAnyLoading() }
      }));
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Credential endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getCredentials(filters = {}) {
      this.setLoading('credentials', true);
      try {
        const query = new URLSearchParams(filters).toString();
        const endpoint = `/credentials${query ? '?' + query : ''}`;
        const data = await this.request(endpoint);
        return data.credentials || [];
      } finally {
        this.setLoading('credentials', false);
      }
    }

    async createCredential(credential) {
      this.setLoading('createCredential', true);
      try {
        return await this.request('/credentials', {
          method: 'POST',
          body: credential
        });
      } finally {
        this.setLoading('createCredential', false);
      }
    }

    async updateCredential(credentialId, updates) {
      this.setLoading('updateCredential', true);
      try {
        return await this.request(`/credentials/${credentialId}`, {
          method: 'PATCH',
          body: updates
        });
      } finally {
        this.setLoading('updateCredential', false);
      }
    }

    async deleteCredential(credentialId) {
      this.setLoading('deleteCredential', true);
      try {
        return await this.request(`/credentials/${credentialId}`, {
          method: 'DELETE'
        });
      } finally {
        this.setLoading('deleteCredential', false);
      }
    }

    async rotateCredential(credentialId) {
      this.setLoading('rotateCredential', true);
      try {
        return await this.request(`/credentials/${credentialId}/rotate`, {
          method: 'POST'
        });
      } finally {
        this.setLoading('rotateCredential', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Agent endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getAgents(filters = {}) {
      this.setLoading('agents', true);
      try {
        const query = new URLSearchParams(filters).toString();
        const endpoint = `/agents${query ? '?' + query : ''}`;
        const data = await this.request(endpoint);
        return data.agents || [];
      } finally {
        this.setLoading('agents', false);
      }
    }

    async registerAgent(agent) {
      this.setLoading('registerAgent', true);
      try {
        return await this.request('/agents', {
          method: 'POST',
          body: agent
        });
      } finally {
        this.setLoading('registerAgent', false);
      }
    }

    async getAgentSessions(agentId, filters = {}) {
      this.setLoading('agentSessions', true);
      try {
        const query = new URLSearchParams(filters).toString();
        const endpoint = `/agents/${agentId}/sessions${query ? '?' + query : ''}`;
        const data = await this.request(endpoint);
        return data.sessions || [];
      } finally {
        this.setLoading('agentSessions', false);
      }
    }

    async getSessionDetails(sessionId) {
      this.setLoading('sessionDetails', true);
      try {
        return await this.request(`/sessions/${sessionId}`);
      } finally {
        this.setLoading('sessionDetails', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Analytics endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getAnalytics(timeRange = '7d') {
      this.setLoading('analytics', true);
      try {
        return await this.request(`/analytics?range=${timeRange}`);
      } finally {
        this.setLoading('analytics', false);
      }
    }

    async getStats() {
      this.setLoading('stats', true);
      try {
        return await this.request('/stats');
      } finally {
        this.setLoading('stats', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Audit log endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getAuditLogs(filters = {}) {
      this.setLoading('auditLogs', true);
      try {
        const query = new URLSearchParams(filters).toString();
        const endpoint = `/audit${query ? '?' + query : ''}`;
        const data = await this.request(endpoint);
        return data.logs || [];
      } finally {
        this.setLoading('auditLogs', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Team endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getTeamMembers() {
      this.setLoading('teamMembers', true);
      try {
        const data = await this.request('/team/members');
        return data.members || [];
      } finally {
        this.setLoading('teamMembers', false);
      }
    }

    async inviteTeamMember(email, role = 'member') {
      this.setLoading('inviteTeamMember', true);
      try {
        return await this.request('/team/members', {
          method: 'POST',
          body: { email, role }
        });
      } finally {
        this.setLoading('inviteTeamMember', false);
      }
    }

    async removeTeamMember(memberId) {
      this.setLoading('removeTeamMember', true);
      try {
        return await this.request(`/team/members/${memberId}`, {
          method: 'DELETE'
        });
      } finally {
        this.setLoading('removeTeamMember', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Settings endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getSettings() {
      this.setLoading('settings', true);
      try {
        return await this.request('/settings');
      } finally {
        this.setLoading('settings', false);
      }
    }

    async updateSettings(settings) {
      this.setLoading('updateSettings', true);
      try {
        return await this.request('/settings', {
          method: 'PATCH',
          body: settings
        });
      } finally {
        this.setLoading('updateSettings', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Billing endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getBillingInfo() {
      this.setLoading('billingInfo', true);
      try {
        return await this.request('/billing');
      } finally {
        this.setLoading('billingInfo', false);
      }
    }

    async getUsageStats() {
      this.setLoading('usageStats', true);
      try {
        return await this.request('/usage');
      } finally {
        this.setLoading('usageStats', false);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // User endpoints
    // ────────────────────────────────────────────────────────────────────────────

    async getMe() {
      this.setLoading('me', true);
      try {
        return await this.request('/me');
      } finally {
        this.setLoading('me', false);
      }
    }

    async logout() {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } catch (error) {
        console.warn('Logout request failed, clearing local state:', error);
      } finally {
        this.setToken(null);
      }
    }
  }

  /**
   * Custom API Error class
   */
  class APIError extends Error {
    constructor(message, status = 0, data = {}) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }

    isNetworkError() {
      return this.status === 0;
    }

    isUnauthorized() {
      return this.status === 401;
    }

    isNotFound() {
      return this.status === 404;
    }

    isServerError() {
      return this.status >= 500;
    }

    isRateLimited() {
      return this.status === 429;
    }
  }

  /**
   * Global singleton instance
   */
  let clientInstance = null;

  function getClient(config) {
    if (!clientInstance) {
      clientInstance = new APIClient(config);
    }
    return clientInstance;
  }

  // Export to global scope
  global.APIClient = APIClient;
  global.APIError = APIError;
  global.getAPIClient = getClient;

})(window);
