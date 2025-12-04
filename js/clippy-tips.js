/**
 * ClippyTips - Classic Clippy-style helpful tips and suggestions
 */
class ClippyTips {
  constructor(widget) {
    this.widget = widget;
    this.tips = [
      "It looks like you're reading an article. Would you like help understanding it?",
      "Need help with a tricky paragraph? Just select it!",
      "Would you like me to simplify something?",
      "Can I assist you with that complex term?",
      "It looks like you're learning something new!",
      "Stuck on a concept? I can explain it simply!",
      "Would you like help with your reading?",
      "Looks like you're exploring quantum computing!",
      "Can I give you a hand with definitions?",
      "It looks like you're trying to understand something complex.",
      "Need a summary? Just select the text!",
      "Would you like me to break that down for you?",
      "Confused by jargon? I can help!",
      "It seems you're reading about science. Want examples?",
      "Can I explain that in simpler terms?",
      "Would you like to see some real-world examples?",
      "Looks like you're doing research!",
      "Need help understanding technical terms?",
      "Would you like a quick summary of this section?",
      "It looks like you're trying to learn. I'm here to help!",
      "Highlight any text and I'll explain it!",
      "Want me to make this easier to understand?",
      "Need definitions? Just ask!",
      "Would you like me to simplify this article?",
      "It looks like you're reading something interesting!",
      "Can I help you understand this better?",
      "Stuck? Select text and I'll help!",
      "Would you like examples to make this clearer?",
      "It seems you're exploring new topics!",
      "Need a hand with comprehension?",
      "Would you like me to explain like you're 5?",
      "Looks like you're expanding your knowledge!",
      "Can I break down complex ideas for you?",
      "It looks like you're trying to grasp a difficult concept.",
      "Want me to give you the key points?",
      "Would you like help with vocabulary?",
      "Need analogies to understand better?",
      "It looks like you're reading technical content!",
      "Can I make this more digestible?",
      "Would you like a plain-language explanation?"
    ];
    
    this.shownToday = new Set();
    this.tipTimeout = null;
    this.currentTipElement = null;
    this.enabled = true;
    this.minInterval = 30000; // 30 seconds minimum between tips
    this.maxInterval = 90000; // 90 seconds maximum between tips
    this.tipDuration = 15000; // 15 seconds before auto-close
    
    this.loadPreferences();
    this.startTipScheduler();
  }

  /**
   * Load user preferences from localStorage
   */
  loadPreferences() {
    const prefs = localStorage.getItem('clippy-tips-prefs');
    if (prefs) {
      const data = JSON.parse(prefs);
      this.enabled = data.enabled !== false;
      
      // Check if we should reset daily shown tips
      const lastDate = data.lastDate;
      const today = new Date().toDateString();
      if (lastDate !== today) {
        this.shownToday.clear();
        this.savePreferences();
      } else {
        this.shownToday = new Set(data.shownToday || []);
      }
    }
  }

  /**
   * Save user preferences to localStorage
   */
  savePreferences() {
    const data = {
      enabled: this.enabled,
      lastDate: new Date().toDateString(),
      shownToday: Array.from(this.shownToday)
    };
    localStorage.setItem('clippy-tips-prefs', JSON.stringify(data));
  }

  /**
   * Start the tip scheduler
   */
  startTipScheduler() {
    if (!this.enabled) return;
    
    const scheduleNext = () => {
      const delay = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
      this.tipTimeout = setTimeout(() => {
        this.showRandomTip();
        scheduleNext();
      }, delay);
    };
    
    // Show first tip after 10 seconds
    setTimeout(() => {
      this.showRandomTip();
      scheduleNext();
    }, 10000);
  }

  /**
   * Show a random tip
   */
  showRandomTip() {
    if (!this.enabled) return;
    if (this.currentTipElement) return; // Don't show if one is already visible
    
    // Get tips that haven't been shown today
    const availableTips = this.tips.filter((_, index) => !this.shownToday.has(index));
    
    // If all tips shown, reset
    if (availableTips.length === 0) {
      this.shownToday.clear();
      this.savePreferences();
      return;
    }
    
    // Pick random tip
    const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
    const tipIndex = this.tips.indexOf(randomTip);
    
    this.shownToday.add(tipIndex);
    this.savePreferences();
    
    this.showTip(randomTip);
  }

