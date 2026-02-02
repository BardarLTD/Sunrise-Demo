'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CosmicBackground } from './CosmicBackground';

type ColorTheme = 'purple' | 'grey' | 'emerald' | 'blue' | 'rose';

interface FullscreenCardProps {
  title?: string;
  children: ReactNode;
  id: string;
  onNext?: () => void;
  showNextButton?: boolean;
  theme?: ColorTheme;
  centerContent?: boolean;
  backgroundImage?: string;
}

export function FullscreenCard({
  title,
  children,
  id,
  onNext,
  showNextButton = true,
  theme,
  centerContent = false,
  backgroundImage,
}: FullscreenCardProps) {
  const hasCosmic = !!theme;

  return (
    <motion.section
      id={id}
      className={`relative flex h-screen snap-start flex-col overflow-hidden p-12 ${
        hasCosmic ? '' : 'bg-white shadow-sm'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {hasCosmic && (
        <CosmicBackground
          theme={theme}
          {...(backgroundImage ? { backgroundImage } : {})}
        />
      )}

      <div
        className={`relative z-10 flex flex-1 flex-col ${
          centerContent ? 'items-center justify-center' : ''
        }`}
      >
        {title && (
          <h2
            className={`mb-8 text-3xl font-bold ${hasCosmic ? 'text-white' : ''} ${
              centerContent ? 'absolute left-0 top-0' : ''
            }`}
          >
            {title}
          </h2>
        )}

        <div
          className={
            centerContent ? 'flex w-full items-center justify-center' : 'flex-1'
          }
        >
          {children}
        </div>

        {showNextButton && onNext && (
          <div
            className={centerContent ? 'absolute bottom-0 left-0 mt-8' : 'mt-8'}
          >
            <Button
              onClick={onNext}
              size="lg"
              variant={hasCosmic ? 'secondary' : 'default'}
              className={
                hasCosmic
                  ? 'border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20'
                  : ''
              }
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
