'use client';

import React from 'react';
import {
  Users,
  TrendingUp,
  Target,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import type { CommunityProfile } from '@/types/community';
import FeedbackButton from '@/components/FeedbackButton';
import { mixpanelService } from '@/lib/mixpanel';

interface GeneratedCommunityCardProps {
  community: CommunityProfile;
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper function to generate a color from name
function getColorFromName(name: string): string {
  const colors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ];
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length]!;
}

// Helper function to highlight customer names in text
function highlightCustomerNames(text: string): React.ReactElement {
  // Match patterns like "FirstName LastName" (capitalized words)
  const namePattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = namePattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add highlighted name
    parts.push(
      <span
        key={match.index}
        className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-semibold text-emerald-300 ring-1 ring-emerald-500/30"
      >
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

const formatFollowers = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
};

const typeColors = {
  'Content Creator': 'from-purple-500/20 to-pink-500/20 ring-purple-500/30',
  Brand: 'from-blue-500/20 to-cyan-500/20 ring-blue-500/30',
  Community: 'from-emerald-500/20 to-green-500/20 ring-emerald-500/30',
  Channel: 'from-orange-500/20 to-red-500/20 ring-orange-500/30',
  Podcast: 'from-indigo-500/20 to-violet-500/20 ring-indigo-500/30',
};

const getActionButtonText = (
  type: CommunityProfile['type'],
  platform?: string,
  name?: string,
): string => {
  // Check platform first if available
  if (platform) {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform === 'reddit' || name?.toLowerCase().includes('r/')) {
      return 'Run Reddit ads';
    }
    if (lowerPlatform === 'youtube') {
      return 'Contact for sponsorship';
    }
    if (lowerPlatform === 'instagram') {
      return 'Contact creator';
    }
  }

  // Check name for platform hints
  if (name) {
    const lowerName = name.toLowerCase();
    if (lowerName.startsWith('r/') || lowerName.includes('reddit')) {
      return 'Run Reddit ads';
    }
    if (lowerName.startsWith('@')) {
      return 'Contact creator';
    }
  }

  // Fall back to type-based logic
  switch (type) {
    case 'Content Creator':
      return 'Contact creator';
    case 'Brand':
      return 'Contact brand';
    case 'Community':
      return 'Join and engage';
    case 'Channel':
      return 'Run ads';
    case 'Podcast':
      return 'Sponsor podcast';
    default:
      return 'Take action';
  }
};

export function GeneratedCommunityCard({
  community,
}: GeneratedCommunityCardProps) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#232323] to-[#1a1a1a] shadow-2xl">
      <div className="p-8">
        {/* Header with Profile Circle */}
        <div className="mb-6 flex items-start gap-4">
          {/* Profile Circle */}
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/20 text-lg font-bold text-white ${getColorFromName(community.name)}`}
          >
            {getInitials(community.name)}
          </div>

          {/* Name and Badges */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white">
                {community.name}
              </h3>
              <button
                onClick={() => {
                  mixpanelService.track('View Channel Clicked', {
                    community_id: community.id,
                    community_name: community.name,
                    community_type: community.type,
                    platform: community.platform || 'unknown',
                    page: 'page-3',
                    timestamp: new Date().toISOString(),
                  });
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                title="View channel"
              >
                View channel <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex gap-2">
              <div
                className={`inline-block rounded-full bg-gradient-to-r ${typeColors[community.type]} px-3 py-1 ring-1`}
              >
                <span className="text-sm font-semibold text-white">
                  {community.type}
                </span>
              </div>
              <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 ring-1 ring-blue-500/30">
                <span className="text-sm font-semibold text-blue-200">
                  {community.platform}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-2 text-slate-400">
              <Users size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Followers
              </span>
            </div>
            <p className="text-xl font-bold text-white">
              {formatFollowers(community.followers)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-2 text-slate-400">
              <TrendingUp size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Growth
              </span>
            </div>
            <p className="text-xl font-bold text-emerald-400">
              {community.followerGrowth}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              Post Frequency
            </div>
            <p className="text-xl font-bold text-white">
              {community.postFrequency}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-2 text-slate-400">
              <TrendingUp size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Engagement
              </span>
            </div>
            <p className="text-xl font-bold text-emerald-400">
              {community.engagementRate}
            </p>
          </div>
          <div className="col-span-2 rounded-lg bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-2 text-slate-400">
              <Target size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Projected ROI
              </span>
            </div>
            <p className="text-xl font-bold text-purple-400">
              {community.projectedROI}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            About
          </h4>
          <p className="leading-relaxed text-slate-300">
            {community.description}
          </p>
        </div>

        {/* Customer Engagement */}
        {community.customerEngagement && (
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Your Customer Activity
            </h4>
            <div className="rounded-lg bg-emerald-500/10 p-4 ring-1 ring-emerald-500/20">
              <p className="text-sm leading-relaxed text-slate-200">
                {highlightCustomerNames(community.customerEngagement)}
              </p>
            </div>
          </div>
        )}

        {/* Follower Quotes */}
        {community.followerQuotes && community.followerQuotes.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Community Sentiment
            </h4>
            <div className="space-y-2">
              {community.followerQuotes.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/5 px-4 py-3 text-sm text-slate-300"
                >
                  <div className="mb-1 font-semibold text-blue-300">
                    {item.username}
                  </div>
                  <div className="italic">&quot;{item.quote}&quot;</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <FeedbackButton
            question="How important is going from this insight to an action such as setting up an ad campaign or reaching the talent. And how valuable would this be if it were automated through AI agent? Try to quantify any value you see as much as possible."
            buttonText={getActionButtonText(
              community.type,
              community.platform,
              community.name,
            )}
            onClick={() => {
              // No navigation - just collect feedback
            }}
            answerType="text"
            className="flex-1 rounded-lg border border-white/20 bg-gradient-to-br from-blue-600/80 to-blue-700/80 px-6 py-3 text-base font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:border-white/30 hover:shadow-lg"
          >
            <>
              {getActionButtonText(
                community.type,
                community.platform,
                community.name,
              )}
            </>
          </FeedbackButton>

          <button
            onClick={() => {
              mixpanelService.track('Save Channel Clicked', {
                community_id: community.id,
                community_name: community.name,
                community_type: community.type,
                platform: community.platform || 'unknown',
                page: 'page-3',
                timestamp: new Date().toISOString(),
              });
            }}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 hover:shadow-lg"
          >
            <Bookmark size={18} />
            Save channel
          </button>
        </div>
      </div>
    </div>
  );
}
