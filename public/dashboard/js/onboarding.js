/**
 * IdentArk Onboarding Wizard
 * 4-step guided setup for new users
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'identark_onboarding_completed';
  const STORAGE_STEP_KEY = 'identark_onboarding_step';

  // ────────────────────────────────────────────────────────────────────────────
  // Steps Configuration
  // ────────────────────────────────────────────────────────────────────────────

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to IdentArk',
      description: 'Let\'s get your AI agents securely connected to credentials in under 5 minutes.',
      content: `
        <div class="onboarding-welcome">
          <div class="onboarding-features">
            <div class="onboarding-feature">
              <div class="onboarding-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div class="onboarding-feature-text">
                <strong>Secure by Default</strong>
                <span>Zero-knowledge architecture with end-to-end encryption</span>
              </div>
            </div>
            <div class="onboarding-feature">
              <div class="onboarding-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/>
                </svg>
              </div>
              <div class="onboarding-feature-text">
                <strong>Agent-First Design</strong>
                <span>Built specifically for AI agent credential management</span>
              </div>
            </div>
            <div class="onboarding-feature">
              <div class="onboarding-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="onboarding-feature-text">
                <strong>Full Audit Trail</strong>
                <span>Every credential access is logged and traceable</span>
              </div>
            </div>
          </div>
        </div>
      `,
      action: null
    },
    {
      id: 'credential',
      title: 'Add Your First Credential',
      description: 'Store an API key or secret that your agents will access.',
      content: `
        <div class="onboarding-form">
          <div class="form-group">
            <label class="form-label">Credential Name</label>
            <input type="text" class="form-input" id="onboarding-cred-name" placeholder="e.g., github-api, openai-key" />
            <span class="form-hint">A unique identifier for this credential</span>
          </div>
          <div class="form-group">
            <label class="form-label">Secret Value</label>
            <input type="password" class="form-input form-input-mono" id="onboarding-cred-value" placeholder="sk-..." />
            <span class="form-hint">Your API key or secret (encrypted at rest)</span>
          </div>
          <div class="onboarding-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Credentials are encrypted using AES-256-GCM before storage</span>
          </div>
        </div>
      `,
      validate: () => {
        const name = document.getElementById('onboarding-cred-name')?.value;
        const value = document.getElementById('onboarding-cred-value')?.value;
        if (!name || name.length < 2) {
          return 'Please enter a credential name (at least 2 characters)';
        }
        if (!value || value.length < 4) {
          return 'Please enter a secret value (at least 4 characters)';
        }
        return null;
      }
    },
    {
      id: 'agent',
      title: 'Register an Agent',
      description: 'Define which AI agent will access your credentials.',
      content: `
        <div class="onboarding-form">
          <div class="form-group">
            <label class="form-label">Agent ID</label>
            <input type="text" class="form-input" id="onboarding-agent-id" placeholder="e.g., research-agent, code-assistant" />
            <span class="form-hint">A unique identifier for your AI agent</span>
          </div>
          <div class="form-group">
            <label class="form-label">Allowed Credentials</label>
            <div class="onboarding-checkbox-group" id="onboarding-agent-creds">
              <!-- Populated dynamically -->
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Scopes (optional)</label>
            <input type="text" class="form-input" id="onboarding-agent-scopes" placeholder="read, write, admin" />
            <span class="form-hint">Comma-separated list of allowed operations</span>
          </div>
        </div>
      `,
      validate: () => {
        const agentId = document.getElementById('onboarding-agent-id')?.value;
        if (!agentId || agentId.length < 2) {
          return 'Please enter an agent ID (at least 2 characters)';
        }
        return null;
      },
      onEnter: () => {
        const credsContainer = document.getElementById('onboarding-agent-creds');
        const credName = document.getElementById('onboarding-cred-name')?.value || 'my-credential';
        if (credsContainer) {
          credsContainer.innerHTML = `
            <label class="onboarding-checkbox">
              <input type="checkbox" checked />
              <span>${credName}</span>
            </label>
          `;
        }
      }
    },
    {
      id: 'integrate',
      title: 'Integrate with Your Code',
      description: 'Copy this code snippet to start using IdentArk in your agent.',
      content: `
        <div class="onboarding-code-tabs">
          <button class="onboarding-code-tab active" data-lang="python">Python</button>
          <button class="onboarding-code-tab" data-lang="typescript">TypeScript</button>
        </div>
        <div class="onboarding-code-block">
          <div class="code-block">
            <div class="code-header">
              <span class="code-lang" id="onboarding-code-lang">python</span>
              <button class="btn btn-sm btn-ghost code-copy" id="onboarding-copy-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <div class="code-body">
              <pre><code id="onboarding-code-content"></code></pre>
            </div>
          </div>
        </div>
        <div class="onboarding-info success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>You're all set! Your credential is ready to be used.</span>
        </div>
      `,
      onEnter: () => {
        const credName = document.getElementById('onboarding-cred-name')?.value || 'my-credential';
        const agentId = document.getElementById('onboarding-agent-id')?.value || 'my-agent';
        updateCodeSnippet('python', credName, agentId);

        // Tab switching
        document.querySelectorAll('.onboarding-code-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            document.querySelectorAll('.onboarding-code-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateCodeSnippet(tab.dataset.lang, credName, agentId);
          });
        });

        // Copy button
        document.getElementById('onboarding-copy-btn')?.addEventListener('click', async () => {
          const code = document.getElementById('onboarding-code-content')?.textContent;
          if (code) {
            await navigator.clipboard.writeText(code);
            window.IdentArk?.showToast?.('Code copied to clipboard', 'success');
          }
        });
      }
    }
  ];

  function updateCodeSnippet(lang, credName, agentId) {
    const codeEl = document.getElementById('onboarding-code-content');
    const langEl = document.getElementById('onboarding-code-lang');
    if (!codeEl || !langEl) return;

    langEl.textContent = lang;

    const snippets = {
      python: `from credseal import IdentArk

# Initialize the client
cs = IdentArk(agent_id="${agentId}")

# Request credential access (returns a session)
with cs.session("${credName}") as session:
    # Use the credential securely
    api_key = session.get()

    # Make your API call
    response = requests.get(
        "https://api.example.com/data",
        headers={"Authorization": f"Bearer {api_key}"}
    )`,
      typescript: `import { IdentArk } from '@credseal/sdk';

// Initialize the client
const cs = new IdentArk({ agentId: '${agentId}' });

// Request credential access
const session = await cs.session('${credName}');

try {
  // Use the credential securely
  const apiKey = await session.get();

  // Make your API call
  const response = await fetch('https://api.example.com/data', {
    headers: { Authorization: \`Bearer \${apiKey}\` }
  });
} finally {
  await session.end();
}`
    };

    codeEl.textContent = snippets[lang] || snippets.python;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────────────────────────────────

  let currentStep = 0;
  let overlay = null;

  // ────────────────────────────────────────────────────────────────────────────
  // Initialize
  // ────────────────────────────────────────────────────────────────────────────

  function init() {
    // Check if already completed
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      return;
    }

    // Restore step if partially completed
    const savedStep = parseInt(localStorage.getItem(STORAGE_STEP_KEY) || '0', 10);
    currentStep = Math.min(savedStep, steps.length - 1);

    createWizard();

    // Show wizard after a brief delay (let dashboard load first)
    setTimeout(() => {
      open();
    }, 500);
  }

  function createWizard() {
    overlay = document.createElement('div');
    overlay.id = 'onboarding-wizard';
    overlay.className = 'onboarding-overlay';

    overlay.innerHTML = `
      <div class="onboarding-wizard">
        <div class="onboarding-header">
          <div class="onboarding-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 class="onboarding-title">${steps[currentStep].title}</h2>
          <p class="onboarding-subtitle">${steps[currentStep].description}</p>
        </div>
        <div class="onboarding-progress">
          ${steps.map((_, i) => `
            <div class="onboarding-step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}"></div>
          `).join('')}
        </div>
        <div class="onboarding-body">
          ${steps.map((step, i) => `
            <div class="onboarding-step ${i === currentStep ? 'active' : ''}" data-step="${i}">
              ${step.content}
            </div>
          `).join('')}
        </div>
        <div class="onboarding-footer">
          <button class="onboarding-skip" id="onboarding-skip">Skip setup</button>
          <div class="onboarding-actions">
            <button class="btn btn-secondary" id="onboarding-prev" ${currentStep === 0 ? 'style="display:none"' : ''}>Back</button>
            <button class="btn btn-primary" id="onboarding-next">
              ${currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('onboarding-skip')?.addEventListener('click', skip);
    document.getElementById('onboarding-prev')?.addEventListener('click', prev);
    document.getElementById('onboarding-next')?.addEventListener('click', next);

    // Trigger onEnter for current step
    if (steps[currentStep].onEnter) {
      steps[currentStep].onEnter();
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Navigation
  // ────────────────────────────────────────────────────────────────────────────

  function open() {
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function close() {
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function goToStep(step) {
    currentStep = step;
    localStorage.setItem(STORAGE_STEP_KEY, String(step));

    // Update UI
    const title = overlay.querySelector('.onboarding-title');
    const subtitle = overlay.querySelector('.onboarding-subtitle');
    const dots = overlay.querySelectorAll('.onboarding-step-dot');
    const stepEls = overlay.querySelectorAll('.onboarding-step');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');

    title.textContent = steps[step].title;
    subtitle.textContent = steps[step].description;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === step);
      dot.classList.toggle('completed', i < step);
    });

    stepEls.forEach((el, i) => {
      el.classList.toggle('active', i === step);
    });

    prevBtn.style.display = step === 0 ? 'none' : '';
    nextBtn.textContent = step === steps.length - 1 ? 'Get Started' : 'Continue';

    // Trigger onEnter
    if (steps[step].onEnter) {
      setTimeout(() => steps[step].onEnter(), 50);
    }
  }

  function prev() {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }

  function next() {
    // Validate current step
    const step = steps[currentStep];
    if (step.validate) {
      const error = step.validate();
      if (error) {
        window.IdentArk?.showToast?.(error, 'warning');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      complete();
    }
  }

  function skip() {
    localStorage.setItem(STORAGE_KEY, 'true');
    close();
    window.IdentArk?.showToast?.('You can always access the quickstart guide later', 'info');
  }

  function complete() {
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.removeItem(STORAGE_STEP_KEY);
    close();
    window.IdentArk?.showToast?.('Setup complete! Welcome to IdentArk', 'success');

    // Optionally redirect to credentials page
    // window.location.href = 'credentials.html';
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Public API
  // ────────────────────────────────────────────────────────────────────────────

  window.OnboardingWizard = {
    open,
    close,
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
      location.reload();
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
