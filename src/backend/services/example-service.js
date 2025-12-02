import { getOpenAIClient } from './openai-client.js';
import { getPromptBuilder } from './prompt-builder.js';

/**
 * Service for generating examples and analogies
 */
class ExampleService {
  constructor() {
    this.openaiClient = getOpenAIClient();
    this.promptBuilder = getPromptBuilder();
  }

  /**
   * Generate examples or analogies for a concept
   * @param {string} text - Concept to illustrate
   * @param {string} exampleType - Type of examples ('real-world' or 'analogy')
   * @returns {Promise<Object>} - Examples with metadata
   */
  async generateExamples(text, exampleType = 'real-world') {
    const prompt = this.promptBuilder.buildExamplePrompt(text, exampleType);
    const systemPrompt = this.promptBuilder.buildSystemPrompt('example');

    const result = await this.openaiClient.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 400
    });

    const examples = this.parseExamples(result.content);

    return {
      examples,
      metadata: result.metadata
    };
  }

  /**
   * Parse examples from AI response
   * Extracts individual examples from the response
   */
  parseExamples(text) {
    const examples = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    let currentExample = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if line starts with a bullet or number (new example)
      if (/^[\d\*\-•]+[\.\)]\s/.test(trimmed)) {
        if (currentExample) {
          examples.push(currentExample.trim());
        }
        // Remove the bullet/number marker
        currentExample = trimmed.replace(/^[\d\*\-•]+[\.\)]\s*/, '');
      } else if (currentExample) {
        // Continue current example
        currentExample += ' ' + trimmed;
      } else {
        // Start new example without marker
        currentExample = trimmed;
      }
    }
    
    // Add the last example
    if (currentExample) {
      examples.push(currentExample.trim());
    }

    // If no structured examples found, return the whole text as one example
    if (examples.length === 0) {
      examples.push(text.trim());
    }

    return examples;
  }
}

// Singleton instance
let instance = null;

export function getExampleService() {
  if (!instance) {
    instance = new ExampleService();
  }
  return instance;
}

export default ExampleService;
