import { getOpenAIClient } from './openai-client.js';
import { getPromptBuilder } from './prompt-builder.js';

/**
 * Service for definition and explanation operations
 */
class DefinitionService {
  constructor() {
    this.openaiClient = getOpenAIClient();
    this.promptBuilder = getPromptBuilder();
  }

  /**
   * Get definitions for terms in text
   * @param {string} text - Text containing terms to define
   * @param {Array<string>} terms - Optional specific terms to define
   * @returns {Promise<Object>} - Definitions with metadata
   */
  async define(text, terms = []) {
    const prompt = this.promptBuilder.buildDefinitionPrompt(text, terms);
    const systemPrompt = this.promptBuilder.buildSystemPrompt('define');

    const result = await this.openaiClient.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 400
    });

    const definitions = this.parseDefinitions(result.content);

    return {
      definitions,
      metadata: result.metadata
    };
  }

  /**
   * Explain text in plain language
   * @param {string} text - Text to explain
   * @param {string} level - Explanation level ('simple', 'normal', 'detailed')
   * @returns {Promise<Object>} - Explanation with metadata
   */
  async explain(text, level = 'simple') {
    const prompt = this.promptBuilder.buildExplanationPrompt(text, level);
    const systemPrompt = this.promptBuilder.buildSystemPrompt('explain');

    const result = await this.openaiClient.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.5,
      maxTokens: 400
    });

    return {
      explanation: result.content.trim(),
      metadata: result.metadata
    };
  }

  /**
   * Parse definitions from AI response
   * Attempts to extract term-definition pairs
   */
  parseDefinitions(text) {
    const definitions = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    for (const line of lines) {
      // Try to match "Term: Definition" or "**Term**: Definition" format
      const colonMatch = line.match(/^[\*\-\d]*\s*\*?\*?([^:*]+)\*?\*?\s*:\s*(.+)$/);
      if (colonMatch) {
        definitions.push({
          term: colonMatch[1].trim(),
          definition: colonMatch[2].trim()
        });
      }
      // Try to match "Term - Definition" format
      else {
        const dashMatch = line.match(/^[\*\-\d]*\s*\*?\*?([^-*]+)\*?\*?\s*-\s*(.+)$/);
        if (dashMatch) {
          definitions.push({
            term: dashMatch[1].trim(),
            definition: dashMatch[2].trim()
          });
        }
      }
    }

    // If no structured definitions found, return the whole text as one definition
    if (definitions.length === 0) {
      definitions.push({
        term: 'Explanation',
        definition: text.trim()
      });
    }

    return definitions;
  }
}

// Singleton instance
let instance = null;

export function getDefinitionService() {
  if (!instance) {
    instance = new DefinitionService();
  }
  return instance;
}

export default DefinitionService;
