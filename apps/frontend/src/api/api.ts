const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface HelloResponse {
  message: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
}

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
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  protected async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  protected async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  protected async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  }

  // ============================================
  // Hello
  // ============================================

  getHello(): Promise<HelloResponse> {
    return this.get<HelloResponse>('/api/hello');
  }

  // ============================================
  // Health
  // ============================================

  getHealth(): Promise<HealthResponse> {
    return this.get<HealthResponse>('/health');
  }

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
}

export const API = new Api(API_BASE_URL);

export type {
  AudienceSentiment,
  CommunitiesResponse,
  Community,
  CommunityStats,
  Customer,
  CustomerEngagement,
  CustomerSocials,
  CustomersResponse,
  HealthResponse,
  HelloResponse,
  TargetCustomerEngagement,
};
