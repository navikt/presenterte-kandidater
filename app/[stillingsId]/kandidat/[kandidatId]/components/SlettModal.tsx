'use client';

import { BodyLong, BodyShort, Button, Modal } from '@navikt/ds-react';
import { logger } from '@navikt/next-logger';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useSlettKandidat } from '../../../../api/presenterte-kandidater-api/kandidat/[kandidatId]/useSlettKandidat';
import { KandidatCvDTO } from '../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { useUseKandidatliste } from '../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/useKandidatliste';

type Props = {
  kandidatId: string;
  cv: KandidatCvDTO | null;
  stillingsId: string;
};

export default function Slettemodal({ cv, kandidatId, stillingsId }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const slettAction = useSlettKandidat(kandidatId);

  const { mutate } = useUseKandidatliste(stillingsId);

  async function handleSubmit() {
    slettAction.trigger().then(() => {
      mutate().then(() => {
        router.push(`/${stillingsId}`);
      });
    });
  }

  if (slettAction.data) {
    router.push(`/${stillingsId}`);
  }

  if (slettAction.error) {
    logger.error('Feil ved sletting av kandidat', {
      error: slettAction.error,
    });
  }

  return (
    <>
      <Button
        onClick={() => ref.current?.showModal()}
        variant='secondary'
        className='print:hidden'
      >
        Slett kandidat
      </Button>
      <Modal
        ref={ref}
        header={{
          heading: ` Slett kandidat ${
            cv ? ` ${cv.fornavn} ${cv.etternavn}` : ''
          }`,
        }}
        className='p-6 w-[32rem]'
      >
        <Modal.Body>
          <BodyLong>Du kan ikke angre på dette.</BodyLong>

          <form
            action={handleSubmit}
            className='flex justify-end items-center gap-4'
          >
            <Button
              variant='tertiary'
              onClick={() => ref.current?.close()}
              type='button'
            >
              Avbryt
            </Button>
            <Button
              loading={slettAction.isMutating}
              type='submit'
              name='handling'
              value='slett'
              variant='primary'
            >
              Slett
            </Button>
          </form>

          {slettAction.error && (
            <BodyShort
              aria-live='assertive'
              className='text-right mt-2 text-red-700'
            >
              Det skjedde en feil ved sletting av kandidat
            </BodyShort>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
