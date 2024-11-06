import { NextResponse } from 'next/server';
import { mockedeKandidatlistesammendrag } from '../../../../../mocks/mockKandidatliste';
import { erLokalt } from '../../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../../api-routes';
import { proxyWithOBO } from '../../../oboProxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ virksomhetsId: string }> }
) {
  const { virksomhetsId } = await context.params;

  if (erLokalt()) {
    const mock = mockedeKandidatlistesammendrag(virksomhetsId);
    return NextResponse.json(mock);
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
