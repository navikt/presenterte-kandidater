import { ToggleGroup, RadioGroup, Radio, Button, BodyShort } from "@navikt/ds-react";
import { Form } from "@remix-run/react";
import { visVurdering } from "~/routes/kandidatliste/$stillingId/kandidat/$kandidatId";
import type { FunctionComponent } from "react";
import type { Kandidatliste } from "~/services/domene";
import { Kandidatvurdering } from "~/services/domene";
import Vurderingsikon from "./Vurderingsikon";
import css from "./EndreVurdering.module.css";

type Props = {
    kandidatliste: Kandidatliste;
    vurdering: Kandidatvurdering;
    setVurdering: (vurdering: Kandidatvurdering) => void;
    endrerVurdering: boolean;
    feilmelding?: string;
};

const EndreVurdering: FunctionComponent<Props> = ({
    kandidatliste,
    vurdering,
    setVurdering,
    endrerVurdering,
    feilmelding,
}) => (
    <Form method="put">
        <ToggleGroup
            className={css.desktop}
            label={`Vurdering av kandidat til stilling «${kandidatliste.kandidatliste.tittel}»`}
            value={vurdering}
            onChange={(value) => setVurdering(value as Kandidatvurdering)}
        >
            {Object.values(Kandidatvurdering).map((vurdering) => (
                <Vurderingsvalg key={vurdering} vurdering={vurdering} valgtVurdering={vurdering} />
            ))}
        </ToggleGroup>

        <RadioGroup
            className={css.mobil}
            legend={`Vurdering av kandidat til stilling «${kandidatliste.kandidatliste.tittel}»`}
            value={vurdering}
            onChange={setVurdering}
        >
            {Object.values(Kandidatvurdering).map((vurdering) => (
                <Radio key={vurdering} value={vurdering}>
                    {visVurdering(vurdering)}
                </Radio>
            ))}
            <Button
                loading={endrerVurdering}
                name="handling"
                value="endre-vurdering"
                type="submit"
                variant="primary"
            >
                Endre vurdering
            </Button>
        </RadioGroup>
        <input type="hidden" name="vurdering" value={vurdering} />
        <input type="hidden" name="handling" value="endre-vurdering" />
        {feilmelding && (
            <BodyShort aria-live="assertive" className={css.feilmelding}>
                {feilmelding}
            </BodyShort>
        )}
    </Form>
);

type VurderingsvalgProps = {
    valgtVurdering: Kandidatvurdering;
    vurdering: Kandidatvurdering;
};

const Vurderingsvalg: FunctionComponent<VurderingsvalgProps> = ({ vurdering }) => {
    return (
        <ToggleGroup.Item
            // @ts-ignore
            type="submit"
            name="vurdering"
            value={vurdering}
        >
            <Vurderingsikon vurdering={vurdering} />
            {visVurdering(vurdering)}
        </ToggleGroup.Item>
    );
};

export default EndreVurdering;
