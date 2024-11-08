import useSWRMutation from 'swr/mutation';
import { PresenterteKandidaterAPI } from '../../../../api-routes';
import { putApi } from '../../../../fetcher';

const endreVurderingEndepunkt = (kandidatId: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidat/${kandidatId}/vurdering`;

export const useEndreVurdering = (kandidatId: string) => {
  return useSWRMutation(
    endreVurderingEndepunkt(kandidatId),
    (url, { arg }: { arg: { arbeidsgiversVurdering: string } }) =>
      putApi(url, arg)
  );
};
