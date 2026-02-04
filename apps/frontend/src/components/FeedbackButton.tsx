'use client';

import { useState } from 'react';
import { mixpanelService } from '@/lib/mixpanel';
import type { AnswerType } from '@/types/mixpanel';

interface FeedbackButtonProps {
  question: string;
  buttonText: string;
  onClick: () => void;
  answerType?: AnswerType;
  options?: string[]; // For multiple-choice questions
  className?: string;
  disabled?: boolean;
}

export default function FeedbackButton({
  question,
  buttonText,
  onClick,
  answerType = 'text',
  options = [],
  className = '',
  disabled = false,
}: FeedbackButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleMultipleChoiceToggle = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((o) => o !== option);
      }
      return [...prev, option];
    });
  };

  const getAnswerValue = (): string => {
    switch (answerType) {
      case 'rating':
        return rating.toString();
      case 'multiple-choice':
        return selectedOptions.join(', ');
      case 'text':
      default:
        return answer;
    }
  };

  const isAnswerValid = (): boolean => {
    switch (answerType) {
      case 'rating':
        return rating > 0;
      case 'multiple-choice':
        return selectedOptions.length > 0;
      case 'text':
      default:
        return answer.trim().length > 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAnswerValid()) {
      return;
    }

    setIsSubmitting(true);

    // Log feedback to Mixpanel
    mixpanelService.trackFeedback({
      question,
      answer: getAnswerValue(),
      button_context: buttonText,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });

    // Close modal
    setIsModalOpen(false);

    // Reset state
    setAnswer('');
    setRating(0);
    setSelectedOptions([]);
    setIsSubmitting(false);

    // Execute original onClick action
    onClick();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setAnswer('');
    setRating(0);
    setSelectedOptions([]);
  };

  const renderAnswerInput = () => {
    switch (answerType) {
      case 'rating':
        return (
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`w-12 h-12 rounded-full border-2 transition-colors ${
                  rating >= value
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-blue-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleMultipleChoiceToggle(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
      default:
        return (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
            placeholder="Type your answer here..."
            autoFocus
          />
        );
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className={`${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {buttonText}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Feedback
            </h2>
            <p className="text-gray-700 mb-4">{question}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderAnswerInput()}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isAnswerValid() || isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