  /**
   * Show a specific tip
   */
  showTip(message) {
    // Create tip bubble
    const bubble = document.createElement('div');
    bubble.className = 'clippy-tip-bubble';
    bubble.innerHTML = `
      <div class="clippy-tip-content">
        <div class="clippy-tip-message">${this.escapeHtml(message)}</div>
        <div class="clippy-tip-actions">
          <button class="clippy-tip-btn clippy-tip-close">Got it!</button>
          <button class="clippy-tip-btn clippy-tip-disable-today">Don't show today</button>
        </div>
      </div>
    `;
    
    // Position near widget
    const widgetRect = this.widget.elements.container.getBoundingClientRect();
    bubble.style.position = 'fixed';
    bubble.style.right = `${window.innerWidth - widgetRect.left + 10}px`;
    bubble.style.bottom = `${window.innerHeight - widgetRect.top - 30}px`;
    
    document.body.appendChild(bubble);
    this.currentTipElement = bubble;
    
    // Add event listeners
    bubble.querySelector('.clippy-tip-close').addEventListener('click', () => {
      this.closeTip();
    });
    
    bubble.querySelector('.clippy-tip-disable-today').addEventListener('click', () => {
      this.disableToday();
    });
    
    // Auto-close after duration
    setTimeout(() => {
      if (this.currentTipElement === bubble) {
        this.closeTip();
      }
    }, this.tipDuration);
    
    // Animate in
    setTimeout(() => {
      bubble.classList.add('clippy-tip-visible');
    }, 10);
  }

  /**
   * Close current tip
   */
  closeTip() {
    if (!this.currentTipElement) return;
    
    this.currentTipElement.classList.remove('clippy-tip-visible');
    setTimeout(() => {
      if (this.currentTipElement) {
        this.currentTipElement.remove();
        this.currentTipElement = null;
      }
    }, 300);
  }

  /**
   * Disable tips for today
   */
  disableToday() {
    // Mark all tips as shown for today
    this.tips.forEach((_, index) => {
      this.shownToday.add(index);
    });
    this.savePreferences();
    this.closeTip();
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Attach styles
   */
  static attachStyles() {
    if (document.getElementById('clippy-tips-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'clippy-tips-styles';
    style.textContent = `
      .clippy-tip-bubble {
        position: fixed;
        background: #1a1a2e;
        border: 2px solid #ff6b35;
        border-radius: 12px;
        padding: 16px;
        max-width: 280px;
        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4), 0 0 30px rgba(138, 43, 226, 0.3);
        z-index: 999998;
        opacity: 0;
        transform: scale(0.8) translateY(10px);
        transition: opacity 0.3s, transform 0.3s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: spookyGlow 2s ease-in-out infinite;
      }

      @keyframes spookyGlow {
        0%, 100% { box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4), 0 0 30px rgba(138, 43, 226, 0.3); }
        50% { box-shadow: 0 4px 25px rgba(255, 107, 53, 0.6), 0 0 40px rgba(138, 43, 226, 0.5); }
      }

      .clippy-tip-bubble::before {
        content: '';
        position: absolute;
        right: -10px;
        bottom: 30px;
        width: 0;
        height: 0;
        border-left: 10px solid #ff6b35;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
      }

      .clippy-tip-bubble::after {
        content: '';
        position: absolute;
        right: -7px;
        bottom: 31px;
        width: 0;
        height: 0;
        border-left: 8px solid #1a1a2e;
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
      }

      .clippy-tip-visible {
        opacity: 1;
        transform: scale(1) translateY(0);
      }

      .clippy-tip-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .clippy-tip-message {
        font-size: 14px;
        line-height: 1.5;
        color: #e0e0e0;
      }

      .clippy-tip-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .clippy-tip-btn {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
      }

      .clippy-tip-btn:hover {
        background: #ff8555;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.5);
      }

      .clippy-tip-disable-today {
        background: #8b2bca;
      }

      .clippy-tip-disable-today:hover {
        background: #a040e0;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Attach styles when loaded
if (typeof document !== 'undefined') {
  ClippyTips.attachStyles();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClippyTips;
}
