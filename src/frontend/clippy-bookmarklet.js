/**
 * Clippy Bookmarklet Loader
 * This script loads Clippy on any webpage
 */

(function() {
  'use strict';

  // Prevent multiple loads
  if (window.clippyBookmarkletActive) {
    console.log('📎 Clippy is already active!');
    return;
  }
  window.clippyBookmarkletActive = true;

  console.log('📎 Loading Clippy Bookmarklet...');

  const CLIPPY_SERVER = 'http://localhost:3000';

  // Load CSS for the widget
  function loadCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Clippy Bookmarklet Styles */
      .clippy-bookmarklet-notice {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .clippy-bookmarklet-notice.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
      }

      @keyframes fadeOut {
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Show activation notice
  function showNotice() {
    const notice = document.createElement('div');
    notice.className = 'clippy-bookmarklet-notice';
    notice.innerHTML = '📎 Clippy is now active! Select any text to get help.';
    document.body.appendChild(notice);

    setTimeout(() => {
      notice.classList.add('fade-out');
      setTimeout(() => notice.remove(), 300);
    }, 3000);
  }

  // Load external script
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  // Initialize Clippy
  async function initClippy() {
    try {
      loadCSS();

      // Load all required scripts in order
      await loadScript(`${CLIPPY_SERVER}/js/api-client.js`);
      await loadScript(`${CLIPPY_SERVER}/js/clippy-widget.js`);
      await loadScript(`${CLIPPY_SERVER}/js/highlight-detector.js`);
      await loadScript(`${CLIPPY_SERVER}/js/interaction-menu.js`);
      await loadScript(`${CLIPPY_SERVER}/js/clippy-tips.js`);
      await loadScript(`${CLIPPY_SERVER}/js/clippy-app.js`);

      // Initialize Clippy
      window.clippyBookmarklet = new ClippyApp({
        apiBaseUrl: `${CLIPPY_SERVER}/api`,
        position: 'bottom-right',
        theme: 'light'
      });

      showNotice();
      console.log('✅ Clippy is ready! Select text to use it.');

    } catch (error) {
      console.error('❌ Failed to load Clippy:', error);
      alert('Failed to load Clippy. Make sure the server is running at ' + CLIPPY_SERVER);
    }
  }

  // Start loading
  initClippy();
})();
