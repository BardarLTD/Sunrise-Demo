'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Customer } from '@/api/api';
import { CosmicBackground } from './CosmicBackground';
import { CustomerCard } from './CustomerCard';
import { Button } from '@/components/ui/button';

interface CustomerCarouselProps {
  customers: Customer[];
  backgroundImage?: string;
}

export function CustomerCarousel({
  customers,
  backgroundImage,
}: CustomerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const actualIndex = activeIndex % customers.length;
  const slideOffset = 350;

  const goToNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % customers.length);
  }, [customers.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + customers.length) % customers.length);
  }, [customers.length]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Calculate visible cards (show 5 at a time for the carousel effect)
  const getVisibleCards = () => {
    const visibleCount = 5;
    const halfVisible = Math.floor(visibleCount / 2);
    const cards: { customer: Customer; position: number; key: string }[] = [];

    for (let i = -halfVisible; i <= halfVisible; i++) {
      const index = (actualIndex + i + customers.length) % customers.length;
      const customer = customers[index];
      if (customer) {
        cards.push({
          customer,
          position: i,
          key: String(customer.id),
        });
      }
    }

    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <CosmicBackground
        theme="purple"
        {...(backgroundImage ? { backgroundImage } : {})}
      />

      {/* Cards carousel */}
      <div className="relative z-10 flex h-[550px] w-full items-center justify-center">
        <AnimatePresence mode="sync">
          {visibleCards.map(({ customer, position, key }) => (
            <motion.div
              key={key}
              className="absolute"
              initial={{
                opacity: 0,
                x: direction * slideOffset + position * 280,
              }}
              animate={{
                opacity: position === 0 ? 1 : 0.7 - Math.abs(position) * 0.15,
                x: position * 280,
                scale: position === 0 ? 1 : 0.85,
                zIndex: position === 0 ? 10 : 5 - Math.abs(position),
              }}
              exit={{
                opacity: 0,
                x: -direction * slideOffset + position * 280,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <CustomerCard customer={customer} isActive={position === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-20 mt-4 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          className="h-12 w-12 rounded-full border-purple-500/50 bg-purple-950/50 text-white backdrop-blur hover:bg-purple-800/50"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Pagination dots */}
        <div className="flex gap-2">
          {customers.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > actualIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === actualIndex
                  ? 'w-8 bg-purple-400'
                  : 'bg-purple-600/50 hover:bg-purple-500/70'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="h-12 w-12 rounded-full border-purple-500/50 bg-purple-950/50 text-white backdrop-blur hover:bg-purple-800/50"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
