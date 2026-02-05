# Feature 2: Responsive Product - Implementation Plan

## Overview

Implement AI-powered dynamic content generation that customizes customer profiles and community recommendations based on user-provided persona descriptions, making the demo feel realistic and relevant to each user.

## Goals

1. Initialize Next.js API routes (no separate Express/Nest backend)
2. Integrate OpenRouter for AI model access
3. Dynamically generate customer profiles based on user persona input
4. Dynamically generate community recommendations aligned with generated customers
5. Use React Query for data fetching with loading states
6. Ensure entire project can be hosted on Vercel

## Technical Architecture

### Backend (Next.js API Routes)

- **Route Handlers**: Use Next.js 15 App Router API routes
- **AI Provider**: OpenRouter API for LLM access
- **Hosting**: Vercel-compatible (no separate backend server)
- **Pattern**: RESTful endpoints returning JSON

### Frontend (React Query)

- **Library**: TanStack React Query (already in use per project structure)
- **Loading States**: Skeleton components during data fetching
- **Lazy Loading**: Only fetch page 3 data when user navigates to page 3
- **Caching**: Leverage React Query cache for performance

## API Endpoints

### 1. Generate Customer Profiles

- **Route**: `POST /api/customers/generate`
- **Request Body**:
  ```typescript
  {
    persona: string; // User's target persona description
    count?: number; // Number of profiles to generate (default: 5)
  }
  ```
- **Response**:
  ```typescript
  {
    customers: CustomerProfile[];
    generatedAt: string;
  }
  ```

### 2. Generate Community Recommendations

- **Route**: `POST /api/communities/generate`
- **Request Body**:
  ```typescript
  {
    persona: string; // User's original persona
    customers: CustomerProfile[]; // Generated customer profiles from page 2
  }
  ```
- **Response**:
  ```typescript
  {
    communities: CommunityProfile[];
    generatedAt: string;
  }
  ```

## Data Types

### Customer Profile

```typescript
interface CustomerProfile {
  id: string;
  name: string;
  age: string; // e.g., "30-35"
  location: string; // City, Country
  interests: string[]; // Mix of relevant and realistic filler interests
  buyerSignals: string; // Recent activity indicating purchase intent
  relevanceScore?: number; // Internal use
}
```

### Community Profile

```typescript
interface CommunityProfile {
  id: string;
  name: string; // Person, brand, or community name
  type: 'Content Creator' | 'Brand' | 'Community' | 'Channel';
  description: string; // What they're known for, relevance to products
  followers: number;
  engagementRate: string; // e.g., "10%"
  projectedROI: string; // e.g., "16x engagement"
  customerEngagement?: string; // Specific example of customer interaction
  followerQuotes: string[]; // Sample testimonials
}
```

## Implementation Steps

### Phase 1: Backend Setup

#### 1. Install Dependencies

```bash
cd apps/frontend
pnpm add openai @openrouter/ai-sdk-provider
```

#### 2. Environment Configuration

- Create/update `.env.local`:
  ```env
  OPENROUTER_API_KEY=your_key_here
  OPENROUTER_APP_NAME=sunrise-demo
  OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
  ```

#### 3. Create OpenRouter Client Utility

- **File**: `apps/frontend/src/lib/openrouter.ts`
- Singleton pattern for API client
- Type-safe wrapper for chat completions
- Error handling and retry logic

#### 4. Create API Route for Customer Generation

- **File**: `apps/frontend/src/app/api/customers/generate/route.ts`
- Implement POST handler
- Use OpenRouter to generate realistic customer profiles
- Prompt engineering:
  - Include explicit instructions to mix relevant and irrelevant interests
  - Use synonyms for keywords to enhance realism
  - Generate plausible buyer signals
  - Ensure diversity in profiles

#### 5. Create API Route for Community Generation

