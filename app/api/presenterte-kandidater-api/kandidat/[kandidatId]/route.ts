import { NextResponse } from 'next/server';
import { erLokalt } from '../../../../util/miljø';
import { PresenterteKandidaterAPI } from '../../../api-routes';
import { proxyWithOBO } from '../../../oboProxy';

export async function DELETE(request: Request) {
  if (erLokalt()) {
    return NextResponse.json({ message: 'Slettet' });
  }
  return proxyWithOBO(PresenterteKandidaterAPI, request);
}
