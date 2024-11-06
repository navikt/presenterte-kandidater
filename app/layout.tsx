import type { Metadata } from 'next';

import '@navikt/arbeidsgiver-notifikasjon-widget/lib/cjs/index.css';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import '@navikt/ds-css';
import parse from 'html-react-parser';
import './globals.css';

import { Loader } from '@navikt/ds-react';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { Suspense } from 'react';
import { ApplikasjonsContextProvider } from './ApplikasjonsContext';
import { hentSsrDekoratør } from './components/dekoratør/dekoratør.server';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'Foreslåtte kandidater',
};

function RootSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loader />}>
      <NuqsAdapter>
        <ApplikasjonsContextProvider>{children}</ApplikasjonsContextProvider>
      </NuqsAdapter>
    </Suspense>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dekoratør = await hentSsrDekoratør();

  return (
    <html lang='nb'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        {dekoratør && parse(dekoratør.styles)}
      </head>
      <body className='min-h-screen bg-[--a-gray-100]'>
        {dekoratør && parse(dekoratør.header)}
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
        {dekoratør && parse(dekoratør.footer)}
      </body>
    </html>
  );
}
