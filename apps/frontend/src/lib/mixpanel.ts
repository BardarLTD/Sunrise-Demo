import mixpanel, { type Mixpanel } from 'mixpanel-browser';
import type { UserProperties, FeedbackEvent } from '@/types/mixpanel';

class MixpanelService {
  private static instance: MixpanelService | null = null;
  private mixpanel: Mixpanel | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): MixpanelService {
    if (!MixpanelService.instance) {
      MixpanelService.instance = new MixpanelService();
    }
    return MixpanelService.instance;
  }

  initialize(): void {
    if (this.initialized) {
      return;
    }

    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (!token) {
      console.warn('Mixpanel token not found. Analytics disabled.');
      return;
    }

    mixpanel.init(token, {
      persistence: 'localStorage',
      track_pageview: false,
      api_host: 'https://mix.google-cloud.eventlytics.ai',
      debug: process.env.NODE_ENV === 'development',
      record_sessions_percent: 100,
      autocapture: {
        click: true,
        scroll: true,
        input: true,
        pageview: false,
      },
    });

    this.mixpanel = mixpanel;
    this.initialized = true;
  }

  setUserProperties(properties: UserProperties): void {
    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    this.mixpanel.identify(properties.$email);
    this.mixpanel.people.set(properties);
  }

  trackFeedback(event: FeedbackEvent): void {
    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    this.mixpanel.track('Feedback Submitted', event);
  }

  track(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    this.mixpanel.track(eventName, properties);
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const mixpanelService = MixpanelService.getInstance();
