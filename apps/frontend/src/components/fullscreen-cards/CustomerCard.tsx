'use client';

import Image from 'next/image';
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaFacebook,
} from 'react-icons/fa';
import type { Customer, CustomerSocials } from '@/api/api';

type SocialPlatform = keyof CustomerSocials;

interface CustomerCardProps {
  customer: Customer;
  isActive: boolean;
}

const socialIcons = {
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  facebook: FaFacebook,
} as const;

export function CustomerCard({ customer, isActive }: CustomerCardProps) {
  // Helper to check if interest is relevant to the prompt
  const isRelevantInterest = (interest: string) => {
    const relevantKeywords = [
      'productivity',
      'wellness',
      'health',
      'fitness',
      'yoga',
      'tech',
      'gadgets',
      'gadget',
    ];
    return relevantKeywords.some((keyword) =>
      interest.toLowerCase().includes(keyword),
    );
  };

  return (
    <div
      className={`relative flex h-[380px] w-[820px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#232323] shadow-2xl transition-all duration-300 ${
        isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
      }`}
    >
      {/* Left: Profile Image */}
      <div className="relative h-full w-[320px] shrink-0 overflow-hidden">
        <Image
          src={customer.image}
          alt={customer.name}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Name */}
        <h3 className="text-3xl font-bold text-white">{customer.name}</h3>

        {/* Social Links */}
        <div className="mt-3 flex gap-3">
          {(Object.entries(customer.socials) as [SocialPlatform, string][]).map(
            ([platform, url]) => {
              const Icon = socialIcons[platform];
              if (!Icon || !url) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  <Icon size={20} />
                </a>
              );
            },
          )}
        </div>

        {/* Connections & Oldest Profile */}
        <div className="mt-3 text-sm text-slate-300">
          <span className="font-semibold">{customer.totalConnections}</span>{' '}
          total connections <span className="text-slate-500">•</span> Oldest
          profile:{' '}
          <span className="font-semibold">{customer.oldestProfileYears}</span>{' '}
          yrs
        </div>

        {/* Demographics */}
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-semibold text-white">
            Demographics
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
              <p className="text-xs text-slate-400">Age</p>
              <p className="text-sm font-semibold text-white">
                {customer.ageRange}
              </p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2">
              <p className="text-xs text-slate-400">Gender</p>
              <p className="text-sm font-semibold text-white">
                {customer.gender}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
              <p className="text-xs text-slate-400">Salary</p>
              <p className="text-sm font-semibold text-white">
                {customer.salaryRange}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
              <p className="text-xs text-slate-400">Location</p>
              <p className="text-sm font-semibold text-white">
                {customer.location}
              </p>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-semibold text-white">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {customer.interests.slice(0, 5).map((interest) => {
              const isRelevant = isRelevantInterest(interest);
              return (
                <span
                  key={interest}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    isRelevant
                      ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/30'
                      : 'bg-white/20 text-slate-200'
                  }`}
                >
                  {interest}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
