import { mockedeKandidatlister } from '../../../../../mocks/mockKandidatliste';
import { erLokalt } from '../../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../../api-routes';
import { proxyWithOBO } from '../../../oboProxy';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ stillingsId: string }> },
) {
  if (erLokalt()) {
    const { stillingsId } = await context.params;
    const mock = mockedeKandidatlister.find(
      (liste) => liste.kandidatliste.stillingId === stillingsId,
    );
    return NextResponse.json(mock ? mock : null);
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
