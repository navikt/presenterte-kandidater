import * as amplitude from '@amplitude/analytics-browser';
import { Types } from '@amplitude/analytics-browser';
import { hentMiljø, Miljø } from './util/miljø';

export const settOppAmplitude = (): Pick<
  Types.BrowserClient,
  'logEvent' | 'identify'
> | null => {
  const miljø = hentMiljø();

  if (hentMiljø() === Miljø.Lokalt) {
    return null;
  }

  amplitude.init(
    miljø === Miljø.ProdGcp
      ? 'a8243d37808422b4c768d31c88a22ef4'
      : '6ed1f00aabc6ced4fd6fcb7fcdc01b30',
    undefined,
    {
      serverUrl: 'https://amplitude.nav.no/collect',
      useBatch: false,
      autocapture: {
        attribution: true,
        fileDownloads: false,
        formInteractions: false,
        pageViews: true,
        sessions: true,
        elementInteractions: false,
      },
    },
  );

  return amplitude;
};

export const sendEvent = (
  område: string,
  hendelse: string,
  data?: object,
): void => {
  const amplitudeInstans = settOppAmplitude();

  if (!amplitudeInstans) {
    console.warn('Amplitude er ikke initialisert');
    return;
  }

  amplitudeInstans.logEvent(
    ['#presenterte-kandidater', område, hendelse].join('_'),
    data,
  );
};
