/**
 * Service for constructing prompts for different operation types
 */
class PromptBuilder {
  /**
   * Build ELI5 (Explain Like I'm 5) prompt
   */
  buildELI5Prompt(text, context = '') {
    const contextSection = context ? `\n\nArticle context: ${context}` : '';
    
    return `Please explain the following text in a way that a 5-year-old child could understand. Use very simple words, short sentences, and friendly language. Avoid all technical terms and jargon.${contextSection}

Text to explain:
${text}

Provide a clear, simple explanation that a young child would understand:`;
  }

  /**
   * Build summary prompt
   */
  buildSummaryPrompt(text, format = 'bullets') {
    const formatInstruction = format === 'bullets' 
      ? 'Present the summary as bullet points (use • or - for bullets).'
      : 'Present the summary as a concise paragraph.';
    
    return `Please summarize the following text. Extract the 3-5 most important key points. ${formatInstruction} Keep it brief and scannable.

Text to summarize:
${text}

Summary:`;
  }

  /**
   * Build definition prompt
   */
  buildDefinitionPrompt(text, terms = []) {
    if (terms && terms.length > 0) {
      return `Please provide clear, concise definitions for the following terms from the text:

Terms: ${terms.join(', ')}

Context:
${text}

Provide a definition for each term in simple language:`;
    }
    
    return `Please identify and define all important or technical terms in the following text. Provide clear, concise definitions in simple language.

Text:
${text}

Definitions:`;
  }

  /**
   * Build explanation prompt
   */
  buildExplanationPrompt(text, level = 'simple') {
    const levelInstructions = {
      simple: 'Use plain, everyday language that anyone can understand. Avoid technical terms.',
      normal: 'Provide a clear explanation with moderate detail. Use accessible language.',
      detailed: 'Provide a comprehensive explanation with full context and relevant details.'
    };
    
    const instruction = levelInstructions[level] || levelInstructions.simple;
    
    return `Please explain what the following text means. ${instruction}

Text to explain:
${text}

Explanation:`;
  }

  /**
   * Build example prompt
   */
  buildExamplePrompt(text, exampleType = 'real-world') {
    const typeInstructions = {
      'real-world': 'Provide 2-3 concrete, real-world examples that illustrate this concept. Use everyday situations people can relate to.',
      'analogy': 'Provide 2-3 helpful analogies or metaphors that make this concept easier to understand. Compare it to familiar things.'
    };
    
    const instruction = typeInstructions[exampleType] || typeInstructions['real-world'];
    
    return `${instruction}

Concept to illustrate:
${text}

Examples:`;
  }

  /**
   * Build article analysis prompt
   */
  buildArticleAnalysisPrompt(content) {
    return `Please analyze the following article and provide:

1. A TL;DR (Too Long; Didn't Read) summary in 1-2 sentences
2. 3-5 main topic categories that describe this article
3. An importance score from 0-100 (how significant/impactful is this content?)

Article content:
${content.substring(0, 3000)}${content.length > 3000 ? '...' : ''}

Provide your analysis in this format:
TL;DR: [summary]
Topics: [topic1, topic2, topic3]
Importance: [score]`;
  }

  /**
   * Build system prompt for specific operation
   */
  buildSystemPrompt(operationType) {
    const basePrompt = `You are Clippy, a friendly AI reading assistant. Your job is to help users understand articles quickly and simply.`;
    
    const operationSpecific = {
      eli5: `\n\nWhen providing ELI5 explanations:
- Use vocabulary a 5-year-old would know
- Keep sentences very short and simple
- Use friendly, encouraging language
- Avoid all technical terms and jargon
- Make it fun and easy to understand`,
      
      summarize: `\n\nWhen providing summaries:
- Extract only the most important points
- Be concise and scannable
- Use clear, direct language
- Focus on key takeaways`,
      
      define: `\n\nWhen providing definitions:
- Explain terms clearly and simply
- Avoid circular definitions
- Use examples when helpful
- Keep definitions concise`,
      
      explain: `\n\nWhen providing explanations:
- Break down complex ideas into simple parts
- Use plain language
- Be clear and direct
- Help the reader truly understand`,
      
      example: `\n\nWhen providing examples:
- Use relatable, everyday situations
- Make connections to familiar concepts
- Be concrete and specific
- Help make abstract ideas tangible`
    };
    
    return basePrompt + (operationSpecific[operationType] || '');
  }
}

// Singleton instance
let instance = null;

export function getPromptBuilder() {
  if (!instance) {
    instance = new PromptBuilder();
  }
  return instance;
}

export default PromptBuilder;
