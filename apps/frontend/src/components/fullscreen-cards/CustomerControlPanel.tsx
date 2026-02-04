'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CustomerProfile } from '@/types/customer';
import { GeneratedCustomerCard } from './GeneratedCustomerCard';
import FeedbackButton from '@/components/FeedbackButton';
import { mixpanelService } from '@/lib/mixpanel';

interface CustomerControlPanelProps {
  customers: CustomerProfile[];
  onViewCommunities?: () => void;
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

export function CustomerControlPanel({
  customers,
  onViewCommunities,
}: CustomerControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % customers.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + customers.length) % customers.length);
  };

  const handleViewCustomers = () => {
    // Track Mixpanel event
    mixpanelService.track('View Customers Clicked', {
      source: 'customer_control_panel',
      customer_count: customers.length,
      page: '/page-2',
      timestamp: new Date().toISOString(),
    });

    // Expand the panel
    setIsExpanded(true);
  };

  const handleViewCommunities = () => {
    // Navigate to communities page
    if (onViewCommunities) {
      onViewCommunities();
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="control-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#232323] p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-white">
                Customer Analysis Complete
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                We found real people matching your target persona
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {/* People Found */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-6">
                <p className="text-sm font-medium text-emerald-400">
                  People Found
                </p>
                <p className="mt-2 text-4xl font-bold text-emerald-300">
                  1,042
                </p>
              </div>

              {/* Average Alignment */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-6">
                <p className="text-sm font-medium text-emerald-400">
                  Average Alignment
                </p>
                <p className="mt-2 text-4xl font-bold text-emerald-300">92%</p>
              </div>
            </div>

            {/* Alignment Range */}
            <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="mb-4 text-sm font-medium text-slate-300">
                Alignment Range
              </p>
              <div className="relative h-16">
                {/* Bar chart */}
                <div className="flex h-full items-end gap-1">
                  {/* Generate bars with heights representing distribution */}
                  {[
                    25, 30, 45, 60, 75, 85, 95, 100, 95, 85, 75, 60, 45, 30, 25,
                  ].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/60 to-emerald-400/80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                {/* Labels */}
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>78%</span>
                  <span className="font-semibold text-emerald-400">
                    92% avg
                  </span>
                  <span>99%</span>
                </div>
              </div>
            </div>

            {/* Profile Photos */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-slate-300">
                Sample Profiles
              </p>
              <div className="flex gap-2">
                {customers.slice(0, 8).map((customer) => (
                  <div
                    key={customer.id}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 text-sm font-bold text-white transition-transform hover:scale-110 hover:border-emerald-400/50 ${getColorFromName(customer.name)}`}
                  >
                    {getInitials(customer.name)}
                  </div>
                ))}
                {customers.length > 8 && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/20 text-xs font-medium text-slate-400">
                    +{customers.length - 8}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleViewCustomers}
                className="group relative flex-1 overflow-hidden rounded-xl border border-white/10 py-4 text-base font-medium text-white transition-all hover:text-white"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-40"
                  style={{ backgroundImage: 'url(/gradient-bg.png)' }}
                />
                <div className="absolute inset-0 bg-[#2a2a2a] opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-70" />
                <span className="relative z-10">View Customers</span>
              </button>

              <button
                onClick={handleViewCommunities}
                className="group relative flex-1 overflow-hidden rounded-xl border border-emerald-500/30 py-4 text-base font-medium text-emerald-400 transition-all hover:border-emerald-500/50 hover:text-emerald-300"
              >
                <div className="absolute inset-0 bg-emerald-900/20 transition-opacity duration-300 group-hover:bg-emerald-900/30" />
                <span className="relative z-10">
                  See Marketing Recommendations
                </span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full gap-6"
          >
            {/* Left: Control Panel (collapsed) */}
            <div className="flex w-80 shrink-0 flex-col justify-center">
              <div className="rounded-2xl border border-white/10 bg-[#232323] p-6 shadow-2xl">
                <h3 className="mb-4 text-xl font-bold text-white">
                  Customer Analysis
                </h3>

                {/* Compact Stats */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">People Found</span>
                    <span className="text-lg font-bold text-emerald-300">
                      1,042
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Avg Alignment
                    </span>
                    <span className="text-lg font-bold text-emerald-300">
                      92%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Range</span>
                    <span className="text-sm font-medium text-slate-300">
                      78% - 99%
                    </span>
                  </div>
                </div>

                {/* Mini Profile Photos */}
                <div className="mb-4">
                  <div className="flex gap-1">
                    {customers.slice(0, 6).map((customer) => (
                      <div
                        key={customer.id}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white ${getColorFromName(customer.name)}`}
                      >
                        {getInitials(customer.name)}
                      </div>
                    ))}
                    {customers.length > 6 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-white/20 text-xs text-slate-400">
                        +{customers.length - 6}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Info */}
                <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
                  <span>
                    Customer {activeIndex + 1} of {customers.length}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={goToPrev}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Contact Customers Button */}
                <div className="mt-4">
                  <FeedbackButton
                    question="How would you like to use the customer list? Email outreach, Social DMs, Survey? some other creative idea? This will help us build the best possible tooling for this data. Assume we have all possible contact data. Please try and quantify how this would impact your business in numbers if possible (i.e. would save x hours finding and building mailing list)."
                    buttonText="Contact Customers"
                    onClick={() => {
                      // No navigation - just collect feedback
                    }}
                    answerType="text"
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-900/20 py-2 text-sm font-medium text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-900/30 hover:text-emerald-300"
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mt-3 w-full rounded-lg border border-white/10 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Close Customer View
                </button>
              </div>
            </div>

            {/* Right: Customer Card */}
            <div className="flex flex-1 items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <GeneratedCustomerCard
                    customer={customers[activeIndex]!}
                    isActive={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
