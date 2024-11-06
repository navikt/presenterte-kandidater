import { NextResponse } from 'next/server';
import { erLokalt } from '../../../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../../../api-routes';
import { proxyWithOBO } from '../../../../oboProxy';

export async function PUT(request: Request) {
  if (erLokalt()) {
    return NextResponse.json({ message: 'Vurdert' });
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
