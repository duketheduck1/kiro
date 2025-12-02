import { getOpenAIClient } from './openai-client.js';
import { getPromptBuilder } from './prompt-builder.js';

/**
 * Service for article analysis and feed intelligence
 */
class ArticleService {
  constructor() {
    this.openaiClient = getOpenAIClient();
    this.promptBuilder = getPromptBuilder();
  }

  /**
   * Analyze article for feed intelligence
   * @param {string} url - Article URL
   * @param {string} content - Article content
   * @returns {Promise<Object>} - Analysis with TL;DR, topics, and importance
   */
  async analyzeArticle(url, content) {
    const prompt = this.promptBuilder.buildArticleAnalysisPrompt(content);
    const systemPrompt = this.promptBuilder.buildSystemPrompt('summarize');

    const result = await this.openaiClient.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 300
    });

    const analysis = this.parseAnalysis(result.content);

    return {
      url,
      tldr: analysis.tldr,
      topics: analysis.topics,
      importance: analysis.importance,
      metadata: result.metadata
    };
  }

  /**
   * Parse analysis from AI response
   */
  parseAnalysis(text) {
    const analysis = {
      tldr: '',
      topics: [],
      importance: 50
    };

    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse TL;DR
      if (trimmed.toLowerCase().startsWith('tl;dr:')) {
        analysis.tldr = trimmed.substring(6).trim();
      }
      // Parse Topics
      else if (trimmed.toLowerCase().startsWith('topics:')) {
        const topicsStr = trimmed.substring(7).trim();
        analysis.topics = topicsStr
          .split(',')
          .map(t => t.trim().replace(/[\[\]]/g, ''))
          .filter(t => t.length > 0);
      }
      // Parse Importance
      else if (trimmed.toLowerCase().startsWith('importance:')) {
        const importanceStr = trimmed.substring(11).trim();
        const match = importanceStr.match(/\d+/);
        if (match) {
          analysis.importance = Math.min(100, Math.max(0, parseInt(match[0])));
        }
      }
    }

    // Fallback if parsing failed
    if (!analysis.tldr) {
      analysis.tldr = text.substring(0, 200).trim() + '...';
    }
    if (analysis.topics.length === 0) {
      analysis.topics = ['General'];
    }

    return analysis;
  }
}

// Singleton instance
let instance = null;

export function getArticleService() {
  if (!instance) {
    instance = new ArticleService();
  }
  return instance;
}

export default ArticleService;
