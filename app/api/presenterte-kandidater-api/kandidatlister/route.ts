import { NextResponse } from 'next/server';
import { mockedeKandidatlistesammendrag } from '../../../../mocks/mockKandidatliste';
import { erLokalt } from '../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const virksomhetsnummer = url.searchParams.get('virksomhetsnummer');

  if (erLokalt()) {
    const mock = mockedeKandidatlistesammendrag(virksomhetsnummer ?? null);
    return NextResponse.json(mock);
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
