import {
  CheckmarkCircleIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, Link } from '@navikt/ds-react';

const Spørreskjemalenke = () => {
  return (
    <Box
      padding='4'
      borderWidth='1'
      borderRadius='small'
      className='flex w-full -mx-4 mt-8 md:mx-0 md:p-10 bg-white'
    >
      <div className='flex-shrink-0 flex items-center bg-[--a-green-100] text-[--a-gray-900] [clip-path:circle()]'>
        <ChevronRightIcon fontSize='5rem' aria-hidden />
      </div>
      <div className='pl-8'>
        <Heading level='3' size='medium' spacing>
          Hjelp oss å gjøre løsningen bedre for deg
        </Heading>
        <BodyShort spacing>
          Svar på noen raske spørsmål om hvordan du synes siden fungerer.
        </BodyShort>
        <BodyShort as='ul' spacing className='p-0'>
          <li className='flex items-center gap-2 list-none'>
            <CheckmarkCircleIcon aria-hidden fontSize='1.5rem' />
            Det tar bare to minutter
          </li>
          <li className='flex items-center gap-2 list-none'>
            <CheckmarkCircleIcon aria-hidden fontSize='1.5rem' />
            Er helt anonymt
          </li>
        </BodyShort>
        <Link
          target='_blank'
          href='https://www.survey-xact.no/LinkCollector?key=X3QEX5RFLJ3P'
        >
          Gå til spørsmålene
          <ExternalLinkIcon aria-hidden fontSize='1.5rem' />
        </Link>
      </div>
    </Box>
  );
};

export default Spørreskjemalenke;
