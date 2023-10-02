import { BodyShort, Button, Label, Radio, RadioGroup, ToggleGroup } from "@navikt/ds-react";
import { Form } from "@remix-run/react";
import type { FunctionComponent } from "react";
import Vurderingsikon from "~/components/vurderingsikon/Vurderingsikon";
import type { Kandidatliste } from "~/services/domene";
import { Kandidatvurdering } from "~/services/domene";
import { visVurdering } from "../route";
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
        >
            {Object.values(Kandidatvurdering).map((valg) => (
                <Vurderingsvalg
                    key={valg}
                    vurdering={valg}
                    valgtVurdering={vurdering}
                    onClick={() => setVurdering(valg)}
                />
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
    onClick: () => void;
};

const Vurderingsvalg: FunctionComponent<VurderingsvalgProps> = ({
    vurdering,
    valgtVurdering,
    onClick,
}) => {
    return (
        <button
            role="radio"
            type="submit"
            name="vurdering"
            className="navds-toggle-group__button"
            aria-checked={vurdering === valgtVurdering}
            onClick={onClick}
            value={vurdering}
        >
            <Label as="span" className="navds-toggle-group__button-inner">
                <Vurderingsikon vurdering={vurdering} />
                {visVurdering(vurdering)}
            </Label>
        </button>
    );
};

export default EndreVurdering;
