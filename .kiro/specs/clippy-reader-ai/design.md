# Design Document

## Overview

Clippy Reader AI is a client-server application that provides intelligent reading assistance through a floating widget interface. The system consists of three main layers: a JavaScript-based frontend widget that handles user interactions and text selection, a Node.js/Express backend API that processes requests and manages AI interactions, and an AI engine layer that leverages OpenAI's GPT models to generate explanations, summaries, and definitions.

The architecture follows a clean separation of concerns with the frontend handling all UI interactions and highlight detection, the backend managing business logic and API orchestration, and the AI engine providing natural language processing capabilities. The system is designed to be modular, allowing the Clippy widget to be deployed either within a custom feed reader interface or as a browser extension that works across any website.

## Architecture

### System Components

The system is organized into three primary tiers:

**Frontend Layer (Client)**
- Clippy Widget: A floating UI component built with vanilla JavaScript or React
- Highlight Detection Module: Captures user text selections using browser Selection API
- Interaction Menu: Displays contextual options (ELI5, Summarize, Define, etc.)
- Feed Interface: Google Reader-style article aggregation and reading interface
- State Management: Tracks user preferences, reading history, and interaction state

**Backend Layer (Server)**
- Express.js REST API with dedicated endpoints for each operation type
- Request validation and sanitization middleware
- AI Engine integration layer with OpenAI API client
- Response formatting and error handling
- Optional: User session management and personalization storage
- Optional: Article caching and feed aggregation service

**AI Engine Layer**
- OpenAI GPT-4o-mini for fast, cost-effective responses
- OpenAI GPT-4o for complex explanations requiring deeper reasoning
- System prompt management for consistent Clippy personality
- Token optimization and response streaming support

### Communication Flow

1. User highlights text in article → Frontend captures selection
2. User selects action (ELI5, Summarize, etc.) → Frontend sends POST request to Backend
3. Backend validates request → Routes to appropriate endpoint
4. Backend constructs prompt with system instructions → Calls OpenAI API
5. AI Engine generates response → Returns to Backend
6. Backend formats response → Sends to Frontend
7. Frontend displays response in Clippy widget → User continues reading

### Technology Stack

- **Frontend**: JavaScript (ES6+), HTML5, CSS3, optional React for complex state
- **Backend**: Node.js with Express.js framework
- **AI**: OpenAI API (GPT-4o-mini primary, GPT-4o for complex requests)
- **Optional Extensions**: Chrome Extension API for cross-site functionality
- **Storage**: LocalStorage for client-side preferences, optional PostgreSQL/MongoDB for user data

## Components and Interfaces

### Frontend Components

**ClippyWidget**
```javascript
class ClippyWidget {
  constructor(config)
  show(position)
  hide()
  displayOptions(selectedText)
  displayResponse(response, type)
  setPosition(x, y)
}
```

**HighlightDetector**
```javascript
class HighlightDetector {
  initialize()
  onTextSelected(callback)
  getSelectedText()
  getSelectionPosition()
  clearSelection()
}
```

**APIClient**
```javascript
class APIClient {
  async eli5(text)
  async summarize(text)
  async define(text)
  async explain(text)
  async giveExample(text)
  async getArticleSummary(articleUrl)
}
```

### Backend API Endpoints

**POST /api/eli5**
- Request: `{ text: string, context?: string }`
- Response: `{ explanation: string, success: boolean }`
- Generates child-friendly explanation of selected text

**POST /api/summarize**
- Request: `{ text: string, format: 'bullets' | 'paragraph' }`
- Response: `{ summary: string, keyPoints: string[], success: boolean }`
- Creates concise summary with key points

**POST /api/define**
- Request: `{ text: string, terms?: string[] }`
- Response: `{ definitions: Array<{term: string, definition: string}>, success: boolean }`
- Provides definitions for terms in text

**POST /api/explain**
- Request: `{ text: string, level: 'simple' | 'normal' | 'detailed' }`
- Response: `{ explanation: string, success: boolean }`
- Generates plain-language explanation

