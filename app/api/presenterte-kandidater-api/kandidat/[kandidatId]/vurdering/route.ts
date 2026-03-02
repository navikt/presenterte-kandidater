import { PresenterteKandidaterAPI } from '../../../../api-routes';
import { proxyWithOBO } from '../../../../oboProxy';

export async function PUT(request: Request) {
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
