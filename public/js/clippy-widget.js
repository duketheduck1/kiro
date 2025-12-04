/**
 * ClippyWidget - Floating AI reading assistant widget
 */
class ClippyWidget {
  constructor(config = {}) {
    this.config = {
      position: config.position || 'bottom-right',
      apiBaseUrl: config.apiBaseUrl || 'http://localhost:3000/api',
      theme: config.theme || 'light',
      ...config
    };

    this.state = {
      visible: false,
      minimized: true,
      loading: false,
      currentResponse: null,
      selectedText: null
    };

    this.elements = {};
    this.init();
  }

  /**
   * Initialize the widget
   */
  init() {
    this.createWidget();
    this.attachStyles();
    this.show();
  }

  /**
   * Create widget DOM structure
   */
  createWidget() {
    // Floating bubble button
    const bubble = document.createElement('div');
    bubble.id = 'clippy-bubble';
    bubble.className = 'clippy-bubble';
    bubble.innerHTML = `
      <div class="clippy-bubble-icon">📎</div>
      <div class="clippy-bubble-hat">🎃</div>
    `;
    
    // Main chat container
    const container = document.createElement('div');
    container.id = 'clippy-widget';
    container.className = `clippy-widget clippy-${this.config.position} clippy-hidden`;
    
    // Widget content
    container.innerHTML = `
      <div class="clippy-header">
        <div class="clippy-icon">📎</div>
        <div class="clippy-title">Clippy Reborn</div>
        <button class="clippy-close" aria-label="Close">×</button>
      </div>
      <div class="clippy-body">
        <div class="clippy-response"></div>
        <div class="clippy-loading">
          <div class="clippy-spinner"></div>
          <span>Clippy is thinking...</span>
        </div>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(container);

    // Store element references
    this.elements.bubble = bubble;
    this.elements.container = container;
    this.elements.header = container.querySelector('.clippy-header');
    this.elements.body = container.querySelector('.clippy-body');
    this.elements.response = container.querySelector('.clippy-response');
    this.elements.loading = container.querySelector('.clippy-loading');
    this.elements.closeBtn = container.querySelector('.clippy-close');

    // Attach event listeners
    bubble.addEventListener('click', () => this.toggleChat());
    this.elements.closeBtn.addEventListener('click', () => this.toggleChat());
    this.elements.header.addEventListener('click', (e) => {
      if (e.target === this.elements.header || e.target.classList.contains('clippy-title') || e.target.classList.contains('clippy-icon')) {
        // Do nothing, let close button handle closing
      }
    });
  }

  /**
   * Attach widget styles
   */
  attachStyles() {
    if (document.getElementById('clippy-widget-styles')) return;

    const style = document.createElement('style');
    style.id = 'clippy-widget-styles';
    style.textContent = `
      /* Floating Chat Bubble */
      .clippy-bubble {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4), 0 0 60px rgba(118, 75, 162, 0.3);
        z-index: 999998;
        transition: all 0.3s ease;
        animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes pulse {
        0%, 100% { box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4), 0 0 60px rgba(118, 75, 162, 0.3); }
        50% { box-shadow: 0 8px 40px rgba(102, 126, 234, 0.6), 0 0 80px rgba(118, 75, 162, 0.5); }
      }

