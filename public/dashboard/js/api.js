/**
 * IdentArk Dashboard API Client
 * ==============================
 * Centralized API client for all dashboard operations.
 * Handles authentication, error handling, and request/response formatting.
 */

const API = {
  // Configuration
  baseUrl: localStorage.getItem('identark_api_url') || 'https://credseal-cloud.fly.dev',

  // Auth state
  _accessToken: null,
  _refreshToken: null,
  _user: null,

  /**
   * Initialize API client - call on page load
   */
  async init() {
    // Try to get tokens from cookies
    this._accessToken = this._getCookie('access_token');
    this._refreshToken = this._getCookie('refresh_token');

    if (this._accessToken) {
      try {
        this._user = await this.getCurrentUser();
        this._updateUserUI();
        return true;
      } catch (e) {
        // Token expired or invalid
        console.warn('Session expired, redirecting to login');
        this.logout();
        return false;
      }
    }
    return false;
  },

  /**
   * Core fetch wrapper with auth and error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/v1${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();

    const headers = {
      ...options.headers,
    };

    // Only add Content-Type for methods that have a body
    if (method !== 'GET' && method !== 'HEAD' && method !== 'DELETE') {
      headers['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    if (this._accessToken) {
      headers['Authorization'] = `Bearer ${this._accessToken}`;
    }

    // Build config - exclude body for GET/HEAD requests
    const config = {
      method,
      headers,
      credentials: 'include', // Send cookies
    };

    // Only include body for methods that support it
    if (options.body && method !== 'GET' && method !== 'HEAD') {
      config.body = options.body;
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 - try to refresh token
      if (response.status === 401 && this._refreshToken) {
        const refreshed = await this._refreshAccessToken();
        if (refreshed) {
          // Retry original request
          headers['Authorization'] = `Bearer ${this._accessToken}`;
          const retryResponse = await fetch(url, { ...config, headers });
          return this._handleResponse(retryResponse);
        } else {
          this.logout();
          throw new APIError('Session expired', 401, 'session_expired');
        }
      }

      return this._handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Network error', 0, 'network_error');
    }
  },

  async _handleResponse(response) {
    // No content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorCode = data.detail?.error_code || 'unknown_error';
      const message = data.detail?.message || data.detail || 'An error occurred';
      throw new APIError(message, response.status, errorCode);
    }

    return data;
  },

  async _refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this._refreshToken }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this._accessToken = data.access_token;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  _getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  },

  _updateUserUI() {
    if (!this._user) return;

    const avatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');

    if (avatar) avatar.textContent = this._user.name?.charAt(0).toUpperCase() || '?';
    if (userName) userName.textContent = this._user.name || 'User';
    if (dropdownName) dropdownName.textContent = this._user.name || 'User';
    if (dropdownEmail) dropdownEmail.textContent = this._user.email || '';
  },

  logout() {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    this._accessToken = null;
    this._refreshToken = null;
    this._user = null;
    window.location.href = '/login.html';
  },

  // ════════════════════════════════════════════════════════════════════════════
  // AUTH ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async signup(email, password, name) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this._accessToken = data.access_token;
    this._refreshToken = data.refresh_token;
    return data;
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CREDENTIALS ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async listCredentials() {
    return this.request('/credentials');
  },

  async getCredential(id) {
    return this.request(`/credentials/${id}`);
  },

  async createCredential(provider, credential, label = 'default') {
    return this.request('/credentials', {
      method: 'POST',
      body: JSON.stringify({ provider, credential, label }),
    });
  },

  async updateCredential(id, label) {
    return this.request(`/credentials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ label }),
    });
  },

  async deleteCredential(id) {
    return this.request(`/credentials/${id}`, {
      method: 'DELETE',
    });
  },

  async rotateCredential(id, newCredential) {
    return this.request(`/credentials/${id}/rotate`, {
      method: 'POST',
      body: JSON.stringify({ credential: newCredential }),
    });
  },

  // ════════════════════════════════════════════════════════════════════════════
  // AGENTS ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async listAgents() {
    return this.request('/agents');
  },

  async getAgent(id) {
    return this.request(`/agents/${id}`);
  },

  async createAgent(name, description, model, provider, credentialRef) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        model,
        provider,
        credential_ref: credentialRef,
      }),
    });
  },

  async updateAgent(id, updates) {
    return this.request(`/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteAgent(id) {
    return this.request(`/agents/${id}`, {
      method: 'DELETE',
    });
  },

  async getAgentSessions(id, limit = 20, offset = 0) {
    return this.request(`/agents/${id}/sessions?limit=${limit}&offset=${offset}`);
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SESSIONS ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async listSessions(limit = 50, offset = 0) {
    return this.request(`/sessions?limit=${limit}&offset=${offset}`);
  },

  async getSession(id) {
    return this.request(`/sessions/${id}`);
  },

  // ════════════════════════════════════════════════════════════════════════════
  // AUDIT ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async listAuditLogs(limit = 100, offset = 0, filters = {}) {
    const params = new URLSearchParams({ limit, offset, ...filters });
    return this.request(`/audit?${params}`);
  },

  // ════════════════════════════════════════════════════════════════════════════
  // STATS ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async getDashboardStats() {
    return this.request('/stats');
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TEAM ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async listTeamMembers() {
    return this.request('/team');
  },

  async inviteTeamMember(email, role) {
    return this.request('/team/invite', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },

  // ════════════════════════════════════════════════════════════════════════════
  // REGIONS ENDPOINTS (Public)
  // ════════════════════════════════════════════════════════════════════════════

  async getRegions() {
    // Public endpoint, no auth needed
    const response = await fetch(`${this.baseUrl}/v1/regions`);
    return response.json();
  },

  // ════════════════════════════════════════════════════════════════════════════
  // BILLING ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════════

  async getBillingInfo() {
    return this.request('/billing');
  },

  async getUsage() {
    return this.request('/billing/usage');
  },
};


/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}


/**
 * Toast notification system
 */
const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 4000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      padding: 12px 16px;
      background: var(--bg-elevated, #141414);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 8px;
      color: var(--fg-1, #ececec);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      animation: slideIn 0.2s ease-out;
      max-width: 400px;
    `;

    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #D4A853)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    };

    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.2s ease-in forwards';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },

  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error'); },
  info(message) { this.show(message, 'info'); },
};


// Add toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(toastStyles);


// Export for use
window.API = API;
window.APIError = APIError;
window.Toast = Toast;
