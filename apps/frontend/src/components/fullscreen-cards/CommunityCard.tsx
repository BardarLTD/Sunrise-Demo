'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaReddit } from 'react-icons/fa';
import {
  Users,
  TrendingUp,
  Star,
  ThumbsUp,
  Eye,
  Calendar,
  ExternalLink,
  Heart,
  MessageCircle,
} from 'lucide-react';

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

interface TargetCustomerEngagement {
  count: number;
  percentage: number;
  alignmentPercentage: number;
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

interface CommunityCardProps {
  community: Community;
  isBestValue?: boolean;
}

const platformIcons = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  reddit: FaReddit,
} as const;

const platformColors = {
  instagram: 'from-pink-500 to-purple-600',
  youtube: 'from-red-500 to-red-700',
  reddit: 'from-orange-500 to-orange-700',
} as const;

const platformLabels = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  reddit: 'Reddit',
} as const;

const sentimentEmoji = {
  very_positive: '🔥',
  positive: '👍',
  neutral: '😐',
  negative: '👎',
  very_negative: '💀',
} as const;

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

export function CommunityCard({ community, isBestValue }: CommunityCardProps) {
  const PlatformIcon = platformIcons[community.platform];
  const platformGradient = platformColors[community.platform];

  const audienceSize =
    community.stats.followers ??
    community.stats.subscribers ??
    community.stats.members ??
    0;

  const audienceLabel =
    community.platform === 'youtube'
      ? 'Subscribers'
      : community.platform === 'reddit'
        ? 'Members'
        : 'Followers';

  const avgEngagement =
    community.stats.avgLikes ??
    community.stats.avgViews ??
    community.stats.avgUpvotes ??
    0;

  const engagementLabel = community.stats.avgViews
    ? 'Avg Views'
    : community.stats.avgUpvotes
      ? 'Avg Upvotes'
      : 'Avg Likes';

  const postFrequency =
    community.stats.postsPerWeek ??
    community.stats.videosPerMonth ??
    community.stats.postsPerDay ??
    0;

  const frequencyLabel =
    community.stats.postsPerWeek !== undefined
      ? 'posts/week'
      : community.stats.videosPerMonth !== undefined
        ? 'videos/month'
        : 'posts/day';

  // Get customers with comments (quotes)
  const customersWithQuotes = community.engagedCustomers.filter(
    (c) => c.quote !== null,
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-[#232323] shadow-2xl">
      {/* Best Value Badge */}
      {isBestValue && (
        <motion.div
          className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-sm font-bold text-slate-900 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Star className="h-4 w-4 fill-current" />
          BEST MATCH
        </motion.div>
      )}

      {/* Left Side - Header Section */}
      <div className="flex w-2/5 shrink-0 flex-col p-6">
        {/* Community Image */}
        <div className="relative mb-4 h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg">
          <Image
            src={community.image}
            alt={community.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>

        {/* Platform */}
        <div className="mb-2 flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${platformGradient} shadow-md`}
          >
            <PlatformIcon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-400">
            {platformLabels[community.platform]}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-white">{community.name}</h3>
          <a
            href={community.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            title="View channel"
          >
            View channel <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="mt-1 text-sm text-slate-400">@{community.handle}</p>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {community.description}
        </p>

        {/* Visit Link */}
        <a
          href={community.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
        >
          Visit Community <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Right Side - Scrollable Content */}
      <div className="flex flex-1 flex-col overflow-y-auto border-l border-white/5 p-6 scrollbar-none">
        {/* Target Match - Hero Metric */}
        <div className="mb-4 rounded-lg bg-emerald-500/10 p-4 ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-300">
                Target Audience Following
              </p>
              <p className="mt-0.5 max-w-xs text-sm text-slate-400">
                Percentage of this community&apos;s audience that are your
                target customers
              </p>
            </div>
            <div className="text-right">
              <motion.p
                className="text-4xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {community.targetCustomerEngagement.alignmentPercentage}%
              </motion.p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
            <motion.div
              className="h-full rounded-full bg-emerald-400"
              initial={{ width: 0 }}
              animate={{
                width: `${community.targetCustomerEngagement.alignmentPercentage}%`,
              }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">{audienceLabel}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-white">
              {formatNumber(audienceSize)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">Engagement Rate</span>
            </div>
            <p className="mt-1 text-xl font-bold text-white">
              {community.stats.engagementRate}%
            </p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-2">
              {community.stats.avgViews ? (
                <Eye className="h-4 w-4 text-slate-400" />
              ) : (
                <Heart className="h-4 w-4 text-slate-400" />
              )}
              <span className="text-xs text-slate-400">{engagementLabel}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-white">
              {formatNumber(avgEngagement)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">Posting</span>
            </div>
            <p className="mt-1 text-xl font-bold text-white">{postFrequency}</p>
            <p className="text-xs text-slate-500">{frequencyLabel}</p>
          </div>
        </div>

        {/* Audience Sentiment */}
        <div className="mb-4 rounded-lg bg-white/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">
              Audience Sentiment
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {sentimentEmoji[community.audienceSentiment.overall]}
              </span>
              <span className="text-sm font-semibold text-white">
                {Math.round(community.audienceSentiment.score * 100)}% positive
              </span>
            </div>
          </div>

          {/* Sentiment Bar */}
          <div className="mt-3 flex h-2 overflow-hidden rounded-full">
            <div
              className="bg-emerald-500"
              style={{
                width: `${community.audienceSentiment.breakdown.positive}%`,
              }}
            />
            <div
              className="bg-slate-500"
              style={{
                width: `${community.audienceSentiment.breakdown.neutral}%`,
              }}
            />
            <div
              className="bg-red-500"
              style={{
                width: `${community.audienceSentiment.breakdown.negative}%`,
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>
              {community.audienceSentiment.breakdown.positive}% positive
            </span>
            <span>
              {community.audienceSentiment.breakdown.neutral}% neutral
            </span>
            <span>
              {community.audienceSentiment.breakdown.negative}% negative
            </span>
          </div>

          {/* Top Themes */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {community.audienceSentiment.topThemes.map((theme) => (
              <span
                key={theme}
                className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Your Customers Here */}
        {customersWithQuotes.length > 0 && (
          <div className="mb-4">
            <p className="mb-3 text-sm font-medium text-slate-300">
              Your Customers Found Here
            </p>
            <div className="space-y-2">
              {customersWithQuotes.slice(0, 2).map((customer) => (
                <div
                  key={customer.customerId}
                  className="rounded-lg bg-white/10 p-3"
                >
                  <div className="flex gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/30">
                      <Image
                        src={customer.customerImage}
                        alt={customer.customerName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-400">
                        {customer.customerName}
                      </p>
                      <p className="mt-0.5 text-sm italic text-white">
                        &quot;{customer.quote}&quot;
                      </p>
                      {customer.likes && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                          <ThumbsUp className="h-3 w-3" />
                          {customer.likes} likes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Voice */}
        {community.audienceSentiment.sampleVoices[0] && (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">
              What People Are Saying
            </p>
            <div className="space-y-2">
              {community.audienceSentiment.sampleVoices
                .slice(0, 2)
                .map((voice, index) => (
                  <div
                    key={index}
                    className="flex gap-2 rounded-lg bg-white/10 p-3"
                  >
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    <p className="text-sm italic text-white">
                      &quot;{voice}&quot;
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
