'use client';

import { useApmRouteTracking } from '@nais/apm/react';
import { usePathname } from 'next/navigation';

export default function ApmRutetracker() {
  useApmRouteTracking(usePathname());
  return null;
}
