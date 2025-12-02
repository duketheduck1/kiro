/**
 * @typedef {Object} APIRequest
 * @property {string} text - The text to process
 * @property {'eli5' | 'summarize' | 'define' | 'explain' | 'example'} operationType
 * @property {Object} [options]
 * @property {string} [options.format]
 * @property {string} [options.level]
 * @property {string} [options.exampleType]
 * @property {string} [context]
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success
 * @property {Object} [data]
 * @property {string} [data.content]
 * @property {Object} [data.metadata]
 * @property {Object} [error]
 * @property {string} [error.message]
 * @property {string} [error.code]
 */

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AI_ENGINE_ERROR: 'AI_ENGINE_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};
