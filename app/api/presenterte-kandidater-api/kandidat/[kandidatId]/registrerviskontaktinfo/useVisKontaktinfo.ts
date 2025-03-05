import { PresenterteKandidaterAPI } from '../../../../api-routes';
import { postApi } from '../../../../fetcher';
import useSWRMutation from 'swr/mutation';

const visKontaktinfoEndepunkt = (kandidatId: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidat/${kandidatId}/registrerviskontaktinfo`;

export const useVisKontaktinfo = (kandidatId: string) => {
  return useSWRMutation(visKontaktinfoEndepunkt(kandidatId), (url) =>
    postApi(url, {}),
  );
};
