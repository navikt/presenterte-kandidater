import { BodyLong, Box } from '@navikt/ds-react';

export const KandidatUtenCv: React.FC = () => (
  <Box
    padding='4'
    borderWidth='1'
    borderRadius='small'
    className='flex flex-col items-start self-stretch px-4 -mx-4 bg-white'
  >
    <BodyLong>Kandidaten er ikke lenger tilgjengelig.</BodyLong>
  </Box>
);
