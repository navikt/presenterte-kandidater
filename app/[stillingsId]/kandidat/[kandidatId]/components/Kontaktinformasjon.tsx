import { BodyShort, ReadMore, Tooltip } from '@navikt/ds-react';
import * as React from 'react';
import { sendEvent } from '../../../../amplitude';
import { useVisKontaktinfo } from '../../../../api/presenterte-kandidater-api/kandidat/[kandidatId]/registrerviskontaktinfo/useVisKontaktinfo';

export interface KontaktinformasjonProps {
  epost: string | null;
  telefon: string | null;
  kandidatId: string;
}

const Kontaktinformasjon: React.FC<KontaktinformasjonProps> = ({
  epost,
  telefon,
  kandidatId,
}) => {
  const [harLogget, setHarLogget] = React.useState<boolean>(false);

  React.useEffect(() => {
    const loggPrinting = () => {
      sendEvent('cv', 'lukk-print-dialog');
    };

    window.addEventListener('afterprint', loggPrinting);
    return () => window.removeEventListener('afterprint', loggPrinting);
  }, []);

  const visKontaktinfo = useVisKontaktinfo(kandidatId);

  async function onVisKontaktinformasjon() {
    if (!harLogget) {
      visKontaktinfo.trigger();
      sendEvent('cv', 'vis-kontaktinformasjon');
    }

    setHarLogget(true);
  }

  const innhold = (
    <dl className='grid grid-cols-[5rem_1fr]'>
      {telefon && (
        <>
          <BodyShort as='dt' className='font-bold'>
            Telefon
          </BodyShort>
          <BodyShort as='dd'>{telefon}</BodyShort>
        </>
      )}

      {epost && (
        <>
          <BodyShort as='dt' className='font-bold'>
            E-post
          </BodyShort>
          <BodyShort as='dd'>
            <Tooltip
              className='py-2 px-4'
              content='Skriv en e-post til kandidaten'
            >
              <a
                className='no-underline leading-4 hover:underline'
                href={`mailto:${epost}`}
              >
                {epost}
              </a>
            </Tooltip>
          </BodyShort>
        </>
      )}
    </dl>
  );

  return (
    <>
      <div className='hidden print:block'>{innhold}</div>
      <ReadMore
        className='print:hidden mt-4'
        onClick={onVisKontaktinformasjon}
        header='Vis kontaktinformasjon'
      >
        {innhold}
      </ReadMore>
    </>
  );
};

export default Kontaktinformasjon;
