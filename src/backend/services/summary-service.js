import { getOpenAIClient } from './openai-client.js';
import { getPromptBuilder } from './prompt-builder.js';

/**
 * Service for text summarization operations
 */
class SummaryService {
  constructor() {
    this.openaiClient = getOpenAIClient();
    this.promptBuilder = getPromptBuilder();
  }

  /**
   * Summarize text and extract key points
   * @param {string} text - Text to summarize
   * @param {string} format - Output format ('bullets' or 'paragraph')
   * @returns {Promise<Object>} - Summary with key points and metadata
   */
  async summarize(text, format = 'bullets') {
    const prompt = this.promptBuilder.buildSummaryPrompt(text, format);
    const systemPrompt = this.promptBuilder.buildSystemPrompt('summarize');

    const result = await this.openaiClient.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.5,
      maxTokens: 400
    });

    const summary = result.content.trim();
    const keyPoints = this.extractKeyPoints(summary);

    return {
      summary,
      keyPoints,
      metadata: result.metadata
    };
  }

  /**
   * Extract key points from summary text
   * Looks for bullet points or numbered lists
   */
  extractKeyPoints(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const keyPoints = [];

    for (const line of lines) {
      // Match bullet points (•, -, *, or numbers)
      const bulletMatch = line.match(/^[•\-\*\d]+[\.\)]\s*(.+)$/);
      if (bulletMatch) {
        keyPoints.push(bulletMatch[1].trim());
      } else if (line.length > 10 && keyPoints.length < 5) {
        // If no bullet markers found, treat substantial lines as key points
        keyPoints.push(line);
      }
    }

    // If we couldn't extract structured points, return the whole summary as one point
    if (keyPoints.length === 0) {
      keyPoints.push(text);
    }

    return keyPoints;
  }
}

// Singleton instance
let instance = null;

export function getSummaryService() {
  if (!instance) {
    instance = new SummaryService();
  }
  return instance;
}

export default SummaryService;
