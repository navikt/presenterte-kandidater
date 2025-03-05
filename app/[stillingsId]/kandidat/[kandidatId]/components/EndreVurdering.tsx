'use client';

import { useEndreVurdering } from '../../../../api/presenterte-kandidater-api/kandidat/[kandidatId]/vurdering/useEndreVurdering';
import {
  ArbeidsgiversVurderingDTO,
  Kandidatvurdering,
} from '../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { useUseKandidatliste } from '../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/useKandidatliste';
import { KandidatlisteDTO } from '../../../../api/presenterte-kandidater-api/kandidatlister/kandidatlister.typer';
import Vurderingsikon from '../../../components/Vurderingsikon';
import { visVurdering } from '../KandidatVisning';
import {
  BodyShort,
  Button,
  Label,
  Radio,
  RadioGroup,
  ToggleGroup,
} from '@navikt/ds-react';
import { logger } from '@navikt/next-logger';
import { useState } from 'react';

type Props = {
  kandidatId: string;
  kandidatliste: KandidatlisteDTO;
  vurdering: ArbeidsgiversVurderingDTO;
};

export default function EndreVurdering({
  kandidatId,
  kandidatliste,
  vurdering,
}: Props) {
  const [vurderingValgt, setVurderingValgt] = useState(vurdering);

  const endreVurdering = useEndreVurdering(kandidatId);
  const { mutate } = useUseKandidatliste(kandidatliste.stillingId);

  async function handleSubmit() {
    setVurdering(vurderingValgt);
  }

  const setVurdering = (vurdering: string) => {
    endreVurdering.trigger({ arbeidsgiversVurdering: vurdering }).then(() => {
      mutate();
    });
  };

  if (endreVurdering.error) {
    logger.error('Feil ved endring av vurdering', {
      error: endreVurdering.error,
    });
  }
  return (
    <form action={handleSubmit}>
      <div className='hidden md:block print:hidden '>
        <div className='mb-4'>
          <Label>
            Vurdering av kandidat til stilling «{kandidatliste.tittel}»
          </Label>
        </div>
        <ToggleGroup
          className='bg-white'
          value={vurdering}
          onChange={setVurdering}
        >
          {Object.values(Kandidatvurdering).map((valg) => (
            <ToggleGroup.Item key={valg} value={valg}>
              <Vurderingsvalg vurdering={valg} />
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </div>
      <RadioGroup
        className='md:hidden print:hidden [&_label]:py-2 [&_button]:mt-4'
        legend={`Vurdering av kandidat til stilling «${kandidatliste.tittel}»`}
        value={vurderingValgt}
        onChange={setVurderingValgt}
      >
        {Object.values(Kandidatvurdering).map((vurdering) => (
          <Radio key={vurdering} value={vurdering}>
            {visVurdering(vurdering)}
          </Radio>
        ))}
        <Button
          loading={endreVurdering.isMutating}
          name='handling'
          value='endre-vurdering'
          type='submit'
          variant='primary'
        >
          Endre vurdering
        </Button>
      </RadioGroup>

      <input type='hidden' name='vurdering' value={vurdering} />
      <input type='hidden' name='handling' value='endre-vurdering' />

      {endreVurdering.error && (
        <BodyShort aria-live='assertive' className='mt-2 text-red-700'>
          Det skjedde en feil ved endring av vurdering
        </BodyShort>
      )}
    </form>
  );
}

type VurderingsvalgProps = {
  vurdering: Kandidatvurdering;
};

function Vurderingsvalg({ vurdering }: VurderingsvalgProps) {
  return (
    <Label as='span' className='navds-toggle-group__button-inner'>
      <Vurderingsikon vurdering={vurdering} />
      {visVurdering(vurdering)}
    </Label>
  );
}
