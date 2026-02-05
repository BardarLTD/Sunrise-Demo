'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { WhiteboardBackground } from './WhiteboardBackground';

interface FullscreenCardProps {
  title?: string;
  children: ReactNode;
  id: string;
  onNext?: () => void;
  showNextButton?: boolean;
  centerContent?: boolean;
}

export function FullscreenCard({
  title,
  children,
  id,
  onNext,
  showNextButton = true,
  centerContent = false,
}: FullscreenCardProps) {
  return (
    <section
      id={id}
      className="relative flex h-screen snap-start flex-col overflow-hidden p-12"
    >
      <WhiteboardBackground />

      <div
        className={`relative z-10 flex flex-1 flex-col ${
          centerContent ? 'items-center justify-center' : ''
        }`}
      >
        {title && (
          <h2
            className={`mb-8 text-3xl font-bold text-white ${
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
              variant="secondary"
              className="border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
