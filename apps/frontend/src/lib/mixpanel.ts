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

    try {
      const apiHost =
        process.env.NEXT_PUBLIC_MIXPANEL_API_HOST || 'https://api.mixpanel.com';

      mixpanel.init(token, {
        persistence: 'localStorage',
        track_pageview: false,
        api_host: apiHost,
        debug: process.env.NODE_ENV === 'development',
        record_sessions_percent: 100,
        ignore_dnt: true,
        autocapture: false,
        record_mask_text_selector: '',
        record_block_selector: '',
        record_collect_fonts: true,
      });

      this.mixpanel = mixpanel;
      this.initialized = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('Mixpanel initialized with API host:', apiHost);
      }
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
      this.initialized = false;
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.identify(properties.$email);
      this.mixpanel.people.set(properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  trackFeedback(event: FeedbackEvent): void {
    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.track('Feedback Submitted', event);
    } catch (error) {
      console.error('Failed to track feedback:', error);
    }
  }

  track(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.track(eventName, properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const mixpanelService = MixpanelService.getInstance();
