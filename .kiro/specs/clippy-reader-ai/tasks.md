# Implementation Plan

- [x] 1. Set up project structure and dependencies



  - Create directory structure: src/frontend, src/backend, src/shared
  - Initialize Node.js project with package.json
  - Install core dependencies: Express.js, OpenAI SDK, fast-check, Jest/Vitest
  - Set up TypeScript configuration
  - Create basic build and test scripts
  - _Requirements: 8.1, 10.1_

- [x] 2. Implement backend API foundation

  - [x] 2.1 Create Express server with basic routing


    - Set up Express app with middleware (CORS, body-parser, error handling)
    - Create route handlers for /api/eli5, /api/summarize, /api/define, /api/explain, /api/example
    - Implement request validation middleware
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 2.2 Write property test for input validation
    - **Property 17: Invalid inputs are rejected**
    - **Validates: Requirements 8.2**

  
  - [ ] 2.3 Implement error handling middleware
    - Create centralized error handler
    - Format error responses consistently
    - Add logging for errors
    - _Requirements: 8.5_
  
  - [x]* 2.4 Write property test for error messages

    - **Property 18: Errors return user-friendly messages**
    - **Validates: Requirements 8.5**



- [ ] 3. Integrate OpenAI API and prompt management
  - [ ] 3.1 Create OpenAI client wrapper
    - Initialize OpenAI SDK with API key configuration


    - Implement retry logic with exponential backoff
    - Add timeout handling (10 seconds)
    - _Requirements: 8.4_
  
  - [ ] 3.2 Build prompt construction service
    - Create PromptBuilder class with methods for each operation type

    - Implement system prompt template with Clippy personality
    - Add context injection for article-aware responses
    - _Requirements: 9.1, 9.5_


  
  - [ ]* 3.3 Write property test for language complexity
    - **Property 20: Language complexity matches requested mode**
    - **Validates: Requirements 9.5**

- [ ] 4. Implement ELI5 service
  - [ ] 4.1 Create ELI5 endpoint handler
    - Build /api/eli5 endpoint with text input validation
    - Construct ELI5-specific prompt with simplification instructions

    - Call OpenAI API and return formatted response
    - _Requirements: 1.2, 1.5_
  
  - [x]* 4.2 Write property test for ELI5 readability


    - **Property 2: ELI5 output has child-appropriate readability**
    - **Validates: Requirements 1.2, 1.5**
  
  - [ ]* 4.3 Write property test for jargon avoidance
    - **Property 19: Explanations avoid jargon**
    - **Validates: Requirements 9.2**

- [ ] 5. Implement summarization service
  - [ ] 5.1 Create summarization endpoint handler
    - Build /api/summarize endpoint with format options
    - Construct summary prompt with bullet-point formatting instructions
    - Extract key points from AI response

    - _Requirements: 2.1, 2.4_
  
  - [ ]* 5.2 Write property test for summary structure
    - **Property 3: Summary output is structured and concise**
    - **Validates: Requirements 2.1**


  
  - [ ]* 5.3 Write property test for key concepts count
    - **Property 4: Summary contains bounded key concepts**
    - **Validates: Requirements 2.4**

  
  - [ ]* 5.4 Write property test for reading time
    - **Property 5: Summary reading time is under threshold**
    - **Validates: Requirements 2.5**


- [ ] 6. Implement definition and explanation services
  - [ ] 6.1 Create definition endpoint handler
    - Build /api/define endpoint with term extraction
    - Construct definition prompt for clear, concise explanations
    - Return structured definitions for multiple terms


    - _Requirements: 3.1, 3.5_
  


  - [ ] 6.2 Create explanation endpoint handler
    - Build /api/explain endpoint with complexity level parameter
    - Construct explanation prompt with plain-language instructions
    - Handle different explanation levels (simple, normal, detailed)
    - _Requirements: 3.5_
  

  - [ ]* 6.3 Write property test for definition conciseness
    - **Property 6: Definition requests return concise explanations**
    - **Validates: Requirements 3.1, 3.5**

- [ ] 7. Implement example generation service
  - [ ] 7.1 Create example endpoint handler
    - Build /api/example endpoint with example type parameter
    - Construct prompt for analogies and real-world examples
    - Return multiple examples when possible
    - _Requirements: 3.2_
  
  - [ ]* 7.2 Write property test for example generation
    - **Property 7: Example requests return illustrative content**
    - **Validates: Requirements 3.2**

- [ ] 8. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement frontend widget foundation

  - [x] 9.1 Create ClippyWidget component


    - Build floating widget UI with show/hide functionality
    - Implement positioning logic (bottom corner default)
    - Add minimize/maximize states
    - Style with Clippy-inspired design
    - _Requirements: 6.1, 6.4_


  
  - [ ] 9.2 Create HighlightDetector module
    - Implement text selection detection using Selection API
    - Calculate selection position coordinates
    - Handle selection clearing and edge cases
    - _Requirements: 1.1_
  

  - [x]* 9.3 Write property test for selection detection


    - **Property 1: Text selection triggers widget display**
    - **Validates: Requirements 1.1**