      .clippy-bubble:hover {
        transform: scale(1.1) translateY(-5px);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6), 0 0 100px rgba(118, 75, 162, 0.5);
      }

      .clippy-bubble-hidden {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.5);
      }

      .clippy-bubble-icon {
        font-size: 40px;
        animation: wiggle 2s ease-in-out infinite;
      }

      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
      }

      .clippy-bubble-hat {
        position: absolute;
        top: -5px;
        right: 5px;
        font-size: 24px;
        animation: float-hat 2s ease-in-out infinite;
      }

      @keyframes float-hat {
        0%, 100% { transform: translateY(0px) rotate(-15deg); }
        50% { transform: translateY(-5px) rotate(-20deg); }
      }

      /* Chat Window */
      .clippy-widget {
        position: fixed;
        bottom: 130px;
        right: 30px;
        width: 380px;
        max-height: 550px;
        background: #1a1a2e;
        border: 2px solid #667eea;
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(102, 126, 234, 0.4), 0 0 60px rgba(118, 75, 162, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 999999;
        transition: all 0.3s ease;
        opacity: 1;
        transform: scale(1);
      }

      .clippy-widget.clippy-hidden {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.9) translateY(20px);
      }

      .clippy-widget.talking {
        animation: bounce 0.5s ease-in-out;
      }

      @keyframes bounce {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.05); }
        50% { transform: scale(0.98); }
        75% { transform: scale(1.02); }
      }



      .clippy-header {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 14px 14px 0 0;
        user-select: none;
        position: relative;
        overflow: hidden;
      }

      .clippy-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: shimmer 3s linear infinite;
      }

      @keyframes shimmer {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .clippy-icon {
        font-size: 28px;
        margin-right: 12px;
        position: relative;
        z-index: 1;
      }

      .clippy-title {
        flex: 1;
        font-weight: 600;
        font-size: 16px;
      }

      .clippy-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        transition: all 0.2s;
        z-index: 1;
      }

      .clippy-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }

      .clippy-body {
        padding: 16px;
        max-height: 440px;
        overflow-y: auto;
        background: #16213e;
      }

      .clippy-body::-webkit-scrollbar {
        width: 8px;
      }

      .clippy-body::-webkit-scrollbar-track {
        background: #0f1419;
      }

      .clippy-body::-webkit-scrollbar-thumb {
        background: #ff6b35;
        border-radius: 4px;
      }

      .clippy-response {
        font-size: 14px;
        line-height: 1.6;
        color: #e0e0e0;
        animation: fadeIn 0.5s ease-in;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .clippy-response:empty {
        display: none;
      }

      .clippy-loading {
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #666;
      }

      .clippy-loading.active {
        display: flex;
      }

      .clippy-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: clippy-spin 1s linear infinite;
        margin-right: 10px;
      }

      @keyframes clippy-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .clippy-response h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #ff6b35;
        text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
      }

      .clippy-response ul {
        margin: 8px 0;
        padding-left: 20px;
      }

      .clippy-response li {
        margin: 6px 0;
      }

      .clippy-response p {
        margin: 8px 0;
      }

      .clippy-hidden {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Show the widget
   */
  show() {
    this.state.visible = true;
    this.elements.bubble.classList.remove('clippy-bubble-hidden');
    // Start with chat closed
    this.state.minimized = true;
  }

  /**
   * Hide the widget
   */
  hide() {
    this.state.visible = false;
    this.elements.container.classList.add('clippy-hidden');
  }

  /**
   * Toggle chat window
   */
  toggleChat() {
    this.state.minimized = !this.state.minimized;
    if (this.state.minimized) {
      this.elements.container.classList.add('clippy-hidden');
      this.elements.bubble.classList.remove('clippy-bubble-hidden');
    } else {
      this.elements.container.classList.remove('clippy-hidden');
      this.elements.bubble.classList.add('clippy-bubble-hidden');
    }
  }

  /**
   * Toggle minimize state (legacy support)
   */
  toggleMinimize() {
    this.toggleChat();
  }

  /**
   * Set widget position
   */
  setPosition(x, y) {
    // For floating near selection, we'll handle this in the menu component
    // This method is here for future positioning needs
    this.elements.container.style.position = 'fixed';
    this.elements.container.style.left = `${x}px`;
    this.elements.container.style.top = `${y}px`;
  }

  /**
   * Display a response in the widget
   */
  displayResponse(response, type) {
    this.state.currentResponse = response;
    this.state.loading = false;
    this.elements.loading.classList.remove('active');

    // Open chat if closed
    if (this.state.minimized) {
      this.toggleChat();
    }

    // Trigger talking animation
    this.elements.container.classList.add('talking');
    setTimeout(() => {
      this.elements.container.classList.remove('talking');
    }, 500);

    let html = '';

    switch (type) {
      case 'eli5':
        html = `<h3>📚 Simple Explanation</h3><p>${this.escapeHtml(response.content)}</p>`;
        break;
      
      case 'summarize':
        html = `<h3>📝 Summary</h3>`;
        if (response.keyPoints && response.keyPoints.length > 0) {
          html += '<ul>';
          response.keyPoints.forEach(point => {
            html += `<li>${this.escapeHtml(point)}</li>`;
          });
          html += '</ul>';
        } else {
          html += `<p>${this.escapeHtml(response.content)}</p>`;
        }
        break;
      
      case 'define':
        html = `<h3>📖 Definitions</h3>`;
        if (response.definitions && response.definitions.length > 0) {
          response.definitions.forEach(def => {
            html += `<p><strong>${this.escapeHtml(def.term)}:</strong> ${this.escapeHtml(def.definition)}</p>`;
          });
        }
        break;
      
      case 'explain':
        html = `<h3>💡 Explanation</h3><p>${this.escapeHtml(response.content)}</p>`;
        break;
      
      case 'example':
        html = `<h3>🌟 Examples</h3>`;
        if (response.examples && response.examples.length > 0) {
          html += '<ul>';
          response.examples.forEach(example => {
            html += `<li>${this.escapeHtml(example)}</li>`;
          });
          html += '</ul>';
        }
        break;
      
      default:
        html = `<p>${this.escapeHtml(response.content || JSON.stringify(response))}</p>`;
    }

    this.elements.response.innerHTML = html;
    
    // Expand if minimized
    if (this.state.minimized) {
      this.toggleMinimize();
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.state.loading = true;
    this.elements.loading.classList.add('active');
    this.elements.response.innerHTML = '';
    
    // Expand if minimized
    if (this.state.minimized) {
      this.toggleMinimize();
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.state.loading = false;
    this.elements.loading.classList.remove('active');
  }

  /**
   * Display error message
   */
  displayError(message) {
    this.hideLoading();
    this.elements.response.innerHTML = `
      <div style="color: #e74c3c; padding: 12px; background: #fee; border-radius: 6px;">
        <strong>Oops!</strong> ${this.escapeHtml(message)}
      </div>
    `;
    
    if (this.state.minimized) {
      this.toggleMinimize();
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Destroy the widget
   */
  destroy() {
    if (this.elements.container) {
      this.elements.container.remove();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClippyWidget;
}
