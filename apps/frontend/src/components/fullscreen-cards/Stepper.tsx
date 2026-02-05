'use client';

interface StepperProps {
  steps: number;
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="fixed right-6 top-1/2 z-50 -translate-y-1/2">
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-[#232323] p-2">
        {Array.from({ length: steps }, (_, index) => (
          <button
            key={index}
            onClick={() => onStepClick(index)}
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-medium transition-all duration-300 ${
              currentStep === index
                ? 'bg-[#3a3a3a] text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
