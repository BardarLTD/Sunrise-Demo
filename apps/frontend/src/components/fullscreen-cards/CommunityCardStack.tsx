'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CommunityCard } from './CommunityCard';
import { Button } from '@/components/ui/button';

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

interface CommunityCardStackProps {
  communities: Community[];
}

export function CommunityCardStack({ communities }: CommunityCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('left');

  // Find the best value community (highest alignment percentage)
  const bestValueId = useMemo(() => {
    const sorted = [...communities].sort(
      (a, b) =>
        b.targetCustomerEngagement.alignmentPercentage -
        a.targetCustomerEngagement.alignmentPercentage,
    );
    return sorted[0]?.id;
  }, [communities]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      // Swiped right - go to previous
      setExitDirection('right');
      setCurrentIndex((prev) =>
        prev === 0 ? communities.length - 1 : prev - 1,
      );
    } else if (info.offset.x < -threshold) {
      // Swiped left - go to next
      setExitDirection('left');
      setCurrentIndex((prev) =>
        prev === communities.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const goToNext = () => {
    setExitDirection('left');
    setCurrentIndex((prev) => (prev === communities.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setExitDirection('right');
    setCurrentIndex((prev) => (prev === 0 ? communities.length - 1 : prev - 1));
  };

  const currentCommunity = communities[currentIndex];
  if (!currentCommunity) return null;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center pb-4">
      {/* Card Stack */}
      <div className="relative h-[700px] w-full max-w-5xl px-4">
        {/* Background cards for stack effect */}
        {communities.slice(0, 3).map((_, index) => {
          if (index === 0) return null;
          const offset = index * 6;
          const scale = 1 - index * 0.03;
          return (
            <div
              key={`bg-${index}`}
              className="absolute inset-0 rounded-3xl bg-slate-800/30"
              style={{
                transform: `translateY(${offset}px) scale(${scale})`,
                zIndex: -index,
              }}
            />
          );
        })}

        {/* Main card with swipe */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentCommunity.id}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            initial={{
              x: exitDirection === 'left' ? 300 : -300,
              opacity: 0,
              rotate: exitDirection === 'left' ? 10 : -10,
            }}
            animate={{
              x: 0,
              opacity: 1,
              rotate: 0,
            }}
            exit={{
              x: exitDirection === 'left' ? -300 : 300,
              opacity: 0,
              rotate: exitDirection === 'left' ? -10 : 10,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.02 }}
          >
            <CommunityCard
              community={currentCommunity}
              isBestValue={currentCommunity.id === bestValueId}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex shrink-0 items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          className="h-12 w-12 rounded-full border-slate-500/50 bg-slate-950/50 text-white backdrop-blur hover:bg-slate-800/50"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Pagination dots */}
        <div className="flex gap-2">
          {communities.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setExitDirection(index > currentIndex ? 'left' : 'right');
                setCurrentIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-slate-400'
                  : 'w-2.5 bg-slate-600/50 hover:bg-slate-500/70'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="h-12 w-12 rounded-full border-slate-500/50 bg-slate-950/50 text-white backdrop-blur hover:bg-slate-800/50"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
