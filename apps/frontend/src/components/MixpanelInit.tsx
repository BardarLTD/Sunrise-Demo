'use client';

import { useEffect } from 'react';
import { mixpanelService } from '@/lib/mixpanel';

export default function MixpanelInit() {
  useEffect(() => {
    mixpanelService.initialize();
  }, []);

  return null;
}
