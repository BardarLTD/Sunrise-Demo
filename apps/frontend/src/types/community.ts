export interface CommunityProfile {
  id: string;
  name: string; // Person, brand, or community name
  type: 'Content Creator' | 'Brand' | 'Community' | 'Channel' | 'Podcast';
  platform:
    | 'Reddit'
    | 'Instagram'
    | 'TikTok'
    | 'YouTube'
    | 'Spotify'
    | 'LinkedIn';
  url?: string; // Link to the community/channel/profile
  description: string; // What they're known for, relevance to products
  followers: number;
  followerGrowth: string; // e.g., "+2.5K" or "+12%"
  postFrequency: string; // e.g., "5 posts/week"
  engagementRate: string; // e.g., "10%"
  projectedROI: string; // e.g., "16x engagement"
  customerEngagement?: string | undefined; // Specific example of customer interaction
  followerQuotes: Array<{ username: string; quote: string }>; // Sample testimonials with usernames
}
