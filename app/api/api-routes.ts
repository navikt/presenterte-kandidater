import { getClusterGCP } from '../util/miljø';

export interface Iroute {
  api_route: string;
  api_url: string;
  internUrl: string;
  scope: string;
}

export const NotifikasjonAPI: Iroute = {
  api_route: '/kandidatliste/api',
  api_url: process.env.NOTIFIKASJON_API_URL ?? '',
  internUrl: `/api/notifikasjon-bruker-api`,
  scope: `${getClusterGCP()}:fager:notifikasjon-bruker-api`,
};

export const PresenterteKandidaterAPI: Iroute = {
  api_route: '/kandidatliste',
  api_url: process.env.PRESENTERT_KANDIDATER_API ?? '',
  internUrl: `/api/presenterte-kandidater-api`,
  scope: `${getClusterGCP()}:toi:presenterte-kandidater-api`,
};
