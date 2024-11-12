import { NextResponse } from 'next/server';
import { erLokalt } from '../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function POST(request: Request) {
  if (erLokalt()) {
    return NextResponse.json({});
  }

  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
