import { PresenterteKandidaterAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function POST(request: Request) {
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
