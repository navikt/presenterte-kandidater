import { mockedeNotifikasjoner } from '../../../../mocks/mockNotifikasjoner';
import { erLokalt } from '../../../util/miljø';
import { NotifikasjonAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return proxyWithOBO(NotifikasjonAPI, request);
}

export async function POST(request: Request) {
  if (erLokalt()) {
    return NextResponse.json(mockedeNotifikasjoner);
  }
  return proxyWithOBO(NotifikasjonAPI, request);
}
