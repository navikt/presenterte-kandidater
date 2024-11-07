import useSWRMutation from 'swr/mutation';
import { PresenterteKandidaterAPI } from '../../../api-routes';
import { deleteApi } from '../../../fetcher';

const slettKandidatEndepunkt = (kandidatId: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidat/${kandidatId}`;

export const useSlettKandidat = (kandidatId: string) => {
  return useSWRMutation(slettKandidatEndepunkt(kandidatId), (url) =>
    deleteApi(url)
  );
};
