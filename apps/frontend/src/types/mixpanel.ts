export interface UserProperties {
  $email: string;
  $name: string;
  company: string;
  adblocker_disabled: boolean;
  first_seen: string; // ISO timestamp
}

export interface FeedbackEvent {
  question: string;
  answer: string;
  button_context: string;
  page: string;
  timestamp: string; // ISO timestamp
}

export type AnswerType = 'text' | 'rating' | 'multiple-choice';
