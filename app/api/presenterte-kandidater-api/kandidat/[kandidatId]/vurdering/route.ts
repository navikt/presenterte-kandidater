import { erLokalt } from '../../../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../../../api-routes';
import { proxyWithOBO } from '../../../../oboProxy';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  if (erLokalt()) {
    return new NextResponse();
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
