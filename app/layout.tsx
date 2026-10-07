import { ApplikasjonsContextProvider } from './ApplikasjonsContext';
import Header from './components/Header';
import './globals.css';
import { hentMiljø, Miljø } from './util/miljø';
import ApmRutetracker from '@/app/components/ApmRutetracker';
import NotifikasjonProvider from '@/app/components/NotifikasjonProvider';
import RotFeilgrense from '@/app/components/RotFeilgrense';
import { versionFromImage } from '@nais/apm';
import '@navikt/ds-css';
import { Loader } from '@navikt/ds-react';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import '@navikt/virksomhetsvelger/dist/assets/style.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { connection } from 'next/server';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return {
    title: 'Foreslåtte kandidater',
    other: {
      'nais-app': process.env.NAIS_APP_NAME ?? 'presenterte-kandidater',
      'nais-team': 'toi',
      'nais-cluster': process.env.NAIS_CLUSTER_NAME ?? 'local',
      'nais-version': versionFromImage(process.env.NAIS_APP_IMAGE) ?? 'local',
      ...(process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL && {
        'nais-telemetry-url': process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL,
      }),
    },
  };
}

function RootSuspense({ children }: { children: React.ReactNode }) {
  return (
    <RotFeilgrense>
      <Suspense
        fallback={
          <div className='flex justify-center'>
            <Loader />
          </div>
        }
      >
        <NuqsAdapter>
          <ApplikasjonsContextProvider>{children}</ApplikasjonsContextProvider>
        </NuqsAdapter>
      </Suspense>
    </RotFeilgrense>
  );
}

const byggBrødsmulesti = (miljø: Miljø) => {
  if (miljø === Miljø.ProdGcp) {
    return [
      {
        title: 'Min side – arbeidsgiver',
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
      },
      {
        title: 'Kandidater til dine stillinger',
        url: 'https://arbeidsgiver.nav.no/kandidatliste/',
      },
    ];
  } else {
    return [
      {
        title: 'Min side – arbeidsgiver',
        url: 'https://arbeidsgiver.intern.dev.nav.no/min-side-arbeidsgiver/',
      },
      {
        title: 'Kandidater til dine stillinger',
        url: 'https://presenterte-kandidater.intern.dev.nav.no/kandidatliste/',
      },
    ];
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const miljø = hentMiljø();
  const erLokalt = miljø === Miljø.Lokalt;

  const Decorator = await fetchDecoratorReact({
    env: miljø === Miljø.ProdGcp ? 'prod' : 'dev',
    params: {
      context: 'arbeidsgiver',
      chatbot: false,
      simple: false,
      breadcrumbs: byggBrødsmulesti(miljø),
    },
  });

  return (
    <html lang='nb'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Decorator.HeadAssets />
      </head>
      <body className='min-h-screen bg-gray-100' data-testid='app-root'>
        {process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE !== 'true' && (
          <ApmRutetracker />
        )}
        <div data-pa11y-ignore='decorator-header'>
          <Decorator.Header />
        </div>
        <NotifikasjonProvider>
          <RootSuspense>
            <div data-testid='app-root' className='min-h-screen'>
              <div className='w-full border-b'>
                <Header />
              </div>
              <main className='flex flex-col max-w-[56rem] mb-12 md:mx-auto md:my-4 md:p-4'>
                {children}
              </main>
            </div>
          </RootSuspense>
        </NotifikasjonProvider>
        <div data-pa11y-ignore='decorator-footer'>
          <Decorator.Footer />
        </div>
        {!erLokalt && <Decorator.Scripts loader={Script} />}
      </body>
    </html>
  );
}
