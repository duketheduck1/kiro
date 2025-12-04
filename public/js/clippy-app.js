/**
 * ClippyApp - Main application that integrates all components
 */
class ClippyApp {
  constructor(config = {}) {
    this.config = {
      apiBaseUrl: config.apiBaseUrl || 'http://localhost:3000/api',
      position: config.position || 'bottom-right',
      theme: config.theme || 'light',
      ...config
    };

    this.widget = null;
    this.highlightDetector = null;
    this.interactionMenu = null;
    this.apiClient = null;
    this.currentSelection = null;
    this.clippyTips = null;

    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    // Initialize API client
    this.apiClient = new APIClient({
      baseUrl: this.config.apiBaseUrl,
      onLoadingChange: (loading) => {
        if (loading) {
          this.widget.showLoading();
        } else {
          this.widget.hideLoading();
        }
      }
    });

    // Initialize widget
    this.widget = new ClippyWidget({
      position: this.config.position,
      apiBaseUrl: this.config.apiBaseUrl,
      theme: this.config.theme
    });

    // Initialize highlight detector
    this.highlightDetector = new HighlightDetector();
    this.highlightDetector.initialize();
    this.highlightDetector.onTextSelected((selection) => {
      this.handleTextSelection(selection);
    });

    // Initialize interaction menu
    this.interactionMenu = new InteractionMenu({
      onOptionSelected: (optionId) => {
        this.handleOptionSelected(optionId);
      }
    });

    // Initialize Clippy tips (classic popup messages)
    if (typeof ClippyTips !== 'undefined') {
      this.clippyTips = new ClippyTips(this.widget);
    }

    console.log('📎 Clippy Reader AI initialized!');
  }

  /**
   * Handle text selection
   */
  handleTextSelection(selection) {
    this.currentSelection = selection;
    this.interactionMenu.show(selection.position);
  }

  /**
   * Handle option selection from menu
   */
  async handleOptionSelected(optionId) {
    if (!this.currentSelection) {
      console.error('No selection available');
      return;
    }

    const text = this.currentSelection.text;
    console.log(`Processing ${optionId} for text:`, text.substring(0, 50) + '...');

    try {
      let response;

      switch (optionId) {
        case 'eli5':
          response = await this.apiClient.eli5(text);
          this.widget.displayResponse(response.data, 'eli5');
          break;

        case 'summarize':
          response = await this.apiClient.summarize(text);
          this.widget.displayResponse(response.data, 'summarize');
          break;

        case 'define':
          response = await this.apiClient.define(text);
          this.widget.displayResponse(response.data, 'define');
          break;

        case 'explain':
          response = await this.apiClient.explain(text);
          this.widget.displayResponse(response.data, 'explain');
          break;

        case 'example':
          response = await this.apiClient.giveExample(text);
          this.widget.displayResponse(response.data, 'example');
          break;

        default:
          console.warn('Unknown option:', optionId);
      }
      
      console.log(`✅ ${optionId} completed successfully`);
    } catch (error) {
      console.error('Error processing request:', error);
      this.widget.displayError(error.message || 'Something went wrong. Please try again.');
    }
  }

  /**
   * Destroy the application
   */
  destroy() {
    if (this.widget) this.widget.destroy();
    if (this.interactionMenu) this.interactionMenu.destroy();
  }
}

// Auto-initialize if in browser and not in module context
if (typeof window !== 'undefined' && typeof module === 'undefined') {
  window.ClippyApp = ClippyApp;
  window.ClippyWidget = ClippyWidget;
  window.HighlightDetector = HighlightDetector;
  window.InteractionMenu = InteractionMenu;
  window.APIClient = APIClient;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClippyApp;
}
