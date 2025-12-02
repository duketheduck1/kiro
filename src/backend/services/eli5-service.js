import { getOpenAIClient } from './openai-client.js';
import { getPromptBuilder } from './prompt-builder.js';

/**
 * Service for ELI5 (Explain Like I'm 5) operations
 */
class ELI5Service {
  constructor() {
    this.openaiClient = getOpenAIClient();
    this.promptBuilder = getPromptBuilder();
  }

  /**
   * Simplify text to child-friendly language
   * @param {string} text - Text to simplify
   * @param {string} context - Optional article context
   * @returns {Promise<Object>} - Simplified explanation with metadata
   */
  async simplify(text, context = '') {
    const prompt = this.promptBuilder.buildELI5Prompt(text, context);
    const systemPrompt = this.promptBuilder.buildSystemPrompt('eli5');

    const result = await this.openaiClient.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 300
    });

    return {
      explanation: result.content.trim(),
      metadata: result.metadata
    };
  }
}

// Singleton instance
let instance = null;

export function getELI5Service() {
  if (!instance) {
    instance = new ELI5Service();
  }
  return instance;
}

export default ELI5Service;
