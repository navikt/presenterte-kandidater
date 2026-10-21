import { filtrerApmHendelse } from '@/app/util/apm';
import { initNaisAPMClient } from '@nais/apm/react';
import { DEKORATØR_URLER } from '@navikt/toi-next-frontend/apm';

if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE !== 'true') {
  initNaisAPMClient({
    namespace: 'toi',
    tracing: true,
    sessionReplay: { enabled: false },
    screenshotOnError: false,
    beforeSend: filtrerApmHendelse,
    faro: {
      ignoreUrls: [...DEKORATØR_URLER],
    },
  });
}