**POST /api/example**
- Request: `{ text: string, exampleType: 'analogy' | 'real-world' }`
- Response: `{ examples: string[], success: boolean }`
- Provides real-world examples or analogies

**POST /api/article/analyze**
- Request: `{ url: string, content: string }`
- Response: `{ tldr: string, topics: string[], importance: number, success: boolean }`
- Analyzes article for feed intelligence

### AI Engine Integration

**System Prompt Template**
```
You are Clippy, a friendly AI reading assistant. Your job is to help users understand articles quickly and simply. 

When providing {operation_type}:
- Stay friendly, helpful, and concise
- Explain in the simplest, most approachable way possible
- Avoid jargon unless asked
- Make reading easier, faster, and more fun

User request: {user_text}
Context: {article_context}
```

**Prompt Construction Service**
```javascript
class PromptBuilder {
  buildELI5Prompt(text, context)
  buildSummaryPrompt(text, format)
  buildDefinitionPrompt(text, terms)
  buildExplanationPrompt(text, level)
  buildExamplePrompt(text, type)
}
```

## Data Models

### User Selection
```typescript
interface UserSelection {
  text: string;
  position: { x: number; y: number };
  articleContext?: string;
  timestamp: Date;
}
```

### API Request
```typescript
interface APIRequest {
  text: string;
  operationType: 'eli5' | 'summarize' | 'define' | 'explain' | 'example';
  options?: {
    format?: string;
    level?: string;
    exampleType?: string;
  };
  context?: string;
}
```

### API Response
```typescript
interface APIResponse {
  success: boolean;
  data: {
    content: string;
    metadata?: {
      tokensUsed?: number;
      processingTime?: number;
    };
  };
  error?: {
    message: string;
    code: string;
  };
}
```

### Article Metadata
```typescript
interface ArticleMetadata {
  url: string;
  title: string;
  tldr: string;
  topics: string[];
  importanceScore: number;
  readingTime: number;
  analyzedAt: Date;
}
```

