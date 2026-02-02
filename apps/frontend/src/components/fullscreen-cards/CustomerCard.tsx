'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
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
  return (
    <motion.div
      className="relative flex h-[480px] w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl"
      animate={{
        scale: isActive ? 1.1 : 0.85,
        opacity: isActive ? 1 : 0.6,
        rotateY: isActive ? 0 : -5,
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        boxShadow: isActive
          ? '0 0 60px rgba(147, 51, 234, 0.5), 0 0 100px rgba(147, 51, 234, 0.3)'
          : '0 10px 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Holographic shine effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />

      {/* Card border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-purple-500/30" />

      {/* Profile Image */}
      <div className="relative mx-auto mt-6 h-28 w-28 overflow-hidden rounded-full border-4 border-purple-500/50 shadow-lg">
        <Image
          src={customer.image}
          alt={customer.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      {/* Name */}
      <h3 className="mt-4 text-center text-xl font-bold text-white">
        {customer.name}
      </h3>

      {/* Social Links */}
      <div className="mt-2 flex justify-center gap-3">
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
                className="text-purple-300 transition-colors hover:text-white"
              >
                <Icon size={18} />
              </a>
            );
          },
        )}
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 px-4">
        <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
          <p className="text-xs text-purple-300">Age</p>
          <p className="text-sm font-semibold text-white">
            {customer.ageRange}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
          <p className="text-xs text-purple-300">Gender</p>
          <p className="text-sm font-semibold text-white">{customer.gender}</p>
        </div>
        <div className="col-span-2 rounded-lg bg-white/5 px-3 py-2 text-center">
          <p className="text-xs text-purple-300">Salary Range</p>
          <p className="text-sm font-semibold text-white">
            {customer.salaryRange}
          </p>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-4 px-4">
        <p className="mb-2 text-xs text-purple-300">Top Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {customer.interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-purple-500/30 px-2.5 py-1 text-xs font-medium text-purple-100"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mt-auto px-4 pb-4">
        <p className="text-center text-xs text-purple-400">
          {customer.location}
        </p>
      </div>
    </motion.div>
  );
}
