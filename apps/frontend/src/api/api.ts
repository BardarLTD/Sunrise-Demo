import type { CustomerProfile } from '@/types/customer';
import type { CommunityProfile } from '@/types/community';

interface CustomerSocials {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

interface Customer {
  id: number;
  name: string;
  image: string;
  ageRange: string;
  gender: string;
  salaryRange: string;
  location: string;
  interests: string[];
  socials: CustomerSocials;
  totalConnections: number;
  oldestProfileYears: number;
}

interface CustomersResponse {
  customers: Customer[];
}

interface CommunityStats {
  followers?: number;
  subscribers?: number;
  members?: number;
  activeUsers?: number;
  avgLikes?: number;
  avgViews?: number;
  avgComments: number;
  avgUpvotes?: number;
  engagementRate: number;
  postsPerWeek?: number;
  postsPerDay?: number;
  videosPerMonth?: number;
}

interface CustomerEngagement {
  customerId: number;
  customerName: string;
  customerImage: string;
  engagementType: 'comment' | 'like';
  quote: string | null;
  likes: number | null;
  timestamp: string;
}

interface TargetCustomerEngagement {
  count: number;
  percentage: number;
  alignmentPercentage: number;
  alignmentHint: string;
}

interface AudienceSentiment {
  overall:
    | 'very_positive'
    | 'positive'
    | 'neutral'
    | 'negative'
    | 'very_negative';
  score: number;
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topThemes: string[];
  sampleVoices: string[];
}

interface Community {
  id: number;
  platform: 'instagram' | 'youtube' | 'reddit';
  name: string;
  handle: string;
  url: string;
  image: string;
  description: string;
  stats: CommunityStats;
  targetCustomerEngagement: TargetCustomerEngagement;
  engagedCustomers: CustomerEngagement[];
  audienceSentiment: AudienceSentiment;
}

interface CommunitiesResponse {
  communities: Community[];
}

class Api {
  // ============================================
  // Customers (from public folder)
  // ============================================

  async getCustomers(): Promise<CustomersResponse> {
    const response = await fetch('/customers.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }
    return response.json() as Promise<CustomersResponse>;
  }

  // ============================================
  // Communities (from public folder)
  // ============================================

  async getCommunities(): Promise<CommunitiesResponse> {
    const response = await fetch('/communities.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch communities: ${response.statusText}`);
    }
    return response.json() as Promise<CommunitiesResponse>;
  }

  // ============================================
  // AI-Generated Content
  // ============================================

  async generateCustomers(
    persona: string,
    count?: number,
  ): Promise<CustomerProfile[]> {
    const response = await fetch('/api/customers/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ persona, count }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(
        errorData.error ||
          `Failed to generate customers: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { customers: CustomerProfile[] };
    return data.customers;
  }

  async generateCommunities(
    persona: string,
    customers: CustomerProfile[],
    count?: number,
  ): Promise<CommunityProfile[]> {
    const response = await fetch('/api/communities/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ persona, customers, count }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(
        errorData.error ||
          `Failed to generate communities: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { communities: CommunityProfile[] };
    return data.communities;
  }
}

export const API = new Api();

export type {
  AudienceSentiment,
  CommunitiesResponse,
  Community,
  CommunityStats,
  Customer,
  CustomerEngagement,
  CustomerSocials,
  CustomersResponse,
  TargetCustomerEngagement,
};
