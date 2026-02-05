'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CommunityProfile } from '@/types/community';
import { GeneratedCommunityCard } from './GeneratedCommunityCard';
import FeedbackButton from '@/components/FeedbackButton';

interface GeneratedCommunityCardStackProps {
  communities: CommunityProfile[];
}

export function GeneratedCommunityCardStack({
  communities,
}: GeneratedCommunityCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % communities.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + communities.length) % communities.length,
    );
  };

  // Calculate average ROI (mock calculation for demo)
  const averageROI = '18x';
  const totalChannels = 15;

  return (
    <div className="flex h-full w-full gap-6 px-8">
      {/* Left: Navigation Panel */}
      <div className="flex w-80 shrink-0 flex-col justify-center">
        <div className="rounded-2xl border border-white/10 bg-[#232323] p-6 shadow-2xl">
          <h3 className="mb-4 text-xl font-bold text-white">
            Channel Analysis
          </h3>

          {/* Stats */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Channels Found</span>
              <span className="text-lg font-bold text-emerald-300">
                {totalChannels}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Average ROI</span>
              <span className="text-lg font-bold text-emerald-300">
                {averageROI}
              </span>
            </div>
          </div>

          {/* Navigation Info */}
          <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
            <span>
              Channel {currentIndex + 1} of {communities.length}
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

          {/* Filter Button */}
          <div className="mt-4">
            <FeedbackButton
              question="*This feature is in development*. To make it as powerful as possible, please tell us a. What filters you would want and b. How your budget impacts marketing choices"
              buttonText="Filter by channel and budget"
              onClick={() => {
                // No navigation - just collect feedback
              }}
              answerType="text"
              className="w-full rounded-lg border border-emerald-500/30 bg-emerald-900/20 py-2 text-sm font-medium text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-900/30 hover:text-emerald-300"
            >
              <>Filter by channel and budget</>
            </FeedbackButton>
          </div>
        </div>
      </div>

      {/* Right: Community Card */}
      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <GeneratedCommunityCard community={communities[currentIndex]!} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
