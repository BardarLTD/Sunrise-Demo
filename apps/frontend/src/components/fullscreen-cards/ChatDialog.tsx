'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/15 to-white/5 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
    >
      {/* Welcome Banner */}
      <div className="border-b border-white/10 bg-white/5 px-8 py-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">{welcomeTitle}</h3>
        </div>
        <p className="text-base leading-relaxed text-slate-300">
          {welcomeMessage}
        </p>
      </div>

      {/* Chat Input Area */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-base text-white placeholder:text-slate-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="gap-2 rounded-xl bg-white/20 px-6 py-5 text-base font-medium text-white backdrop-blur transition-all hover:bg-white/30 hover:scale-105"
            >
              Continue
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
