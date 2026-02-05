# Feature 1: Capture User Feedback - Implementation Plan

## Overview

Implement a feedback capture system that collects user responses through interactive buttons and tracks all interactions via Mixpanel analytics with session recording.

## Goals

1. Create a reusable button component that prompts users for feedback before executing actions
2. Integrate Mixpanel for analytics and session recording
3. Implement initial user information collection (name, email, company)
4. Link all interactions to user email for cohesive analytics

## Technical Requirements

### 1. Mixpanel Integration

- **File**: `apps/frontend/src/lib/mixpanel.ts`
- Install dependencies: `mixpanel-browser`
- Implement singleton pattern for Mixpanel initialization
- Configure:
  - Token: "MIX_PANEL_TOKEN" (environment variable recommended)
  - Persistence: localStorage
  - Autocapture: click, scroll, input (no pageview)
  - Session recording: 100%
  - API host: https://mix.google-cloud.eventlytics.ai
  - Debug mode: conditional based on environment

### 2. Feedback Button Component

- **File**: `apps/frontend/src/components/FeedbackButton.tsx`
- **Props**:
  ```typescript
  interface FeedbackButtonProps {
    question: string;
    buttonText: string;
    onClick: () => void;
    answerType?: 'text' | 'rating' | 'multiple-choice';
    options?: string[]; // For multiple-choice questions
    className?: string;
    disabled?: boolean;
  }
  ```
- **Behavior**:
  1. On click, show modal/dialog with the question
  2. Collect user response
  3. Log response to Mixpanel with metadata (timestamp, question, answer, button context)
  4. Execute the original `onClick` action after feedback is captured
  5. Support different answer types (text input, rating scale, multiple choice)

### 3. User Information Collection Modal

- **File**: `apps/frontend/src/components/UserInfoModal.tsx`
- **Trigger**: Display on first page load (use localStorage to check if already shown)
- **Fields**:
  - Name (required)
  - Email (required, validation)
  - Company name (required)
  - Checkbox: "I have disabled my adblocker for this demo" (required)
- **Actions**:
  1. Validate all fields
  2. Store user info in Mixpanel user profile using `mixpanel.people.set()`
  3. Set distinct_id to email address
  4. Mark modal as shown in localStorage
  5. Allow access to app only after submission

### 4. Mixpanel Event Structure

- **User Properties**:
  ```typescript
  {
    $email: string;
    $name: string;
    company: string;
    adblocker_disabled: boolean;
    first_seen: timestamp;
  }
  ```
- **Feedback Events**:
  ```typescript
  mixpanel.track('Feedback Submitted', {
    question: string;
    answer: string;
    button_context: string;
    page: string;
    timestamp: ISO string;
  });
  ```

## Implementation Steps

### Phase 1: Setup and Infrastructure

1. Install Mixpanel dependency

   ```bash
   cd apps/frontend
   pnpm add mixpanel-browser
   ```

2. Create Mixpanel utility module with initialization code
3. Add environment variable for Mixpanel token
4. Initialize Mixpanel in root layout or app entry point

### Phase 2: User Information Collection

1. Create UserInfoModal component with form validation
2. Style modal to match application design
3. Integrate with Mixpanel user profile creation
4. Add modal to root layout with conditional rendering
5. Implement localStorage check to show once per user

### Phase 3: Feedback Button Component

1. Create FeedbackButton component with TypeScript interfaces
2. Implement modal/dialog for question display
3. Add support for multiple answer types (text, rating, multiple-choice)
4. Integrate Mixpanel event tracking
5. Add loading states and error handling
6. No need to create Storybook stories or examples for documentation

### Phase 4: Testing and Integration

1. Test Mixpanel initialization and connection
2. Verify user profile creation
3. Test feedback event logging
4. Verify session recording is active
5. Test with adblocker enabled/disabled
6. Validate TypeScript strict mode compliance
7. Run linting and type checking

## Files to Create/Modify

### New Files

- `apps/frontend/src/lib/mixpanel.ts` - Mixpanel initialization
- `apps/frontend/src/components/FeedbackButton.tsx` - Feedback button component
- `apps/frontend/src/components/UserInfoModal.tsx` - User info collection modal
- `apps/frontend/src/types/mixpanel.ts` - TypeScript types for Mixpanel events

### Modified Files

- `apps/frontend/src/app/layout.tsx` - Add UserInfoModal
- `apps/frontend/package.json` - Add mixpanel-browser dependency
- `apps/frontend/.env.local` - Add Mixpanel token

## Environment Variables

```env
NEXT_PUBLIC_MIXPANEL_TOKEN=your_token_here
```

## TypeScript Considerations

- Define strict types for all Mixpanel events and properties
- Use branded types for email validation
- Proper typing for Mixpanel instance (as shown in provided code)
- No `any` types allowed per project conventions

## Design Considerations

- Modal should be non-dismissible until form is completed
- Clear visual feedback for required fields
- Accessible form inputs with proper labels
- Mobile-responsive design
- Match existing application styling (Tailwind CSS)

## Next Steps After Implementation

- Work with stakeholder to identify button placement locations
- Define specific questions for each feedback point
- Create A/B test variants for question phrasing
- Set up Mixpanel dashboard for monitoring responses

## Success Criteria

- ✅ Mixpanel successfully initialized and recording sessions
- ✅ User information collected on first visit and stored in Mixpanel
- ✅ FeedbackButton component reusable across application
- ✅ All feedback responses logged to Mixpanel with user email linkage
- ✅ No TypeScript errors (strict mode)
- ✅ Passes all linting checks
- ✅ Adblocker warning displayed and acknowledged
