import useSWRMutation from 'swr/mutation';
import { PresenterteKandidaterAPI } from '../../api-routes';
import { postApi } from '../../fetcher';

const giSamtykkeEndepunkt = `${PresenterteKandidaterAPI.internUrl}/samtykke`;

export const useGiSamtykke = () => {
  return useSWRMutation(giSamtykkeEndepunkt, (url) => postApi(url, {}));
};
