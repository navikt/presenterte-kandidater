import { NextResponse } from 'next/server';
import mockedeOrganisasjoner from '../../../../mocks/mockOrganisasjoner';
import { erLokalt } from '../../../util/miljø';
import { NotifikasjonAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function GET(request: Request) {
  if (erLokalt()) {
    return NextResponse.json(mockedeOrganisasjoner);
  }

  return proxyWithOBO(NotifikasjonAPI, request);
}
