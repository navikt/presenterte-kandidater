import { PresenterteKandidaterAPI } from '../../../api-routes';
import { proxyWithOBO } from '../../../oboProxy';

export async function DELETE(request: Request) {
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
