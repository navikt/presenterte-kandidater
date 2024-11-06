import useSWRMutation from 'swr/mutation';
import { PresenterteKandidaterAPI } from '../../../api-routes';

const slettKandidatEndepunkt = (kandidatId: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidat/${kandidatId}`;

export const useSlettKandidat = (kandidatId: string) => {
  return useSWRMutation(slettKandidatEndepunkt(kandidatId), (url) =>
    fetch(url, {
      method: 'DELETE',
    })
  );
};
