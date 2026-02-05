import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { openRouterClient, OpenRouterError } from '@/lib/openrouter';
import type { CommunityProfile } from '@/types/community';
import type { CustomerProfile } from '@/types/customer';

interface GenerateCommunitiesRequest {
  persona: string;
  customers: CustomerProfile[];
  count?: number;
}

interface GenerateCommunitiesResponse {
  communities: CommunityProfile[];
  generatedAt: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as GenerateCommunitiesRequest;
    const { persona, customers, count = 5 } = body;

    if (
      !persona ||
      typeof persona !== 'string' ||
      persona.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Persona is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    if (!customers || !Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json(
        { error: 'Customers array is required and must not be empty' },
        { status: 400 },
      );
    }

    if (typeof count !== 'number' || count < 1 || count > 10) {
      return NextResponse.json(
        { error: 'Count must be a number between 1 and 10' },
        { status: 400 },
      );
    }

    const prompt = createCommunityGenerationPrompt(persona, customers, count);

    const generatedData = await openRouterClient.generateJSON<{
      communities: CommunityProfile[];
    }>(prompt, {
      temperature: 0.8,
      maxTokens: 4000,
    });

    // Validate the response
    if (
      !generatedData.communities ||
      !Array.isArray(generatedData.communities)
    ) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure all required fields are present
    const validatedCommunities = generatedData.communities.map(
      (community, index) => {
        if (
          !community.id ||
          !community.name ||
          !community.type ||
          !community.platform ||
          !community.description ||
          typeof community.followers !== 'number' ||
          !community.followerGrowth ||
          !community.postFrequency ||
          !community.engagementRate ||
          !community.projectedROI ||
          !community.followerQuotes ||
          !Array.isArray(community.followerQuotes)
        ) {
          throw new Error(`Invalid community profile at index ${index}`);
        }

        // Validate type
        const validTypes = [
          'Content Creator',
          'Brand',
          'Community',
          'Channel',
          'Podcast',
        ];
        if (!validTypes.includes(community.type)) {
          throw new Error(
            `Invalid community type at index ${index}: ${community.type}`,
          );
        }

        // Validate platform
        const validPlatforms = [
          'Reddit',
          'Instagram',
          'TikTok',
          'YouTube',
          'Spotify',
          'LinkedIn',
        ];
        if (!validPlatforms.includes(community.platform)) {
          throw new Error(
            `Invalid platform at index ${index}: ${community.platform}`,
          );
        }

        return {
          id: community.id,
          name: community.name,
          type: community.type,
          platform: community.platform,
          description: community.description,
          followers: community.followers,
          followerGrowth: community.followerGrowth,
          postFrequency: community.postFrequency,
          engagementRate: community.engagementRate,
          projectedROI: community.projectedROI,
          customerEngagement: community.customerEngagement,
          followerQuotes: community.followerQuotes,
        };
      },
    );

    const response: GenerateCommunitiesResponse = {
      communities: validatedCommunities,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating communities:', error);

    if (error instanceof OpenRouterError) {
      return NextResponse.json(
        { error: `AI generation failed: ${error.message}` },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate community profiles' },
      { status: 500 },
    );
  }
}

function createCommunityGenerationPrompt(
  persona: string,
  customers: CustomerProfile[],
  count: number,
): string {
  const customerSummary = customers
    .map(
      (c, i) =>
        `${i + 1}. ${c.name} (${c.age}, ${c.location}) - Interests: ${[...c.relevantInterests, ...c.otherInterests].join(', ')}`,
    )
    .join('\n');

  return `You are generating community/creator recommendations for a marketing campaign.

Target Persona: ${persona}

Customer Profiles:
${customerSummary}

Generate ${count} community recommendations that would effectively reach these customers. Each should:
- Be a real-sounding content creator, brand, community, channel, or podcast name (creative but plausible)
- Have a clear connection to customer interests
- Include realistic follower/listener counts (varied: some 50K-100K, some 500K-1M, some larger)
- Include follower growth from last week (e.g., "+2.5K", "+12%", "+850")
- Include post frequency from last week (e.g., "5 posts/week", "3 videos/week", "Daily")
- Provide engagement rate as a percentage (e.g., "8%", "12%")
- Provide a believable ROI projection (e.g., "15x engagement", "12x reach", "20x conversion potential")
- Include 1-2 specific customer engagement examples referencing actual customer names from the list above (e.g., "Dave commented 'Amazing content!' two weeks ago")
- Include 2-3 realistic follower/listener testimonial quotes with fake usernames (format: {username: "username", quote: "quote text"})
- Type must be one of: "Content Creator", "Brand", "Community", "Channel", or "Podcast"
- Platform must be one of: "Reddit", "Instagram", "TikTok", "YouTube", "Spotify" (only for Podcasts), or "LinkedIn"
- Each community should have a unique ID (use simple sequential IDs: "1", "2", "3", etc.)

Important:
- Make the communities feel authentic and varied. Mix different types, platforms, and sizes.
- Choose platforms that make sense for the type (e.g., Spotify should only be used for Podcasts)
- Match platforms to the persona and customer demographics
- Use realistic usernames for quotes (e.g., "@user123", "tech_enthusiast", "sarah_m")

Respond with ONLY valid JSON in this exact format:
{
  "communities": [
    {
      "id": "1",
      "name": "Community/Creator Name",
      "type": "Content Creator",
      "platform": "YouTube",
      "description": "What they're known for and why they're relevant",
      "followers": 250000,
      "followerGrowth": "+2.5K",
      "postFrequency": "3 videos/week",
      "engagementRate": "12%",
      "projectedROI": "15x engagement",
      "customerEngagement": "Dave Johnson commented 'This is exactly what I needed!' 2 weeks ago",
      "followerQuotes": [
        {"username": "@tech_lover", "quote": "Best content in this space!"},
        {"username": "sarah_m", "quote": "Changed my perspective completely"},
        {"username": "productivity_pro", "quote": "Always worth the watch"}
      ]
    }
  ]
}`;
}
