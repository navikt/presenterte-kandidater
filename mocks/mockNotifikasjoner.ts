import { mockedeKandidatlister } from './mockKandidatliste';
import mockedeOrganisasjoner from './mockOrganisasjoner';

const tilknyttetKandidatliste = mockedeKandidatlister[0].kandidatliste;

export const mockedeNotifikasjoner = {
  data: {
    notifikasjoner: {
      feilAltinn: false,
      feilDigiSyfo: false,
      notifikasjoner: [
        {
          __typename: 'Beskjed',
          brukerKlikk: {
            id: '25826696721-cca8abd2-8c35-44b2-b3e1-0cff2b3360d1',
            klikketPaa: true,
            __typename: 'BrukerKlikk',
          },
          virksomhet: {
            navn: mockedeOrganisasjoner[0].Name,
            virksomhetsnummer: tilknyttetKandidatliste.virksomhetsnummer,
            __typename: 'Virksomhet',
          },
          lenke: `http://localhost:3000/kandidatliste/${tilknyttetKandidatliste.stillingId}?virksomhet=${tilknyttetKandidatliste.virksomhetsnummer}`,
          tekst: 'Din virksomhet har mottatt nye kandidater',
          merkelapp: 'Kandidater',
          opprettetTidspunkt: '2023-09-27T07:59:07Z',
          sorteringTidspunkt: '2023-09-27T07:59:07Z',
          id: 'cca8abd2-8c35-44b2-b3e1-0cff2b3360d1',
          sak: null,
        },
      ],
      __typename: 'NotifikasjonerResultat',
    },
  },
};
