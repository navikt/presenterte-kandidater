import type { Metadata } from 'next';

import '@navikt/arbeidsgiver-notifikasjon-widget/lib/cjs/index.css';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import '@navikt/ds-css';
import Script from 'next/script';
import './globals.css';

import { Loader } from '@navikt/ds-react';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ApplikasjonsContextProvider } from './ApplikasjonsContext';
import Header from './components/Header';
import { hentMiljø, Miljø } from './util/miljø';

export const metadata: Metadata = {
  title: 'Foreslåtte kandidater',
};

function RootSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div>Noe gikk galt ved lasting av applikasjonen.</div>}
    >
      <Suspense fallback={<Loader />}>
        <NuqsAdapter>
          <ApplikasjonsContextProvider>{children}</ApplikasjonsContextProvider>
        </NuqsAdapter>
      </Suspense>
    </ErrorBoundary>
  );
}

export const byggBrødsmulesti = (miljø: Miljø) => {
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
  const Decorator = await fetchDecoratorReact({
    env: hentMiljø() === Miljø.ProdGcp ? 'prod' : 'dev',
    params: {
      context: 'arbeidsgiver',
      chatbot: false,
      simple: false,
      breadcrumbs: byggBrødsmulesti(hentMiljø()),
    },
  });

  return (
    <html lang='nb'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Decorator.HeadAssets />
      </head>
      <body className='min-h-screen bg-gray-100'>
        <Decorator.Header />
        <RootSuspense>
          <div className='min-h-screen'>
            <div className='w-full border-b'>
              <Header />
            </div>
            <main className='flex flex-col max-w-[56rem] mb-12 md:mx-auto md:my-4 md:p-4'>
              {children}
            </main>
          </div>
        </RootSuspense>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
