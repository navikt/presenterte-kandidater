import useSWRMutation from 'swr/mutation';
import { PresenterteKandidaterAPI } from '../../../../api-routes';

const visKontaktinfoEndepunkt = (kandidatId: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidat/${kandidatId}/registrerviskontaktinfo`;

export const useVisKontaktinfo = (kandidatId: string) => {
  return useSWRMutation(visKontaktinfoEndepunkt(kandidatId), (url) =>
    fetch(url, {
      method: 'POST',
    })
  );
};
