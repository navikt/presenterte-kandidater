import { NextResponse } from 'next/server';
import { erLokalt } from '../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function GET(request: Request) {
  if (erLokalt()) {
    return NextResponse.json({ harSamtykke: true });
  }

  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
