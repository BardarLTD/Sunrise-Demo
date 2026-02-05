export interface CustomerProfile {
  id: string;
  name: string;
  age: string; // e.g., "30-35"
  location: string; // City, Country
  salaryRange: string; // e.g., "$80K-$100K"
  workRole: string; // e.g., "Product Manager"
  platforms: string[]; // e.g., ["instagram", "linkedin", "youtube"]
  oldestProfileAge: number; // Age of oldest social media profile in years
  totalConnections: number; // Total connections across all platforms
  relevantInterests: string[]; // Interests directly related to the persona
  otherInterests: string[]; // Realistic but unrelated interests for authenticity
  buyerSignals: string; // Recent activity indicating purchase intent
  relevanceScore?: number | undefined; // Internal use
}
