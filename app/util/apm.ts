import { lagApmFeilrapportering } from '@navikt/toi-next-frontend/apm';

export { filtrerApmHendelse } from '@navikt/toi-next-frontend/apm';

export const { rapporterFeil, rapporterApiFeil } = lagApmFeilrapportering({
  aktiv: process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE !== 'true',
  // Dynamisk import: SDK-et er ESM-only og skal ikke lastes på server eller i enhetstester.
  captureException: (feil, valg) =>
    import('@nais/apm').then(({ captureException }) =>
      captureException(feil, valg),
    ),
});