- [ ] 10. Implement widget interaction menu
  - [ ] 10.1 Create interaction options menu
    - Build menu with all options: ELI5, Summarize, Define, Give Example, Continue Reading
    - Position menu near text selection
    - Add hover and click interactions
    - _Requirements: 7.1_
  
  - [x]* 10.2 Write property test for widget positioning

    - **Property 14: Widget positioning follows selection**


    - **Validates: Requirements 6.3**
  
  - [ ]* 10.3 Write property test for menu options
    - **Property 1: Text selection triggers widget display** (includes all options)
    - **Validates: Requirements 7.1**

- [ ] 11. Implement frontend API client
  - [ ] 11.1 Create APIClient class
    - Implement methods for all backend endpoints
    - Add request/response handling with error catching
    - Implement timeout handling (5 seconds)
    - Add loading state management

    - _Requirements: 7.2, 7.5_


  
  - [ ]* 11.2 Write property test for endpoint routing
    - **Property 15: Interaction options route to correct endpoints**
    - **Validates: Requirements 7.2**
  

  - [ ]* 11.3 Write property test for loading feedback
    - **Property 16: Processing state provides visual feedback**
    - **Validates: Requirements 7.5**


- [x] 12. Implement response display


  - [ ] 12.1 Create response rendering component
    - Build UI for displaying AI responses
    - Format different response types (text, bullets, definitions)
    - Add copy-to-clipboard functionality
    - Implement smooth animations for appearance
    - _Requirements: 1.3, 2.3_
  
  - [ ] 12.2 Implement error display
    - Create user-friendly error messages UI
    - Add retry button for failed requests
    - Show network status indicators
    - _Requirements: 8.5_

- [ ] 13. Implement feed intelligence features
  - [ ] 13.1 Create article analysis endpoint
    - Build /api/article/analyze endpoint
    - Generate TL;DR summaries for articles
    - Implement topic extraction and categorization
    - Calculate importance scores
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [ ]* 13.2 Write property test for TL;DR generation
    - **Property 9: Article loading generates TL;DR**
    - **Validates: Requirements 5.1**
  
  - [ ]* 13.3 Write property test for topic assignment
    - **Property 10: Articles receive topic categorization**
    - **Validates: Requirements 5.2**
  
  - [ ]* 13.4 Write property test for importance scoring
    - **Property 12: Articles receive importance scores**
    - **Validates: Requirements 5.4**

- [ ] 14. Implement feed interface
  - [ ] 14.1 Create basic feed UI
    - Build article list component
    - Display article titles, TL;DRs, and metadata
    - Implement article opening/reading view
    - _Requirements: 2.2, 6.1_
  
  - [ ] 14.2 Implement topic-based grouping
    - Group articles by detected topics
    - Add topic filter/navigation
    - Display topic labels
    - _Requirements: 5.3_
  
  - [ ]* 14.3 Write property test for topic grouping
    - **Property 11: Articles are grouped by topic**
    - **Validates: Requirements 5.3**

- [ ] 15. Implement learning notes persistence
  - [ ] 15.1 Create notes storage service
    - Implement localStorage-based notes storage
    - Add methods for saving and retrieving notes
    - Associate notes with article URLs
    - _Requirements: 5.5_
  
  - [ ]* 15.2 Write property test for notes persistence
    - **Property 13: Learning notes round-trip persistence**
    - **Validates: Requirements 5.5**

- [ ] 16. Implement technical term detection
  - [ ] 16.1 Create vocabulary analysis module
    - Implement basic technical term detection (word frequency, complexity)
    - Highlight technical terms in selected text
    - Trigger "Define" option prominence for technical content
    - _Requirements: 3.3_
  
  - [ ]* 16.2 Write property test for term detection
    - **Property 8: Technical terms trigger definition offers**
    - **Validates: Requirements 3.3**

- [ ] 17. Implement widget integration safeguards
  - [ ] 17.1 Add page compatibility checks
    - Ensure widget doesn't interfere with page events
    - Use event delegation and namespacing
    - Test on sample pages
    - _Requirements: 10.2_
  
  - [ ]* 17.2 Write property test for non-interference
    - **Property 21: Widget does not interfere with page functionality**
    - **Validates: Requirements 10.2**

- [ ] 18. Add user preferences and configuration
  - [ ] 18.1 Create preferences storage
    - Implement localStorage for user preferences
    - Add settings for default explanation level, widget position, theme
    - Create preferences UI panel
    - _Requirements: 6.1_
  
  - [x]* 18.2 Write unit tests for preferences


    - Test preference saving and loading
    - Test default values
    - Test preference application to widget behavior

- [ ] 19. Polish UI and user experience
  - [ ] 19.1 Refine widget styling
    - Apply Clippy-inspired visual design
    - Add smooth animations and transitions
    - Ensure responsive design for different screen sizes
    - Implement dark/light theme support
    - _Requirements: 6.5_
  
  - [ ] 19.2 Add keyboard shortcuts
    - Implement Esc to close widget
    - Add keyboard navigation for menu options
    - Support accessibility features

- [ ] 20. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
