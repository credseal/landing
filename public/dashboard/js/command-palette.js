/**
 * IdentArk Command Palette
 * Global search and quick actions via ⌘K / Ctrl+K
 */

(function() {
  'use strict';

  // ────────────────────────────────────────────────────────────────────────────
  // Command Registry
  // ────────────────────────────────────────────────────────────────────────────

  const commands = [
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: 'grid', action: () => navigate('index.html') },
    { id: 'nav-credentials', label: 'Go to Credentials', category: 'Navigation', icon: 'key', action: () => navigate('credentials.html') },
    { id: 'nav-agents', label: 'Go to Agents', category: 'Navigation', icon: 'cpu', action: () => navigate('agents.html') },
    { id: 'nav-sessions', label: 'Go to Sessions', category: 'Navigation', icon: 'activity', action: () => navigate('sessions.html') },
    { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', icon: 'settings', action: () => navigate('settings.html') },
    { id: 'nav-billing', label: 'Go to Billing', category: 'Navigation', icon: 'credit-card', action: () => navigate('billing.html') },
    { id: 'nav-quickstart', label: 'Go to Quickstart', category: 'Navigation', icon: 'terminal', action: () => navigate('quickstart.html') },

    // Actions
    { id: 'action-new-credential', label: 'Create New Credential', category: 'Actions', icon: 'plus', action: () => { navigate('credentials.html'); setTimeout(() => window.IdentArk?.openModal?.('create-credential-modal'), 300); } },
    { id: 'action-new-agent', label: 'Register New Agent', category: 'Actions', icon: 'plus-circle', action: () => { navigate('agents.html'); setTimeout(() => window.IdentArk?.openModal?.('register-agent-modal'), 300); } },
    { id: 'action-new-api-key', label: 'Generate API Key', category: 'Actions', icon: 'key', action: () => navigate('settings.html#api-keys') },
    { id: 'action-invite-member', label: 'Invite Team Member', category: 'Actions', icon: 'user-plus', action: () => navigate('settings.html#team') },

    // Documentation
    { id: 'docs-sdk', label: 'SDK Documentation', category: 'Docs', icon: 'book-open', action: () => window.open('https://github.com/identark/sdk#readme', '_blank') },
    { id: 'docs-api', label: 'API Reference', category: 'Docs', icon: 'code', action: () => window.open('https://github.com/identark/sdk#api-reference', '_blank') },
    { id: 'docs-python', label: 'Python SDK Guide', category: 'Docs', icon: 'file-text', action: () => window.open('https://github.com/identark/sdk#python', '_blank') },
    { id: 'docs-typescript', label: 'TypeScript SDK Guide', category: 'Docs', icon: 'file-text', action: () => window.open('https://github.com/identark/sdk#typescript', '_blank') },

    // Quick Settings
    { id: 'settings-theme', label: 'Toggle Theme', category: 'Settings', icon: 'moon', action: toggleTheme },
    { id: 'settings-logout', label: 'Log Out', category: 'Settings', icon: 'log-out', action: () => navigate('/login.html') },
  ];

  // ────────────────────────────────────────────────────────────────────────────
  // Icons (inline SVG for performance)
  // ────────────────────────────────────────────────────────────────────────────

  const icons = {
    'grid': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    'key': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    'cpu': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
    'activity': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'settings': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    'credit-card': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    'terminal': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    'plus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    'plus-circle': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    'user-plus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
    'book-open': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'code': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    'file-text': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    'moon': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    'log-out': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    'search': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  };

  // ────────────────────────────────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────────────────────────────────

  let isOpen = false;
  let selectedIndex = 0;
  let filteredCommands = [...commands];
  let palette = null;
  let input = null;
  let results = null;

  // ────────────────────────────────────────────────────────────────────────────
  // Initialize
  // ────────────────────────────────────────────────────────────────────────────

  function init() {
    createPalette();
    bindKeyboardShortcuts();
  }

  function createPalette() {
    // Create overlay
    palette = document.createElement('div');
    palette.id = 'command-palette';
    palette.className = 'command-palette-overlay';
    palette.setAttribute('role', 'dialog');
    palette.setAttribute('aria-modal', 'true');
    palette.setAttribute('aria-label', 'Command palette');

    palette.innerHTML = `
      <div class="command-palette">
        <div class="command-palette-header">
          <span class="command-palette-search-icon">${icons.search}</span>
          <input
            type="text"
            class="command-palette-input"
            placeholder="Type a command or search..."
            aria-label="Search commands"
            autocomplete="off"
            spellcheck="false"
          >
          <kbd class="command-palette-kbd">ESC</kbd>
        </div>
        <div class="command-palette-results" role="listbox" aria-label="Commands"></div>
        <div class="command-palette-footer">
          <div class="command-palette-hint">
            <kbd>↑↓</kbd> to navigate
            <kbd>↵</kbd> to select
            <kbd>esc</kbd> to close
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(palette);

    input = palette.querySelector('.command-palette-input');
    results = palette.querySelector('.command-palette-results');

    // Event listeners
    palette.addEventListener('click', (e) => {
      if (e.target === palette) close();
    });

    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);

    results.addEventListener('click', (e) => {
      const item = e.target.closest('.command-palette-item');
      if (item) {
        const index = parseInt(item.dataset.index, 10);
        executeCommand(filteredCommands[index]);
      }
    });

    results.addEventListener('mouseover', (e) => {
      const item = e.target.closest('.command-palette-item');
      if (item) {
        selectedIndex = parseInt(item.dataset.index, 10);
        updateSelection();
      }
    });

    // Initial render
    renderResults();
  }

  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ⌘K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }

      // / to open (when not in input)
      if (e.key === '/' && !isInputFocused() && !isOpen) {
        e.preventDefault();
        open();
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Open / Close
  // ────────────────────────────────────────────────────────────────────────────

  function open() {
    if (isOpen) return;

    isOpen = true;
    selectedIndex = 0;
    filteredCommands = [...commands];

    palette.classList.add('open');
    document.body.style.overflow = 'hidden';

    input.value = '';
    renderResults();

    requestAnimationFrame(() => {
      input.focus();
    });
  }

  function close() {
    if (!isOpen) return;

    isOpen = false;
    palette.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Input Handling
  // ────────────────────────────────────────────────────────────────────────────

  function handleInput(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      filteredCommands = [...commands];
    } else {
      filteredCommands = commands.filter(cmd => {
        const label = cmd.label.toLowerCase();
        const category = cmd.category.toLowerCase();
        return label.includes(query) || category.includes(query);
      });
    }

    selectedIndex = 0;
    renderResults();
  }

  function handleKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
        updateSelection();
        scrollIntoView();
        break;

      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
        scrollIntoView();
        break;

      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        close();
        break;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Rendering
  // ────────────────────────────────────────────────────────────────────────────

  function renderResults() {
    if (filteredCommands.length === 0) {
      results.innerHTML = `
        <div class="command-palette-empty">
          <span class="command-palette-empty-icon">${icons.search}</span>
          <span>No commands found</span>
        </div>
      `;
      return;
    }

    // Group by category
    const grouped = {};
    filteredCommands.forEach((cmd, index) => {
      if (!grouped[cmd.category]) {
        grouped[cmd.category] = [];
      }
      grouped[cmd.category].push({ ...cmd, index });
    });

    let html = '';
    Object.entries(grouped).forEach(([category, cmds]) => {
      html += `<div class="command-palette-group">
        <div class="command-palette-group-label">${category}</div>`;

      cmds.forEach(cmd => {
        const icon = icons[cmd.icon] || icons.code;
        const isSelected = cmd.index === selectedIndex;
        html += `
          <div
            class="command-palette-item ${isSelected ? 'selected' : ''}"
            data-index="${cmd.index}"
            role="option"
            aria-selected="${isSelected}"
          >
            <span class="command-palette-item-icon">${icon}</span>
            <span class="command-palette-item-label">${highlightMatch(cmd.label, input.value)}</span>
          </div>`;
      });

      html += '</div>';
    });

    results.innerHTML = html;
  }

  function updateSelection() {
    const items = results.querySelectorAll('.command-palette-item');
    items.forEach((item, i) => {
      const isSelected = parseInt(item.dataset.index, 10) === selectedIndex;
      item.classList.toggle('selected', isSelected);
      item.setAttribute('aria-selected', isSelected);
    });
  }

  function scrollIntoView() {
    const selected = results.querySelector('.command-palette-item.selected');
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  function highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Command Execution
  // ────────────────────────────────────────────────────────────────────────────

  function executeCommand(command) {
    close();

    // Small delay for visual feedback
    setTimeout(() => {
      command.action();
    }, 100);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Actions
  // ────────────────────────────────────────────────────────────────────────────

  function navigate(path) {
    window.location.href = path;
  }

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('identark_theme', isLight ? 'light' : 'dark');
    window.IdentArk?.showToast?.(isLight ? 'Light theme enabled' : 'Dark theme enabled', 'info');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Utilities
  // ────────────────────────────────────────────────────────────────────────────

  function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Public API
  // ────────────────────────────────────────────────────────────────────────────

  window.CommandPalette = {
    open,
    close,
    toggle,
    registerCommand: (cmd) => {
      commands.push(cmd);
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
