import { getBasePath, getClusterGCP } from '../util/miljø';

export interface Iroute {
  api_route: string;
  api_url: string;
  internUrl: string;
  scope: string;
}

export const NotifikasjonAPI: Iroute = {
  api_route: '/notifikasjon-api',
  api_url: process.env.NOTIFIKASJON_API_URL ?? '',
  internUrl: `${getBasePath()}/api/notifikasjon-bruker-api`,
  scope: `${getClusterGCP()}:fager:notifikasjon-bruker-api`,
};

export const PresenterteKandidaterAPI: Iroute = {
  api_route: '/presenterte-kandidater-api',
  api_url: process.env.PRESENTERT_KANDIDATER_API ?? '',
  internUrl: `${getBasePath()}/api/presenterte-kandidater-api`,
  scope: `${getClusterGCP()}:toi:presenterte-kandidater-api`,
};
