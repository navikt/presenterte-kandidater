import { PresenterteKandidaterAPI } from '../../api-routes';
import { postApi } from '../../fetcher';
import useSWRMutation from 'swr/mutation';

const giSamtykkeEndepunkt = `${PresenterteKandidaterAPI.internUrl}/samtykke`;

export const useGiSamtykke = () => {
  return useSWRMutation(giSamtykkeEndepunkt, (url) => postApi(url, {}));
};
