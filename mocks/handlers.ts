import {
  mockedeKandidatlister,
  mockedeKandidatlistesammendrag,
} from './mockKandidatliste';
import { mockedeNotifikasjoner } from './mockNotifikasjoner';
import mockedeOrganisasjoner from './mockOrganisasjoner';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/organisasjoner', () => {
    return HttpResponse.json(mockedeOrganisasjoner);
  }),

  http.get('*/hentsamtykke', () => {
    return HttpResponse.json({ harSamtykket: true });
  }),

  http.post('*/samtykke', () => {
    return HttpResponse.json({});
  }),

  http.get('*/kandidatlister', ({ request }) => {
    const url = new URL(request.url);
    const virksomhetsnummer = url.searchParams.get('virksomhetsnummer');
    return HttpResponse.json(mockedeKandidatlistesammendrag(virksomhetsnummer));
  }),

  http.get('*/kandidatliste/:stillingsId', ({ params }) => {
    const { stillingsId } = params;
    const mock = mockedeKandidatlister.find(
      (liste) => liste.kandidatliste.stillingId === stillingsId,
    );
    return HttpResponse.json(mock ?? null);
  }),

  http.delete('*/kandidat/:kandidatId', () => {
    return HttpResponse.json({ message: 'Slettet' });
  }),

  http.post('*/kandidat/:kandidatId/registrerviskontaktinfo', () => {
    return HttpResponse.json({ message: 'Viskontakt registrert' });
  }),

  http.put('*/kandidat/:kandidatId/vurdering', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post('*/graphql', () => {
    return HttpResponse.json(mockedeNotifikasjoner);
  }),
];
