/**
 * CredSeal Dashboard Data
 * Fetches and populates real data from the API
 */

const DashboardData = {
  API_BASE: '/api',

  // Get auth token from cookies
  getToken() {
    const match = document.cookie.match(/access_token=([^;]+)/);
    return match ? match[1] : null;
  },

  // Fetch with auth
  async fetch(endpoint) {
    const token = this.getToken();
    if (!token) {
      console.warn('No auth token found');
      return null;
    }

    try {
      const response = await fetch(`${this.API_BASE}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login.html?expired=true';
        return null;
      }

      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  },

  // Load user info
  async loadUser() {
    const data = await this.fetch('/me');
    if (!data) return;

    const { org, user } = data;
    const name = org?.name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || '';
    const initial = name.charAt(0).toUpperCase();

    // Update UI elements
    this.setText('#user-avatar', initial);
    this.setText('#user-name', name);
    this.setText('#dropdown-user-name', name);
    this.setText('#dropdown-user-email', email);
  },

  // Load dashboard stats
  async loadStats() {
    const data = await this.fetch('/stats');
    if (!data) return;

    this.setText('#stat-credentials', data.credentials || 0);
    this.setText('#stat-agents', data.agents || 0);
    this.setText('#stat-executions', data.executions || 0);

    if (data.executions > 0 && data.success_rate !== undefined) {
      this.setText('#stat-success-rate', `${data.success_rate}%`);
    }

    // Update usage meter
    const used = data.executions || 0;
    const limit = data.execution_limit || 500;
    const percent = Math.min((used / limit) * 100, 100);

    this.setText('#usage-count', `${used} / ${limit}`);
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

  // Load recent sessions
  async loadSessions() {
    const data = await this.fetch('/sessions?limit=5');
    if (!data || !data.sessions || data.sessions.length === 0) return;

    const emptyState = document.getElementById('sessions-empty');
    const table = document.getElementById('sessions-table');
    const tbody = document.getElementById('sessions-tbody');

    if (emptyState) emptyState.style.display = 'none';
    if (table) table.style.display = '';

    if (tbody) {
      tbody.innerHTML = data.sessions.map(s => `
        <tr>
          <td>
            <div class="agent-cell">
              <span class="agent-indicator"></span>
              ${this.escape(s.agent_name || 'Unknown')}
            </div>
          </td>
          <td><code>${this.escape(s.credential_name || '—')}</code></td>
          <td><span class="badge badge-${s.success ? 'success' : 'warning'}">${s.success ? 'Success' : 'Failed'}</span></td>
          <td class="text-muted">${this.timeAgo(s.created_at)}</td>
        </tr>
      `).join('');
    }
  },

  // Load credentials
  async loadCredentials() {
    const data = await this.fetch('/credentials');
    if (!data || !data.credentials || data.credentials.length === 0) return;

    const emptyState = document.getElementById('credentials-empty');
    const table = document.getElementById('credentials-table');
    const tbody = document.getElementById('credentials-tbody');

    if (emptyState) emptyState.style.display = 'none';
    if (table) table.style.display = '';

    if (tbody) {
      tbody.innerHTML = data.credentials.map(c => `
        <tr>
          <td>
            <div class="credential-cell">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              <code>${this.escape(c.name)}</code>
            </div>
          </td>
          <td>${(c.allowed_agents || []).map(a => `<span class="badge badge-neutral">${this.escape(a)}</span>`).join(' ') || '—'}</td>
          <td>${(c.scopes || []).map(s => `<code>${this.escape(s)}</code>`).join(', ') || '—'}</td>
          <td class="text-muted">${c.last_used ? this.timeAgo(c.last_used) : 'Never'}</td>
          <td><span class="badge badge-${c.active ? 'success' : 'warning'}">${c.active ? 'Active' : 'Inactive'}</span></td>
        </tr>
      `).join('');
    }
  },

  // Helper: Set text content safely
  setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  },

  // Helper: Escape HTML
  escape(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  },

  // Helper: Time ago
  timeAgo(date) {
    if (!date) return '—';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  },

  // Initialize
  async init() {
    // Load all data in parallel
    await Promise.all([
      this.loadUser(),
      this.loadStats(),
      this.loadSessions(),
      this.loadCredentials()
    ]);
  }
};

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  DashboardData.init();
});
