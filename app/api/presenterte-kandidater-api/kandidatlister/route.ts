import { PresenterteKandidaterAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function GET(request: Request) {
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