### User Preferences
```typescript
interface UserPreferences {
  defaultExplanationLevel: 'eli5' | 'simple' | 'normal';
  autoShowSuggestions: boolean;
  voiceReadingEnabled: boolean;
  widgetPosition: 'bottom-left' | 'bottom-right';
  theme: 'light' | 'dark';
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Text selection triggers widget display
*For any* text selection within an article, the Clippy widget should appear with all interaction options (ELI5, Summarize, Define, Give Example, Continue Reading) visible and functional.
**Validates: Requirements 1.1, 7.1**

### Property 2: ELI5 output has child-appropriate readability
*For any* input text, when processed through ELI5 mode, the output should have a Flesch-Kincaid grade level of 5 or below, indicating comprehension suitable for a typical five-year-old child.
**Validates: Requirements 1.2, 1.5**

### Property 3: Summary output is structured and concise
*For any* text summarization request, the output should be formatted as a bulleted or numbered list and contain fewer words than the input text.
**Validates: Requirements 2.1, 2.3**

### Property 4: Summary contains bounded key concepts
*For any* article summarization request, the output should identify between 3 and 5 distinct key concepts or main points.
**Validates: Requirements 2.4**

### Property 5: Summary reading time is under threshold
*For any* generated summary, the word count should be less than 100 words, ensuring reading time under 30 seconds at average reading speed.
**Validates: Requirements 2.5**

### Property 6: Definition requests return concise explanations
*For any* term or text segment, when a definition is requested, the system should return an explanation that is non-empty and shorter than 100 words.
**Validates: Requirements 3.1, 3.5**

### Property 7: Example requests return illustrative content
*For any* concept, when examples are requested, the system should return at least one example or analogy in the response.
**Validates: Requirements 3.2**

### Property 8: Technical terms trigger definition offers
*For any* text selection containing technical terminology (identified by vocabulary analysis), the Clippy interface should display the "Define" option prominently.
**Validates: Requirements 3.3**

### Property 9: Article loading generates TL;DR
*For any* article loaded into the feed interface, the system should automatically generate and store a TL;DR summary associated with that article.
**Validates: Requirements 5.1**

### Property 10: Articles receive topic categorization
*For any* article processed by feed intelligence, the system should assign at least one topic category to that article.
**Validates: Requirements 5.2**

### Property 11: Articles are grouped by topic
*For any* set of articles with assigned topics, articles sharing the same topic should be displayed in the same group in the feed interface.
**Validates: Requirements 5.3**

### Property 12: Articles receive importance scores
*For any* article analyzed by feed intelligence, the system should assign an importance score within a valid range (e.g., 0-100).
**Validates: Requirements 5.4**

### Property 13: Learning notes round-trip persistence
*For any* article with associated learning notes, storing the notes and then retrieving them should return the same content.
**Validates: Requirements 5.5**

### Property 14: Widget positioning follows selection
*For any* text selection, the Clippy widget should appear within a reasonable distance (e.g., 50 pixels) of the selection coordinates.
**Validates: Requirements 6.3**

### Property 15: Interaction options route to correct endpoints
*For any* user selection of an interaction option (ELI5, Summarize, Define, Explain, Example), the request should be routed to the corresponding backend endpoint (/api/eli5, /api/summarize, etc.).
**Validates: Requirements 7.2**

### Property 16: Processing state provides visual feedback
*For any* user request to the AI engine, the Clippy interface should display a loading or processing indicator until the response is received.
**Validates: Requirements 7.5**

### Property 17: Invalid inputs are rejected
*For any* API request with invalid parameters (empty text, malformed data, missing required fields), the backend should return a validation error and not process the request.
**Validates: Requirements 8.2**

### Property 18: Errors return user-friendly messages
*For any* error condition (validation failure, AI engine unavailable, timeout), the system should return a user-friendly error message that does not expose technical implementation details.
**Validates: Requirements 8.5**

### Property 19: Explanations avoid jargon
*For any* explanation generated in ELI5 or simple mode, the output should not contain technical jargon (measured by vocabulary complexity analysis).
**Validates: Requirements 9.2**

### Property 20: Language complexity matches requested mode
*For any* pair of responses to the same input text in different modes (ELI5 vs. normal), the ELI5 response should have a lower readability grade level than the normal response.
**Validates: Requirements 9.5**

### Property 21: Widget does not interfere with page functionality
*For any* webpage with the Clippy widget integrated, existing page event handlers (clicks, scrolls, form submissions) should continue to function as they did before integration.
**Validates: Requirements 10.2**

## Error Handling

### Frontend Error Handling

**Network Failures**
- Display user-friendly message: "Clippy is having trouble connecting. Please check your internet connection."
- Provide retry button for failed requests
- Cache last successful response for offline reference

**Invalid Selections**
- Detect empty or whitespace-only selections before sending to backend
- Show tooltip: "Please select some text to get help"
- Minimum selection length: 3 characters

**API Timeout**
- Set 5-second timeout for API requests
- Show message: "This is taking longer than expected. Clippy is still thinking..."
- Allow user to cancel request

**Rendering Errors**
- Catch and log JavaScript errors in widget rendering
- Fallback to simple text display if rich formatting fails
- Ensure widget can be dismissed even if error occurs

### Backend Error Handling

**Input Validation Errors**
- Return 400 Bad Request with specific validation message
- Log validation failures for monitoring
- Example: "Text input is required and must be between 3 and 5000 characters"

**AI Engine Errors**
- Catch OpenAI API errors (rate limits, service unavailable, invalid API key)
- Return 503 Service Unavailable with user-friendly message
- Implement exponential backoff for retries
- Log detailed error information for debugging

**Rate Limiting**
- Implement per-user rate limiting (e.g., 100 requests per hour)
- Return 429 Too Many Requests with retry-after header
- Display message: "You've used Clippy a lot! Please wait a moment before trying again."

**Timeout Handling**
- Set 10-second timeout for OpenAI API calls
- Return partial response if available
- Log timeout incidents for performance monitoring

**Database Errors** (if persistence is implemented)
- Catch connection failures and query errors
- Return 500 Internal Server Error for unexpected failures
- Ensure user data is not lost (queue for retry)
- Gracefully degrade to non-persistent mode if database unavailable

### Error Response Format

All error responses follow consistent structure:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": "Optional technical details for debugging"
  }
}
```

