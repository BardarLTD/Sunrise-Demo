'use client';

import { Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';
import type { CustomerProfile } from '@/types/customer';

interface GeneratedCustomerCardProps {
  customer: CustomerProfile;
  isActive: boolean;
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

// Platform icon component
function PlatformIcon({ platform }: { platform: string }) {
  const iconClass = 'h-4 w-4';

  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className={iconClass} />;
    case 'youtube':
      return <Youtube className={iconClass} />;
    case 'linkedin':
      return <Linkedin className={iconClass} />;
    case 'x':
    case 'twitter':
      return <Twitter className={iconClass} />;
    case 'tiktok':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    default:
      return null;
  }
}

export function GeneratedCustomerCard({
  customer,
  isActive,
}: GeneratedCustomerCardProps) {
  return (
    <div
      className={`relative flex h-auto min-h-[420px] w-full max-w-[600px] lg:max-w-[700px] xl:max-w-[820px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#232323] to-[#1a1a1a] p-6 lg:p-8 shadow-2xl transition-all duration-300 ${
        isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
      }`}
    >
      {/* Header with Profile Circle */}
      <div className="mb-4 lg:mb-6">
        <div className="flex items-start gap-3 lg:gap-4">
          {/* Profile Circle */}
          <div
            className={`flex h-12 w-12 lg:h-16 lg:w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/20 text-base lg:text-lg font-bold text-white ${getColorFromName(customer.name)}`}
          >
            {getInitials(customer.name)}
          </div>

          {/* Name and Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl lg:text-2xl font-bold text-white truncate">
              {customer.name}
            </h3>

            {/* Platform Icons */}
            <div className="mt-2 flex items-center gap-2">
              {customer.platforms.map((platform) => (
                <div
                  key={platform}
                  className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-slate-300"
                >
                  <PlatformIcon platform={platform} />
                </div>
              ))}
            </div>

            {/* Profile Stats */}
            <div className="mt-2 flex gap-3 text-xs text-slate-400">
              <span>Oldest profile: {customer.oldestProfileAge} years</span>
              <span>•</span>
              <span>
                {customer.totalConnections.toLocaleString()} connections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="mb-3 lg:mb-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Demographics
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-500/20 px-2.5 lg:px-3 py-1 text-xs lg:text-sm text-emerald-200 ring-1 ring-emerald-500/30 whitespace-nowrap">
            {customer.age} years
          </span>
          <span className="rounded-full bg-white/10 px-2.5 lg:px-3 py-1 text-xs lg:text-sm text-slate-300 whitespace-nowrap">
            {customer.salaryRange}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 lg:px-3 py-1 text-xs lg:text-sm text-slate-300">
            {customer.workRole}
          </span>
        </div>
      </div>

      {/* Interests */}
      <div className="mb-3 lg:mb-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Interests
        </h4>
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          {customer.relevantInterests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-emerald-500/20 px-2.5 lg:px-3 py-1 text-xs lg:text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/30 transition-all"
            >
              {interest}
            </span>
          ))}
          {customer.otherInterests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/10 px-2.5 lg:px-3 py-1 text-xs lg:text-sm font-medium text-slate-300 transition-all"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Buyer Signals */}
      <div className="mt-auto pt-2">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Activity
        </h4>
        <div className="rounded-lg bg-purple-500/10 p-2.5 lg:p-3 ring-1 ring-purple-500/20">
          <p className="text-xs lg:text-sm leading-relaxed text-slate-200">
            {customer.buyerSignals}
          </p>
        </div>
      </div>

      {/* Relevance Score (if available) */}
      {customer.relevanceScore !== undefined && (
        <div className="absolute right-4 top-4">
          <div className="rounded-full bg-emerald-500/20 px-3 py-1 ring-1 ring-emerald-500/30">
            <span className="text-xs font-semibold text-emerald-300">
              {Math.round(customer.relevanceScore * 100)}% match
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
