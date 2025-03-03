import { erLokalt } from '../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  if (erLokalt()) {
    return NextResponse.json({ harSamtykket: true });
  }

  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
