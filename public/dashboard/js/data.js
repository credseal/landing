/**
 * IdentArk Dashboard Data
 * Fetches real data from API using api-client.js
 * Falls back to localStorage for offline/demo mode
 */

const DashboardData = {
  // API client instance
  _apiClient: null,
  _authState: null,
  _errorBoundary: null,

  /**
   * Initialize data module
   */
  async init() {
    // Get singleton instances
    this._apiClient = getAPIClient();
    this._authState = getAuthState();
    this._errorBoundary = getErrorBoundary();

    // Load all dashboard data in parallel with error boundaries
    await Promise.all([
      this._loadUserWithFallback(),
      this._loadStatsWithFallback(),
      this._loadSessionsWithFallback(),
      this._loadCredentialsWithFallback()
    ]);
  },

  /**
   * Load user info with fallback
   */
  async _loadUserWithFallback() {
    try {
      const user = this._authState.getUser();
      const org = this._authState.getOrg();

      if (user) {
        this._updateUserUI(user, org);
      }
    } catch (error) {
      this._errorBoundary._handleError(error, {
        type: 'dataLoadError',
        module: 'loadUser'
      });
      this._updateUserUI({ email: 'User' }, { name: 'Org' });
    }
  },

  /**
   * Load dashboard stats with fallback
   */
  async _loadStatsWithFallback() {
    try {
      const data = await this._apiClient.getStats();
      this._updateStatsUI(data);
    } catch (error) {
      this._errorBoundary._handleError(error, {
        type: 'dataLoadError',
        module: 'loadStats'
      });
      // Show fallback/empty stats
      this._updateStatsUI({
        credentials: 0,
        agents: 0,
        executions: 0,
        success_rate: 0
      });
    }
  },

  /**
   * Load recent sessions with fallback
   */
  async _loadSessionsWithFallback() {
    try {
      const sessions = await this._apiClient.request('/sessions?limit=5');

      if (sessions && sessions.sessions && sessions.sessions.length > 0) {
        this._updateSessionsUI(sessions.sessions);
      } else {
        this._showEmptyState('sessions-empty', 'sessions-table');
      }
    } catch (error) {
      this._errorBoundary._handleError(error, {
        type: 'dataLoadError',
        module: 'loadSessions'
      });
      this._showEmptyState('sessions-empty', 'sessions-table');
    }
  },

  /**
   * Load credentials with fallback
   */
  async _loadCredentialsWithFallback() {
    try {
      const data = await this._apiClient.getCredentials();

      if (data && data.length > 0) {
        this._updateCredentialsUI(data);
      } else {
        this._showEmptyState('credentials-empty', 'credentials-table');
      }
    } catch (error) {
      this._errorBoundary._handleError(error, {
        type: 'dataLoadError',
        module: 'loadCredentials'
      });
      this._showEmptyState('credentials-empty', 'credentials-table');
    }
  },

  /**
   * Update user UI
   */
  _updateUserUI(user = {}, org = {}) {
    const name = org?.name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || '';
    const initial = (name || 'U').charAt(0).toUpperCase();

    this._setText('#user-avatar', initial);
    this._setText('#user-name', name);
    this._setText('#dropdown-user-name', name);
    this._setText('#dropdown-user-email', email);
  },

  /**
   * Update stats UI
   */
  _updateStatsUI(data = {}) {
    this._setText('#stat-credentials', data.credentials || 0);
    this._setText('#stat-agents', data.agents || 0);
    this._setText('#stat-executions', data.executions || 0);

    if (data.executions > 0 && data.success_rate !== undefined) {
      this._setText('#stat-success-rate', `${Math.round(data.success_rate)}%`);
    }

    // Update usage meter
    const used = data.executions || 0;
    const limit = data.execution_limit || 500;
    const percent = Math.min((used / limit) * 100, 100);

    this._setText('#usage-count', `${used} / ${limit}`);
    const fill = document.getElementById('usage-fill');
    if (fill) fill.style.width = `${percent}%`;

    // Update nav badge
    if (data.credentials > 0) {
      const badge = document.getElementById('nav-credentials-count');
      if (badge) {
        badge.textContent = data.credentials;
        badge.style.display = '';
      }
    }
  },

  /**
   * Update sessions UI
   */
  _updateSessionsUI(sessions = []) {
    const emptyState = document.getElementById('sessions-empty');
    const table = document.getElementById('sessions-table');
    const tbody = document.getElementById('sessions-tbody');

    if (emptyState) emptyState.style.display = 'none';
    if (table) table.style.display = '';

    if (tbody) {
      tbody.innerHTML = sessions.map(s => `
        <tr>
          <td>
            <div class="agent-cell">
              <span class="agent-indicator"></span>
              ${this._escape(s.agent_name || 'Unknown')}
            </div>
          </td>
          <td><code>${this._escape(s.credential_name || '—')}</code></td>
          <td><span class="badge badge-${s.success ? 'success' : 'warning'}">${s.success ? 'Success' : 'Failed'}</span></td>
          <td class="text-muted">${this._timeAgo(s.created_at)}</td>
        </tr>
      `).join('');
    }
  },

  /**
   * Update credentials UI
   */
  _updateCredentialsUI(credentials = []) {
    const emptyState = document.getElementById('credentials-empty');
    const table = document.getElementById('credentials-table');
    const tbody = document.getElementById('credentials-tbody');

    if (emptyState) emptyState.style.display = 'none';
    if (table) table.style.display = '';

    if (tbody) {
      tbody.innerHTML = credentials.map(c => `
        <tr>
          <td>
            <div class="credential-cell">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              <code>${this._escape(c.name)}</code>
            </div>
          </td>
          <td>${(c.allowed_agents || []).map(a => `<span class="badge badge-neutral">${this._escape(a)}</span>`).join(' ') || '—'}</td>
          <td>${(c.scopes || []).map(s => `<code>${this._escape(s)}</code>`).join(', ') || '—'}</td>
          <td class="text-muted">${c.last_used ? this._timeAgo(c.last_used) : 'Never'}</td>
          <td><span class="badge badge-${c.active ? 'success' : 'warning'}">${c.active ? 'Active' : 'Inactive'}</span></td>
        </tr>
      `).join('');
    }
  },

  /**
   * Show empty state by hiding table and showing empty message
   */
  _showEmptyState(emptyStateId, tableId) {
    const emptyState = document.getElementById(emptyStateId);
    const table = document.getElementById(tableId);

    if (emptyState) emptyState.style.display = '';
    if (table) table.style.display = 'none';
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────

  _setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  },

  _escape(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  _timeAgo(date) {
    if (!date) return '—';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  }
};

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    DashboardData.init();
  });
} else {
  DashboardData.init();
}
