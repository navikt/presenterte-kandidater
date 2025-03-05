import { Heading } from '@navikt/ds-react';

export default function Førerkort({
  førerkort,
}: {
  førerkort: { førerkortKodeKlasse: string };
}) {
  const { førerkortKodeKlasse } = førerkort;

  return (
    <Heading level='4' size='xsmall' className='text-xl mt-8'>
      {førerkortKodeKlasse}
    </Heading>
  );
}
