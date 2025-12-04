/**
 * HighlightDetector - Detects text selection and provides selection info
 */
class HighlightDetector {
  constructor() {
    this.callbacks = [];
    this.lastSelection = null;
    this.selectionTimeout = null;
  }

  /**
   * Initialize the detector
   */
  initialize() {
    // Listen for mouseup events (when user finishes selecting)
    document.addEventListener('mouseup', (e) => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        this.handleSelection();
      }, 50);
    });
    
    // Listen for keyup events (for keyboard selection)
    document.addEventListener('keyup', (e) => {
      // Only check on arrow keys or shift key (selection keys)
      if (e.key.includes('Arrow') || e.key === 'Shift') {
        setTimeout(() => {
          this.handleSelection();
        }, 50);
      }
    });
  }

  /**
   * Handle text selection
   */
  handleSelection() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    // Only trigger if there's actual text selected (minimum 3 characters)
    if (text.length >= 3) {
      const position = this.getSelectionPosition();
      const selectionData = {
        text,
        position,
        range: selection.getRangeAt(0)
      };

      this.lastSelection = selectionData;
      this.notifyCallbacks(selectionData);
    } else if (this.lastSelection && text.length === 0) {
      // Selection was cleared
      this.lastSelection = null;
    }
  }

  /**
   * Get the position of the current selection
   */
  getSelectionPosition() {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      return { x: 0, y: 0 };
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      x: rect.left + (rect.width / 2),
      y: rect.bottom + window.scrollY,
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * Get the currently selected text
   */
  getSelectedText() {
    return window.getSelection().toString().trim();
  }

  /**
   * Clear the current selection
   */
  clearSelection() {
    window.getSelection().removeAllRanges();
    this.lastSelection = null;
  }

  /**
   * Register a callback for text selection events
   */
  onTextSelected(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  /**
   * Notify all registered callbacks
   */
  notifyCallbacks(selectionData) {
    this.callbacks.forEach(callback => {
      try {
        callback(selectionData);
      } catch (error) {
        console.error('Error in selection callback:', error);
      }
    });
  }

  /**
   * Remove a callback
   */
  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Get the last selection data
   */
  getLastSelection() {
    return this.lastSelection;
  }

  /**
   * Check if there's currently selected text
   */
  hasSelection() {
    return this.lastSelection !== null && this.lastSelection.text.length > 0;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HighlightDetector;
}
