'use client';

import { motion } from 'framer-motion';

interface StepperProps {
  steps: number;
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="fixed right-8 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center">
      {Array.from({ length: steps }, (_, index) => (
        <div key={index} className="flex flex-col items-center">
          <motion.button
            onClick={() => onStepClick(index)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
              currentStep === index
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground bg-white text-muted-foreground hover:border-primary hover:text-primary'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {index + 1}
          </motion.button>

          {index < steps - 1 && (
            <div
              className={`h-8 w-0.5 ${
                currentStep > index ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
