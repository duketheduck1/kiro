/**
 * InteractionMenu - Contextual menu that appears near text selection
 */
class InteractionMenu {
  constructor(config = {}) {
    this.config = {
      onOptionSelected: config.onOptionSelected || (() => {}),
      ...config
    };

    this.element = null;
    this.visible = false;
    this.currentPosition = { x: 0, y: 0 };
    
    this.options = [
      { id: 'eli5', label: '📚 ELI5', title: 'Explain like I\'m 5' },
      { id: 'summarize', label: '📝 Summarize', title: 'Get key points' },
      { id: 'define', label: '📖 Define', title: 'Define terms' },
      { id: 'example', label: '🌟 Example', title: 'Give examples' },
      { id: 'explain', label: '💡 Explain', title: 'Plain explanation' }
    ];

    this.createMenu();
    this.attachStyles();
  }

  /**
   * Create menu DOM structure
   */
  createMenu() {
    const menu = document.createElement('div');
    menu.id = 'clippy-interaction-menu';
    menu.className = 'clippy-menu clippy-menu-hidden';

    // Create option buttons
    this.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'clippy-menu-option';
      button.dataset.option = option.id;
      button.textContent = option.label;
      button.title = option.title;
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleOptionClick(option.id);
      });
      menu.appendChild(button);
    });

    document.body.appendChild(menu);
    this.element = menu;

    // Hide menu when clicking outside (with delay to allow clicking menu items)
    document.addEventListener('mousedown', (e) => {
      // Don't hide if clicking on the menu itself
      if (this.element.contains(e.target)) {
        return;
      }
      
      // Small delay to allow menu interaction
      setTimeout(() => {
        if (this.visible && !this.element.contains(e.target)) {
          this.hide();
        }
      }, 100);
    });
  }

  /**
   * Attach menu styles
   */
  attachStyles() {
    if (document.getElementById('clippy-menu-styles')) return;

    const style = document.createElement('style');
    style.id = 'clippy-menu-styles';
    style.textContent = `
      .clippy-menu {
        position: absolute;
        display: flex;
        gap: 8px;
        background: #1a1a2e;
        border: 2px solid #ff6b35;
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4), 0 0 20px rgba(138, 43, 226, 0.3);
        z-index: 1000000;
        transition: opacity 0.15s, transform 0.15s;
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .clippy-menu-hidden {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: opacity 0.15s, transform 0.15s, pointer-events 0s 0.15s;
      }

      .clippy-menu-option {
        background: linear-gradient(135deg, #ff6b35 0%, #8b2bca 100%);
        color: white;
        border: 1px solid rgba(255, 107, 53, 0.3);
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        transition: all 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
      }

      .clippy-menu-option:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 6px 16px rgba(255, 107, 53, 0.5), 0 0 20px rgba(138, 43, 226, 0.4);
        background: linear-gradient(135deg, #ff8555 0%, #a040e0 100%);
      }

      .clippy-menu-option:active {
        transform: translateY(-1px) scale(1.02);
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Show menu at specified position
   */
  show(position) {
    this.currentPosition = position;
    this.visible = true;

    // Position the menu
    const menuWidth = 500; // Approximate width
    const menuHeight = 50; // Approximate height
    
    let x = position.x - (menuWidth / 2);
    let y = position.y + 10;

    // Keep menu within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x < 10) x = 10;
    if (x + menuWidth > viewportWidth - 10) x = viewportWidth - menuWidth - 10;
    if (y + menuHeight > viewportHeight - 10) y = position.top - menuHeight - 10;

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.classList.remove('clippy-menu-hidden');
  }

  /**
   * Hide the menu
   */
  hide() {
    this.visible = false;
    this.element.classList.add('clippy-menu-hidden');
  }

  /**
   * Handle option click
   */
  handleOptionClick(optionId) {
    this.config.onOptionSelected(optionId);
    this.hide();
  }

  /**
   * Check if menu is visible
   */
  isVisible() {
    return this.visible;
  }

  /**
   * Destroy the menu
   */
  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractionMenu;
}
