import {
  Attachment,
  Bag,
  Calender,
  Car,
  Cognition,
  Dialog,
  FileContent,
  Law,
  Office1,
  Office2,
  Star,
} from '@navikt/ds-icons';
import { BodyLong, BodyShort, Box, Heading } from '@navikt/ds-react';
import { KandidatCvDTO } from '../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import AnnenErfaring from './CvVisning/AnnenErfaringVisning';
import AnnenGodkjenning from './CvVisning/AnnenGodkjenningVisning';
import Arbeidserfaring from './CvVisning/ArbeidserfaringVisning';
import Førerkort from './CvVisning/FørerkortVisning';
import Gruppe from './CvVisning/GruppeVisning';
import Kurs from './CvVisning/KursVisning';
import Språk from './CvVisning/SpråkVisning';
import Utdanning from './CvVisning/UtdanningVisning';
import Kontaktinformasjon from './Kontaktinformasjon';

type KandidatCv = {
  cv: KandidatCvDTO;
  kandidatId: string;
};

const KandidatCv: React.FC<KandidatCv> = ({ cv, kandidatId }) => {
  const navn = `${cv.fornavn} ${cv.etternavn}`;

  return (
    <Box
      padding='4'
      borderWidth='1'
      borderRadius='small'
      className='flex flex-col items-start self-stretch p-4 -mx-4 md:p-10 md:mx-0 bg-white'
    >
      <Heading
        aria-label={`CV-en til ${navn}`}
        size='large'
        level='2'
        className='mb-8 md:self-center'
      >
        {navn}
      </Heading>

      <dl className='grid grid-cols-[5rem_1fr]'>
        <BodyShort as='dt' className='font-bold'>
          Bosted
        </BodyShort>
        <BodyShort as='dd'>{cv.bosted}</BodyShort>

        {cv.alder && (
          <>
            <BodyShort as='dt' className='font-bold'>
              Alder
            </BodyShort>
            <BodyShort as='dd'>{cv.alder}</BodyShort>
          </>
        )}
      </dl>

      <Kontaktinformasjon
        epost={cv.epost}
        telefon={cv.mobiltelefonnummer || cv.telefonnummer}
        kandidatId={kandidatId}
      />

      <Gruppe icon={<Star aria-hidden />} tittel='Kompetanse'>
        <Liste elementer={cv.kompetanse} />
      </Gruppe>

      <Gruppe icon={<FileContent aria-hidden />} tittel='Sammendrag'>
        {cv.sammendrag}
      </Gruppe>

      <Gruppe icon={<Office2 aria-hidden />} tittel='Utdanning'>
        {cv.utdanning.map((utdanning) => (
          <Utdanning key={utdanning.utdanningsretning} utdanning={utdanning} />
        ))}
      </Gruppe>

      {cv.fagdokumentasjon.length > 0 && (
        <Gruppe
          icon={<Bag aria-hidden />}
          tittel='Fagbrev, svennebrev og mesterbrev'
        >
          <Liste elementer={cv.fagdokumentasjon} />
        </Gruppe>
      )}

      <Gruppe icon={<Office1 aria-hidden />} tittel='Arbeidserfaring'>
        {cv.arbeidserfaring.map((arbeidserfaring) => (
          <Arbeidserfaring
            key={arbeidserfaring.stillingstittel}
            arbeidserfaring={arbeidserfaring}
          />
        ))}
      </Gruppe>

      {cv.godkjenninger.length > 0 && (
        <Gruppe icon={<Law aria-hidden />} tittel='Offentlige godkjenninger'>
          <Liste elementer={cv.godkjenninger} />
        </Gruppe>
      )}

      {cv.andreGodkjenninger.length > 0 && (
        <Gruppe icon={<Attachment aria-hidden />} tittel='Andre godkjenninger'>
          {cv.andreGodkjenninger.map((godkjenning) => (
            <AnnenGodkjenning
              key={godkjenning.tittel}
              godkjenning={godkjenning}
            />
          ))}
        </Gruppe>
      )}

      {cv.førerkort.length > 0 && (
        <Gruppe icon={<Car aria-hidden />} tittel='Førerkort'>
          {cv.førerkort.map((førerkort) => (
            <Førerkort
              key={førerkort.førerkortKodeKlasse}
              førerkort={førerkort}
            />
          ))}
        </Gruppe>
      )}

      {cv.språk.length > 0 && (
        <Gruppe icon={<Dialog aria-hidden />} tittel='Språk'>
          {cv.språk.map((språk) => (
            <Språk key={språk.navn} språk={språk} />
          ))}
        </Gruppe>
      )}

      {cv.kurs.length > 0 && (
        <Gruppe icon={<Calender aria-hidden />} tittel='Kurs'>
          {cv.kurs.map((kurs) => (
            <Kurs key={kurs.tittel} kurs={kurs} />
          ))}
        </Gruppe>
      )}

      {cv.andreErfaringer.length > 0 && (
        <Gruppe icon={<Cognition aria-hidden />} tittel='Andre erfaringer'>
          {cv.andreErfaringer.map((erfaring) => (
            <AnnenErfaring key={erfaring.beskrivelse} erfaring={erfaring} />
          ))}
        </Gruppe>
      )}
    </Box>
  );
};

function Liste({ elementer }: { elementer: Array<string | null> }) {
  return (
    <ul className='leading-6 m-0 pl-6 md:columns-2 md:gap-8'>
      {elementer
        .filter((e) => e !== null)
        .map((e) => (
          <li key={e}>{e}</li>
        ))}
    </ul>
  );
}

export function KandidatUtenCv() {
  return (
    <Box
      padding='4'
      borderWidth='1'
      borderRadius='small'
      className='flex flex-col items-start self-stretch p-4 -mx-4 md:p-10 md:mx-0 bg-white'
    >
      <Heading size='large' level='2' className='mb-8 md:self-center'>
        Utilgjengelig kandidat
      </Heading>
      <BodyLong>
        Kandidaten er ikke lenger tilgjengelig for denne stillingen. Dette kan
        være fordi kandidaten har trukket sin CV, eller fordi kandidaten ikke
        lenger er aktiv arbeidssøker.
      </BodyLong>
    </Box>
  );
}

export default KandidatCv;
