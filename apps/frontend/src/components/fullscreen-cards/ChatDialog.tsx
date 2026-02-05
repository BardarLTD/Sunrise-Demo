'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { mixpanelService } from '@/lib/mixpanel';

interface ChatDialogProps {
  welcomeTitle?: string;
  welcomeMessage?: string;
  placeholder?: string;
  onSubmit?: (message: string) => void;
}

export function ChatDialog({
  welcomeTitle = 'Welcome',
  welcomeMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  placeholder = 'What is your customer persona?',
  onSubmit,
}: ChatDialogProps) {
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (onSubmit && message.trim()) {
      // Track the prompt text in Mixpanel
      mixpanelService.track('Customer Profile Submitted', {
        prompt_text: message,
        prompt_length: message.length,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      });

      onSubmit(message);
      setMessage('');
    }
  };

  const handleGeneratePrompt = () => {
    setMessage(
      '25-35 y/o white-collar professionals living in Sydney interested in productivity, health/wellness and premium gadgets. $80K+ salary',
    );
  };

  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
    >
      {/* Title above prompt box */}
      <h1 className="mb-4 text-center text-5xl font-bold text-white">
        {welcomeTitle}
      </h1>
      <p className="mb-8 max-w-lg text-center text-base leading-relaxed text-slate-400">
        {welcomeMessage}
      </p>

      {/* Minimal prompt box */}
      <div
        className="relative w-full overflow-hidden rounded-xl border border-white/10 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient background on hover */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-out"
          style={{
            backgroundImage: 'url(/gradient-bg.png)',
            opacity: isHovered ? 0.4 : 0,
          }}
        />
        {/* Solid background */}
        <div
          className="absolute inset-0 bg-[#232323] transition-opacity duration-500 ease-out"
          style={{ opacity: isHovered ? 0.7 : 1 }}
        />

        <form onSubmit={handleSubmit} className="relative z-10">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={`w-full resize-none border-none bg-transparent px-5 py-4 text-base text-white focus:outline-none transition-all duration-500 ease-out ${
              isHovered
                ? 'placeholder:text-white'
                : 'placeholder:text-slate-500'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
            <button
              type="button"
              onClick={handleGeneratePrompt}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Generate Prompt
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
