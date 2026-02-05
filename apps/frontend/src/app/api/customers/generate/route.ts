import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { openRouterClient, OpenRouterError } from '@/lib/openrouter';
import type { CustomerProfile } from '@/types/customer';

interface GenerateCustomersRequest {
  persona: string;
  count?: number;
}

interface GenerateCustomersResponse {
  customers: CustomerProfile[];
  generatedAt: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as GenerateCustomersRequest;
    const { persona, count = 5 } = body;

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

    if (typeof count !== 'number' || count < 1 || count > 10) {
      return NextResponse.json(
        { error: 'Count must be a number between 1 and 10' },
        { status: 400 },
      );
    }

    const prompt = createCustomerGenerationPrompt(persona, count);

    const generatedData = await openRouterClient.generateJSON<{
      customers: CustomerProfile[];
    }>(prompt, {
      temperature: 0.8,
      maxTokens: 3000,
    });

    // Validate the response
    if (!generatedData.customers || !Array.isArray(generatedData.customers)) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure all required fields are present
    const validatedCustomers = generatedData.customers.map(
      (customer, index) => {
        if (
          !customer.id ||
          !customer.name ||
          !customer.age ||
          !customer.location ||
          !customer.salaryRange ||
          !customer.workRole ||
          !customer.platforms ||
          customer.oldestProfileAge === undefined ||
          customer.totalConnections === undefined ||
          !customer.relevantInterests ||
          !customer.otherInterests ||
          !customer.buyerSignals
        ) {
          throw new Error(`Invalid customer profile at index ${index}`);
        }

        return {
          id: customer.id,
          name: customer.name,
          age: customer.age,
          location: customer.location,
          salaryRange: customer.salaryRange,
          workRole: customer.workRole,
          platforms: customer.platforms,
          oldestProfileAge: customer.oldestProfileAge,
          totalConnections: customer.totalConnections,
          relevantInterests: customer.relevantInterests,
          otherInterests: customer.otherInterests,
          buyerSignals: customer.buyerSignals,
          relevanceScore: customer.relevanceScore,
        };
      },
    );

    const response: GenerateCustomersResponse = {
      customers: validatedCustomers,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating customers:', error);

    if (error instanceof OpenRouterError) {
      return NextResponse.json(
        { error: `AI generation failed: ${error.message}` },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate customer profiles' },
      { status: 500 },
    );
  }
}

function createCustomerGenerationPrompt(
  persona: string,
  count: number,
): string {
  return `You are generating realistic customer profiles for a marketing demo.

Target Persona: ${persona}

Generate ${count} diverse customer profiles that match this persona. Each profile should:
- Have a realistic name, age range (e.g., "30-35"), and location (City, Country format)
- Include salary range (e.g., "$80K-$100K", "$120K-$150K") appropriate for the persona
- Include a work role/job title (e.g., "Product Manager", "Senior Developer") that fits the persona
- Include 2-4 platforms where we found them (choose from: "instagram", "tiktok", "youtube", "linkedin", "x"). Choose platforms that make sense for the persona.
- Include age of oldest social profile in years (e.g., 8 for an 8-year-old account)
- Include total connections across all platforms (realistic number, e.g., 2500)
- Include 2-3 interests directly relevant to the persona (in relevantInterests array)
- Include 2-3 unrelated but realistic interests for authenticity (in otherInterests array)
- Use natural language and synonyms (e.g., "wellness" could be "fitness" or "health")
- Include a plausible buyer signal - a specific recent activity indicating purchase intent (e.g., "Commented 'This looks amazing!' on a product review 3 days ago", "Searched for 'best ergonomic chairs' last week")
- Feel like a real person, not a template
- Each customer should have a unique ID (use simple sequential IDs: "1", "2", "3", etc.)

Important: Make the profiles feel authentic and varied. Clearly separate relevant interests (those directly related to the target persona) from other realistic interests (hobbies, activities that add authenticity but aren't directly related).

Respond with ONLY valid JSON in this exact format:
{
  "customers": [
    {
      "id": "1",
      "name": "Full Name",
      "age": "30-35",
      "location": "City, Country",
      "salaryRange": "$80K-$100K",
      "workRole": "Product Manager",
      "platforms": ["linkedin", "instagram", "youtube"],
      "oldestProfileAge": 8,
      "totalConnections": 2500,
      "relevantInterests": ["interest1", "interest2"],
      "otherInterests": ["interest3", "interest4"],
      "buyerSignals": "Specific recent activity description",
      "relevanceScore": 0.85
    }
  ]
}`;
}
