import { getClusterGCP } from '../util/miljø';

export interface Iroute {
  api_route: string;
  api_url: string;
  internUrl: string;
  scope: string;
}

export const NotifikasjonAPI: Iroute = {
  api_route: '/notifikasjon-api',
  api_url: process.env.NOTIFIKASJON_API ?? '',
  internUrl: '/kandidatliste/api/notifikasjon-bruker-api',
  scope: `${getClusterGCP()}:fager:notifikasjon-bruker-api`,
};

export const PresenterteKandidaterAPI: Iroute = {
  api_route: '/presenterte-kandidater-api',
  api_url: process.env.PRESENTERT_KANDIDATER_API ?? '',
  internUrl: '/kandidatliste/api/presenterte-kandidater-api',
  scope: `${getClusterGCP()}:toi:presenterte-kandidater-api`,
};