- **File**: `apps/frontend/src/app/api/communities/generate/route.ts`
- Implement POST handler
- Use OpenRouter to generate community recommendations
- Prompt engineering:
  - Align with customer profiles from page 2
  - Generate realistic follower counts and engagement rates
  - Create believable descriptions and ROI projections
  - Include specific customer engagement examples

### Phase 2: Frontend Integration

#### 1. Update API Client

- **File**: `apps/frontend/src/api/api.ts`
- Add methods:
  ```typescript
  generateCustomers(persona: string): Promise<CustomerProfile[]>
  generateCommunities(persona: string, customers: CustomerProfile[]): Promise<CommunityProfile[]>
  ```

#### 2. Create React Query Hooks

- **File**: `apps/frontend/src/api/queries/customers.ts`

  ```typescript
  export const useGenerateCustomers = () => {
    return useMutation({
      mutationFn: (persona: string) => API.generateCustomers(persona),
    });
  };
  ```

- **File**: `apps/frontend/src/api/queries/communities.ts`
  ```typescript
  export const useGenerateCommunities = () => {
    return useMutation({
      mutationFn: (params: { persona: string; customers: CustomerProfile[] }) =>
        API.generateCommunities(params.persona, params.customers),
    });
  };
  ```

#### 3. Update Page 1 (Prompt Input)

- **File**: `apps/frontend/src/app/page.tsx`
- Capture user persona input from existing prompt box
- Store persona in state/context for use in subsequent pages
- Trigger customer generation when user proceeds to page 2

#### 4. Update Page 2 (Customer Profiles)

- **File**: `apps/frontend/src/components/fullscreen-cards/CustomerCarousel.tsx`
- Replace static JSON data with React Query hook
- Add loading skeletons during data fetch
- Display dynamically generated customer profiles
- Handle error states gracefully

#### 5. Update Page 3 (Community Recommendations)

- **File**: `apps/frontend/src/components/fullscreen-cards/CommunityCardStack.tsx`
- Implement lazy loading (only fetch when page 3 is reached)
- Replace static JSON data with React Query hook
- Pass customer profiles from page 2 to API
- Add loading skeletons
- Display dynamically generated communities

#### 6. Create Loading Skeletons

- **File**: `apps/frontend/src/components/LoadingSkeleton.tsx`
- Skeleton for customer cards
- Skeleton for community cards
- Match existing card dimensions and layout

### Phase 3: Prompt Engineering

#### Customer Generation Prompt Structure

```
You are generating realistic customer profiles for a marketing demo.

Target Persona: {user_persona}

Generate {count} diverse customer profiles that match this persona. Each profile should:
- Have a realistic name, age range, and location
- Include 4-6 interests: 2-3 directly relevant to the persona, 2-3 unrelated (for realism)
- Use synonyms and natural language (e.g., "wellness" → "fitness", "health")
- Include a plausible buyer signal (recent comment, search, or activity)
- Feel like a real person, not a template

Format as JSON array with structure: {CustomerProfile type definition}
```

#### Community Generation Prompt Structure

```
You are generating community/creator recommendations for a marketing campaign.

Target Persona: {user_persona}
Customer Profiles: {customer_profiles}

Generate {count} community recommendations that would effectively reach these customers. Each should:
- Be a real-sounding content creator, brand, community, or channel
- Have a clear connection to customer interests
- Include realistic follower counts and engagement metrics
- Provide a believable ROI projection
- Include 1-2 customer engagement examples (e.g., "Dave commented 'Sick' two weeks ago")
- Include 2-3 follower testimonial quotes

Format as JSON array with structure: {CommunityProfile type definition}
```

### Phase 4: State Management

#### Option A: React Context (Recommended for simplicity)

- Create `PersonaContext` to share user input across pages
- Store generated customers for use in community generation

#### Option B: URL Query Params

- Store persona in URL for shareability
- Use query params to trigger generation on page load

### Phase 5: Testing and Optimization

1. **Type Safety**
   - Validate all API responses match TypeScript interfaces
   - Ensure strict mode compliance
   - No `any` types

