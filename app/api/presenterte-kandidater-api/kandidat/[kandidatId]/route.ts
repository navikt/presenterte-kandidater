import { erLokalt } from '../../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../../api-routes';
import { proxyWithOBO } from '../../../oboProxy';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  if (erLokalt()) {
    return NextResponse.json({ message: 'Slettet' });
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
