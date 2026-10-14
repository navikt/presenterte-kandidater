import { filtrerApmHendelse } from '@/app/util/apm';
import { initNaisAPMClient } from '@nais/apm/react';

const DEKORATØR_URLER = [
  /^https:\/\/dekoratoren\.ekstern\.dev\.nav\.no\//,
  /^https:\/\/dekoratoren-beta\.intern\.dev\.nav\.no\//,
  /^https:\/\/dekoratoren-beta-tms\.intern\.dev\.nav\.no\//,
  /^https:\/\/www\.nav\.no\/dekoratoren\//,
];

if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE !== 'true') {
  initNaisAPMClient({
    namespace: 'toi',
    tracing: true,
    sessionReplay: { enabled: false },
    screenshotOnError: false,
    beforeSend: filtrerApmHendelse,
    faro: {
      ignoreUrls: DEKORATØR_URLER,
    },
  });
}
