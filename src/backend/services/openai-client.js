import OpenAI from 'openai';
import { ErrorCodes } from '../../shared/types.js';

class OpenAIClient {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: parseInt(process.env.API_TIMEOUT) || 10000,
      maxRetries: 2
    });

    this.defaultModel = 'gpt-4o-mini';
    this.complexModel = 'gpt-4o';
  }

  /**
   * Generate completion with retry logic and timeout handling
   * @param {string} prompt - The prompt to send to the AI
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - The AI response
   */
  async generateCompletion(prompt, options = {}) {
    const {
      systemPrompt = this.getDefaultSystemPrompt(),
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 500
    } = options;

    const startTime = Date.now();

    try {
      const response = await this.retryWithBackoff(async () => {
        return await this.client.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: maxTokens
        });
      });

      const processingTime = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';

      return {
        content,
        metadata: {
          processingTime,
          tokensUsed: response.usage?.total_tokens || 0,
          model: response.model
        }
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      
      // Transform OpenAI errors to application errors
      if (error.status === 429) {
        const err = new Error('Rate limit exceeded');
        err.status = 429;
        throw err;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        const err = new Error('AI service unavailable');
        err.code = ErrorCodes.AI_ENGINE_ERROR;
        throw err;
      } else if (error.name === 'APIConnectionTimeoutError') {
        const err = new Error('Request timeout');
        err.name = 'TimeoutError';
        throw err;
      }
      
      throw error;
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  async retryWithBackoff(fn, maxRetries = 2) {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (error.status === 400 || error.status === 401 || error.status === 403) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (i === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retry attempt ${i + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Get default Clippy system prompt
   */
  getDefaultSystemPrompt() {
    return `You are Clippy, a friendly AI reading assistant. Your job is to help users understand articles quickly and simply.

Your responses should be:
- Friendly, helpful, and concise
- Explained in the simplest, most approachable way possible
- Free of jargon unless specifically requested
- Focused on making reading easier, faster, and more fun

Always maintain a warm, supportive tone that makes learning enjoyable.`;
  }
}

// Singleton instance
let instance = null;

export function getOpenAIClient() {
  if (!instance) {
    instance = new OpenAIClient();
  }
  return instance;
}

export default OpenAIClient;
