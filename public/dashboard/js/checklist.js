/**
 * IdentArk Onboarding Checklist
 * Progress tracking and guided setup for new users
 */

const OnboardingChecklist = {
  STORAGE_KEY: 'identark_checklist_state',

  // Default state
  defaultState: {
    dismissed: false,
    steps: {
      email_verified: false,
      first_credential: false,
      first_agent: false,
      first_session: false,
      explore_docs: false
    }
  },

  state: null,

  // Step definitions
  steps: [
    {
      id: 'email_verified',
      title: 'Verify your email',
      description: 'Confirm your email address to secure your account',
      href: '/verify-email.html',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>`
    },
    {
      id: 'first_credential',
      title: 'Add your first credential',
      description: 'Store an API key or secret securely',
      href: 'credentials.html?action=add',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>`
    },
    {
      id: 'first_agent',
      title: 'Register an agent',
      description: 'Connect your AI agent to IdentArk',
      href: 'agents.html?action=add',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>`
    },
    {
      id: 'first_session',
      title: 'Test the API',
      description: 'Make your first credential request',
      href: 'playground.html',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>`
    },
    {
      id: 'explore_docs',
      title: 'Explore the docs',
      description: 'Learn about advanced features',
      href: 'https://github.com/identark/sdk#readme',
      external: true,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>`
    }
  ],

  init() {
    this.loadState();
    this.checkUrlParams();
    this.render();
  },

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      this.state = saved ? JSON.parse(saved) : { ...this.defaultState };
    } catch (e) {
      this.state = { ...this.defaultState };
    }
  },

  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },

  // Check URL params for completion triggers
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('verified') === 'true') {
      this.complete('email_verified');
    }
    if (params.get('credential_added') === 'true') {
      this.complete('first_credential');
    }
    if (params.get('agent_added') === 'true') {
      this.complete('first_agent');
    }
    if (params.get('session_created') === 'true') {
      this.complete('first_session');
    }
  },

  complete(stepId) {
    if (this.state.steps.hasOwnProperty(stepId) && !this.state.steps[stepId]) {
      this.state.steps[stepId] = true;
      this.saveState();
      this.render();
      this.showCelebration(stepId);

      // Check if all complete
      if (this.getProgress() === 100) {
        setTimeout(() => this.showAllComplete(), 500);
      }
    }
  },

  getProgress() {
    const total = Object.keys(this.state.steps).length;
    const completed = Object.values(this.state.steps).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  },

  getCompletedCount() {
    return Object.values(this.state.steps).filter(Boolean).length;
  },

  dismiss() {
    this.state.dismissed = true;
    this.saveState();
    const el = document.getElementById('onboarding-checklist');
    if (el) {
      el.style.animation = 'slideUp 0.3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  },

  render() {
    // Don't render if dismissed or all complete
    if (this.state.dismissed || this.getProgress() === 100) {
      const existing = document.getElementById('onboarding-checklist');
      if (existing) existing.remove();
      return;
    }

    // Find or create container
    let container = document.getElementById('onboarding-checklist');
    const content = document.querySelector('.content');

    if (!content) return;

    if (!container) {
      container = document.createElement('div');
      container.id = 'onboarding-checklist';

      // Insert after page header or at top
      const pageHeader = content.querySelector('.page-header, .stats-grid');
      if (pageHeader) {
        pageHeader.after(container);
      } else {
        content.prepend(container);
      }
    }

    const progress = this.getProgress();
    const completedCount = this.getCompletedCount();
    const totalCount = Object.keys(this.state.steps).length;

    container.innerHTML = `
      <div class="checklist-card">
        <div class="checklist-header">
          <div class="checklist-title-row">
            <div class="checklist-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="checklist-title-content">
              <h3 class="checklist-title">Complete your setup</h3>
              <p class="checklist-subtitle">${completedCount} of ${totalCount} tasks completed</p>
            </div>
          </div>
          <button class="checklist-close" onclick="OnboardingChecklist.dismiss()" title="Dismiss">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="checklist-progress-bar">
          <div class="checklist-progress-fill" style="width: ${progress}%"></div>
        </div>

        <div class="checklist-steps">
          ${this.steps.map(step => {
            const isComplete = this.state.steps[step.id];
            return `
              <a href="${step.href}" class="checklist-step ${isComplete ? 'completed' : ''}" ${step.external ? 'target="_blank" rel="noopener"' : ''}>
                <div class="step-check ${isComplete ? 'checked' : ''}">
                  ${isComplete ? `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ` : ''}
                </div>
                <div class="step-icon">${step.icon}</div>
                <div class="step-content">
                  <span class="step-title">${step.title}</span>
                  <span class="step-description">${step.description}</span>
                </div>
                <svg class="step-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;

  },

  showCelebration(stepId) {
    const step = this.steps.find(s => s.id === stepId);
    if (!step) return;

    const toast = document.createElement('div');
    toast.className = 'checklist-toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <span class="toast-text">${step.title} - Done!</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  showAllComplete() {
    const toast = document.createElement('div');
    toast.className = 'checklist-toast success';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <span class="toast-text">All done! You're ready to go.</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Alias for completeStep (backward compat)
  completeStep(stepId) {
    this.complete(stepId);
  },

  // Reset for testing
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = { ...this.defaultState };
    this.render();
  }
};

// Auto-initialize unless disabled via global flag
// Set window.CREDSEAL_CHECKLIST_NO_AUTO = true before loading to disable
if (!window.CREDSEAL_CHECKLIST_NO_AUTO) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OnboardingChecklist.init());
  } else {
    OnboardingChecklist.init();
  }
}

// Export globally
window.OnboardingChecklist = OnboardingChecklist;
