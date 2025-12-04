/**
 * APIClient - Handles all API requests to the backend
 */
class APIClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000/api';
    this.timeout = config.timeout || 5000;
    this.onLoadingChange = config.onLoadingChange || (() => {});
  }

  /**
   * Make a request to the API
   */
  async request(endpoint, data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      this.onLoadingChange(true);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Request failed');
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }

      throw error;
    } finally {
      this.onLoadingChange(false);
    }
  }

  /**
   * ELI5 - Explain Like I'm 5
   */
  async eli5(text, context = '') {
    return this.request('/eli5', { text, context });
  }

  /**
   * Summarize text
   */
  async summarize(text, format = 'bullets') {
    return this.request('/summarize', { text, format });
  }

  /**
   * Define terms
   */
  async define(text, terms = []) {
    return this.request('/define', { text, terms });
  }

  /**
   * Explain text
   */
  async explain(text, level = 'simple') {
    return this.request('/explain', { text, level });
  }

  /**
   * Give examples
   */
  async giveExample(text, exampleType = 'real-world') {
    return this.request('/example', { text, exampleType });
  }

  /**
   * Analyze article
   */
  async getArticleSummary(url, content) {
    return this.request('/article/analyze', { url, content });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIClient;
}
