import {
  KandidatCvDTO,
  KandidatlisteForStillingDTO,
  KandidatMedCvDTO,
  Kandidatvurdering,
  Språkkompetanse,
} from '../app/api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { KandidatlisterDTO } from '../app/api/presenterte-kandidater-api/kandidatlister/kandidatlister.typer';

const mocketKandidatliste = (
  stillingId: string,
  tittel: string
  // status = 'ÅPEN' as unknown as any
): KandidatlisteForStillingDTO => {
  return {
    kandidatliste: {
      stillingId,
      uuid: 'f2387b55-c562-4d89-a337-0ae20ac22692',
      tittel,
      status: 'ÅPEN',
      slettet: false,
      virksomhetsnummer: '811076902',
      opprettet: new Date().toISOString(),
      sistEndret: new Date().toISOString(),
    },
    kandidater: mockedeKandidater,
  };
};

const mocketKandidat = (
  kandidatId: string,
  cv: Partial<KandidatCvDTO> | null = {},
  arbeidsgiversVurdering: Kandidatvurdering = Kandidatvurdering.TilVurdering
): KandidatMedCvDTO => ({
  kandidat: {
    uuid: kandidatId,
    arbeidsgiversVurdering,
    // opprettet: new Date().toISOString(),
  },
  cv:
    cv === null
      ? null
      : {
          ...mocketCv,
          ...cv,
        },
});

const mocketCv: KandidatCvDTO = {
  fornavn: 'Kristoffer',
  etternavn: 'Kandidat',
  alder: 30,
  epost: 'kristoffer@kandidat.no',
  mobiltelefonnummer: '+47 91234567',
  telefonnummer: null,
  kompetanse: ['Kniv', 'Kutting', 'Chopping', 'Koking', 'Knusing'],
  førerkort: [
    {
      førerkortKodeKlasse: 'B – Personbil',
    },
  ],
  arbeidserfaring: [
    {
      arbeidsgiver: 'Kiwi Løren',
      stillingstittel: 'Kassamedarbeider',
      beskrivelse:
        'Kassamedarbeider, varetelling. Ansvarlig for åpning og stenging. Opplæring av sommervikarer og førstehjelpansvarlig.',
      fraDato: new Date().toISOString(),
      tilDato: null,
      sted: 'Oslo',
    },
    {
      arbeidsgiver: 'Telenor',
      stillingstittel: 'Kundeservice',
      beskrivelse:
        'Førstesupport for privat abbonement. Telefon- og chat-support.',
      fraDato: new Date().toISOString(),
      tilDato: new Date().toISOString(),
      sted: 'Oslo',
    },
  ],
  fagdokumentasjon: [
    'Fagbrev aluminiumskonstruktør',
    'Fagbrev helsefagarbeider',
    'Fagbrev kokk',
  ],
  godkjenninger: [
    'NS-EN 1418 Gassbeskyttet buesveising Metode 114',
    'Autorisasjon som sykepleier',
  ],
  andreGodkjenninger: [
    {
      tittel: 'Førstehjelpsinstruktør',
      dato: '2016-05-01',
    },
    {
      tittel: 'Sveisemetode 111 - Dekkede elektroder',
      dato: null,
    },
  ],
  kurs: [
    {
      tittel: 'Sanitet nivå 2',
      tilDato: '2018-01-31',
      omfangEnhet: 'DAG',
      omfangVerdi: 10,
    },
  ],
  andreErfaringer: [
    {
      fraDato: new Date().toISOString(),
      tilDato: new Date().toISOString(),
      beskrivelse: 'Grensejeger i finnmark',
      rolle: 'Millitærtjeneste',
    },
    {
      fraDato: new Date().toISOString(),
      tilDato: null,
      beskrivelse: null,
      rolle: 'Fotballtrener',
    },
  ],
  bosted: 'Kokkestad',
  utdanning: [
    {
      fra: '2021-09',
      til: '2021-11',
      beskrivelse: 'Generell utdanning',
      utdannelsessted: 'Universitetet for generalitet',
      utdanningsretning: 'Generalitet',
    },
  ],
  språk: [
    {
      navn: 'Engelsk',
      muntlig: Språkkompetanse.Godt,
      skriftlig: Språkkompetanse.Nybegynner,
    },
  ],
  sammendrag: 'Ønsker å jobbe som kokk',
};

export const mockedeKandidater = [
  mocketKandidat('23d45ba2-ce9e-446e-9137-5ebb44bf6490', {
    fornavn: 'Joare',
    etternavn: 'Mossby',
  }),
  mocketKandidat('2f122c9f-24c3-4a6b-bd01-56a38825dfcf'),
  mocketKandidat(
    '3a175a91-5ee8-4811-be11-5a5d2d33b967',
    {
      fornavn: 'Ola',
      etternavn: 'Nordmann',
    },
    Kandidatvurdering.Aktuell
  ),
  mocketKandidat(
    '4b175a91-5ee8-4811-be11-5a5d2d33b967',
    null,
    Kandidatvurdering.IkkeAktuell
  ),
];

export const mockedeKandidatlister = [
  mocketKandidatliste(
    '1c6894d1-127d-47d5-b3b0-c2778677ee49',
    'Volleyballskuespillere til Pascara Beach'
  ),
  mocketKandidatliste(
    'f2387b55-c562-4d89-a337-0ae20ac22692',
    'Bartender på Galgeberg Corner'
  ),
  mocketKandidatliste(
    '720696c9-0077-464f-b0dc-c12b95db32d4',
    'Misjonærer for Gather Town'
  ),
];

export const mockedeKandidatlistesammendrag = (
  virksomhet: string | null
): KandidatlisterDTO =>
  mockedeKandidatlister
    .filter(
      (kandidatliste) =>
        kandidatliste.kandidatliste.virksomhetsnummer === virksomhet
    )
    .map((kandidatliste) => ({
      kandidatliste: kandidatliste.kandidatliste,
      antallKandidater: kandidatliste.kandidater.length,
    }));