2. **Error Handling**
   - OpenRouter API failures
   - Invalid JSON responses from AI
   - Network errors
   - Rate limiting

3. **Loading States**
   - Skeleton components during generation
   - Progress indicators for long operations
   - Disable navigation during generation

4. **Caching Strategy**
   - Cache customer profiles for session
   - Regenerate only if persona changes
   - Clear cache on demo restart

5. **Performance**
   - Optimize prompt token usage
   - Stream responses if possible
   - Parallel generation where applicable

## Files to Create/Modify

### New Files

- `apps/frontend/src/lib/openrouter.ts` - OpenRouter client
- `apps/frontend/src/app/api/customers/generate/route.ts` - Customer generation endpoint
- `apps/frontend/src/app/api/communities/generate/route.ts` - Community generation endpoint
- `apps/frontend/src/api/queries/customers.ts` - Customer query hooks
- `apps/frontend/src/api/queries/communities.ts` - Community query hooks
- `apps/frontend/src/components/LoadingSkeleton.tsx` - Loading state components
- `apps/frontend/src/contexts/PersonaContext.tsx` - Shared state (if using context)
- `apps/frontend/src/types/customer.ts` - Customer type definitions
- `apps/frontend/src/types/community.ts` - Community type definitions

### Modified Files

- `apps/frontend/src/api/api.ts` - Add generation methods
- `apps/frontend/src/app/page.tsx` - Capture persona input
- `apps/frontend/src/components/fullscreen-cards/CustomerCarousel.tsx` - Dynamic data
- `apps/frontend/src/components/fullscreen-cards/CommunityCardStack.tsx` - Dynamic data
- `apps/frontend/package.json` - Add OpenRouter dependencies
- `apps/frontend/.env.local` - Add OpenRouter API key

### Files to Remove (or make fallback)

- `apps/frontend/public/customers.json` - Replace with API
- `apps/frontend/public/communities.json` - Replace with API

## Environment Variables

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_APP_NAME=sunrise-demo
OPENROUTER_MODEL=anthropic/claude-3-5-sonnet # or other preferred model

# Optional: Fallback to static data if API fails
NEXT_PUBLIC_ENABLE_FALLBACK=true
```

## Vercel Deployment Considerations

- API routes are serverless functions (automatic on Vercel)
- Set environment variables in Vercel dashboard
- Monitor function execution time (10s timeout on Hobby plan)
- Consider edge runtime for faster cold starts
- Set appropriate CORS headers if needed

## Example Flow

1. **User lands on Page 1**
   - Enters: "25-35 y/o Australian professionals interested in health, wellness, premium gadgets and productivity"

2. **User proceeds to Page 2**
   - Trigger: `useGenerateCustomers` mutation with persona
   - Show loading skeletons
   - API generates 5 customer profiles via OpenRouter
   - Display profiles in carousel:
     - "Dave Johnson, 30-35, Sydney, Australia"
     - "Sarah Chen, 28-32, Melbourne, Australia"
     - etc.

3. **User proceeds to Page 3**
   - Trigger: `useGenerateCommunities` mutation with persona + customers
   - Show loading skeletons
   - API generates community recommendations
   - Display communities in card stack:
     - "Zander Whitehurst - Design & Productivity Influencer"
     - "Tech & Wellness Podcast - Health-conscious professionals"
     - etc.

## Success Criteria

- ✅ Next.js API routes functional (no separate backend)
- ✅ OpenRouter integration working
- ✅ Customer profiles generated dynamically and realistically
- ✅ Community recommendations aligned with customers
- ✅ React Query with proper loading states
- ✅ Page 3 data only fetched when navigated to
- ✅ No TypeScript errors (strict mode)
- ✅ Deployable to Vercel as single entity
- ✅ Realistic demo experience (not obviously template-generated)

## Future Enhancements

- Streaming responses for faster perceived performance
- A/B test different prompt strategies
- Cache generated content with persona hash
- Allow users to regenerate individual profiles
- Add "diversity" slider for customer profile variety