## Testing Strategy

### Dual Testing Approach

This project requires both unit testing and property-based testing to ensure comprehensive correctness:

- **Unit tests** verify specific examples, edge cases, and integration points
- **Property-based tests** verify universal properties that should hold across all inputs
- Together they provide complete coverage: unit tests catch concrete bugs, property tests verify general correctness

### Unit Testing

**Frontend Unit Tests**
- Test widget initialization and DOM manipulation
- Test highlight detection with specific text selections
- Test menu rendering with known options
- Test API client with mocked responses
- Test error display with specific error messages
- Test positioning calculations with known coordinates

**Backend Unit Tests**
- Test endpoint routing with specific requests
- Test input validation with known valid/invalid inputs
- Test error handling with simulated failures
- Test response formatting with sample AI outputs
- Test prompt construction with specific templates

**Integration Tests**
- Test end-to-end flow: selection → API call → response display
- Test article analysis pipeline
- Test feed intelligence with sample articles

### Property-Based Testing

**Property-Based Testing Library**: We will use **fast-check** for JavaScript/TypeScript property-based testing.

**Configuration**: Each property-based test should run a minimum of **100 iterations** to ensure adequate coverage of the input space.

**Test Tagging**: Each property-based test must include a comment explicitly referencing the correctness property from this design document using this format:
```javascript
// Feature: clippy-reader-ai, Property 1: Text selection triggers widget display
```

**Property Test Implementation Requirements**:
- Each correctness property listed in this document must be implemented by a SINGLE property-based test
- Tests should generate random inputs appropriate to the property being tested
- Tests should verify the property holds for all generated inputs
- Tests should use smart generators that constrain inputs to valid ranges

**Example Property Tests**:

```javascript
// Feature: clippy-reader-ai, Property 2: ELI5 output has child-appropriate readability
fc.assert(
  fc.property(fc.string({ minLength: 50, maxLength: 500 }), async (inputText) => {
    const result = await eli5Service.simplify(inputText);
    const gradeLevel = calculateFleschKincaidGrade(result.explanation);
    return gradeLevel <= 5;
  }),
  { numRuns: 100 }
);

// Feature: clippy-reader-ai, Property 4: Summary contains bounded key concepts
fc.assert(
  fc.property(fc.string({ minLength: 200, maxLength: 2000 }), async (article) => {
    const result = await summaryService.summarize(article);
    const conceptCount = result.keyPoints.length;
    return conceptCount >= 3 && conceptCount <= 5;
  }),
  { numRuns: 100 }
);

// Feature: clippy-reader-ai, Property 17: Invalid inputs are rejected
fc.assert(
  fc.property(
    fc.oneof(
      fc.constant(""),
      fc.constant("   "),
      fc.constant(null),
      fc.constant(undefined)
    ),
    async (invalidInput) => {
      const result = await apiClient.eli5(invalidInput);
      return result.success === false && result.error !== undefined;
    }
  ),
  { numRuns: 100 }
);
```

### Test Organization

- Frontend tests: `src/components/__tests__/`
- Backend tests: `src/api/__tests__/`
- Property tests: `src/__tests__/properties/`
- Integration tests: `src/__tests__/integration/`

### Testing Tools

- **Unit Testing**: Jest or Vitest
- **Property-Based Testing**: fast-check
- **E2E Testing**: Playwright or Cypress (optional)
- **API Testing**: Supertest
- **Coverage**: Istanbul/nyc (target: 80% coverage)

### Continuous Testing

- Run unit tests on every commit
- Run property tests on pull requests
- Run integration tests before deployment
- Monitor test execution time and flakiness
- Generate coverage reports for review
