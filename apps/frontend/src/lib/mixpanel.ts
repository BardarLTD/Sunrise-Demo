import mixpanel, { type Mixpanel } from 'mixpanel-browser';
import type { UserProperties, FeedbackEvent } from '@/types/mixpanel';

class MixpanelService {
  private static instance: MixpanelService | null = null;
  private mixpanel: Mixpanel | null = null;
  private initialized = false;
  private initializing = false;

  private constructor() {}

  static getInstance(): MixpanelService {
    if (!MixpanelService.instance) {
      MixpanelService.instance = new MixpanelService();
    }
    return MixpanelService.instance;
  }

  initialize(): void {
    // Prevent multiple simultaneous initializations
    if (this.initialized || this.initializing) {
      return;
    }

    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (!token) {
      console.warn('Mixpanel token not found. Analytics disabled.');
      return;
    }

    this.initializing = true;

    try {
      const apiHost =
        process.env.NEXT_PUBLIC_MIXPANEL_API_HOST || 'https://api.mixpanel.com';

      mixpanel.init(token, {
        persistence: 'cookie',
        track_pageview: false,
        api_host: apiHost,
        debug: process.env.NODE_ENV === 'development',
        record_sessions_percent: 100,
        ignore_dnt: true,
        autocapture: false,
        record_mask_text_selector: '',
        record_block_selector: '',
        record_collect_fonts: true,
        batch_requests: true,
        batch_size: 50,
        batch_flush_interval_ms: 5000,
      });

      this.mixpanel = mixpanel;
      this.initialized = true;
      this.initializing = false;

      if (process.env.NODE_ENV === 'development') {
        console.log('Mixpanel initialized with API host:', apiHost);
      }
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
      this.initialized = false;
      this.initializing = false;
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (this.initializing) {
      console.warn('Mixpanel is still initializing, skipping user properties');
      return;
    }

    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.identify(properties.$email);
      this.mixpanel.people.set(properties);
    } catch (error) {
      // Silently handle mutex errors to avoid console spam
      if (error instanceof Error && !error.message.includes('mutex')) {
        console.error('Failed to set user properties:', error);
      }
    }
  }

  trackFeedback(event: FeedbackEvent): void {
    if (this.initializing) {
      console.warn('Mixpanel is still initializing, skipping feedback event');
      return;
    }

    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.track('Feedback Submitted', event);
    } catch (error) {
      // Silently handle mutex errors to avoid console spam
      if (error instanceof Error && !error.message.includes('mutex')) {
        console.error('Failed to track feedback:', error);
      }
    }
  }

  track(eventName: string, properties?: Record<string, unknown>): void {
    if (this.initializing) {
      console.warn('Mixpanel is still initializing, skipping event');
      return;
    }

    if (!this.initialized || !this.mixpanel) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.track(eventName, properties);
    } catch (error) {
      // Silently handle mutex errors to avoid console spam
      if (error instanceof Error && !error.message.includes('mutex')) {
        console.error('Failed to track event:', error);
      }
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const mixpanelService = MixpanelService.getInstance();
