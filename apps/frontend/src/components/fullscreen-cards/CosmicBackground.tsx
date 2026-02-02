'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ColorTheme = 'purple' | 'grey' | 'emerald' | 'blue' | 'rose';

interface CosmicBackgroundProps {
  theme?: ColorTheme;
  particleCount?: number;
  showRays?: boolean;
  backgroundImage?: string;
}

const themeColors: Record<
  ColorTheme,
  {
    gradient: string;
    glowPrimary: string;
    glowSecondary: string;
    rays: string;
  }
> = {
  purple: {
    gradient: 'from-indigo-950 via-purple-900 to-slate-900',
    glowPrimary: 'bg-purple-600/20',
    glowSecondary: 'bg-fuchsia-500/20',
    rays: 'from-purple-500/15',
  },
  grey: {
    gradient: 'from-slate-950 via-slate-800 to-zinc-900',
    glowPrimary: 'bg-slate-500/20',
    glowSecondary: 'bg-zinc-400/20',
    rays: 'from-slate-400/15',
  },
  emerald: {
    gradient: 'from-emerald-950 via-teal-900 to-slate-900',
    glowPrimary: 'bg-emerald-600/20',
    glowSecondary: 'bg-teal-500/20',
    rays: 'from-emerald-500/15',
  },
  blue: {
    gradient: 'from-blue-950 via-indigo-900 to-slate-900',
    glowPrimary: 'bg-blue-600/20',
    glowSecondary: 'bg-cyan-500/20',
    rays: 'from-blue-500/15',
  },
  rose: {
    gradient: 'from-rose-950 via-pink-900 to-slate-900',
    glowPrimary: 'bg-rose-600/20',
    glowSecondary: 'bg-pink-500/20',
    rays: 'from-rose-500/15',
  },
};

export function CosmicBackground({
  theme = 'purple',
  particleCount = 40,
  showRays = true,
  backgroundImage,
}: CosmicBackgroundProps) {
  const colors = themeColors[theme];

  // Generate stable random values for particles
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: (i * 37) % 100,
      top: (i * 53) % 100,
      size: 2 + ((i * 13) % 3),
      duration: 3 + ((i * 31) % 40) / 10,
      delay: ((i * 19) % 30) / 10,
    }));
  }, [particleCount]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background Image with blur */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover blur-sm scale-105"
            priority
            sizes="100vw"
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Base gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}
      />

      {/* Animated particles/stars */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <motion.div
        className={`absolute h-64 w-64 rounded-full ${colors.glowPrimary} blur-3xl`}
        style={{ left: '20%', top: '30%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute h-48 w-48 rounded-full ${colors.glowSecondary} blur-2xl`}
        style={{ right: '25%', top: '50%' }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute h-32 w-32 rounded-full ${colors.glowPrimary} blur-2xl`}
        style={{ left: '60%', bottom: '20%' }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center glow effect */}
      <div
        className={`absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.glowPrimary} blur-3xl opacity-50`}
      />

      {/* Light rays */}
      {showRays && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`absolute left-1/2 top-1/2 h-[400px] w-0.5 origin-bottom -translate-x-1/2 bg-gradient-to-t ${colors.rays} to-transparent`}
              style={{ rotate: `${i * 30}deg` }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
