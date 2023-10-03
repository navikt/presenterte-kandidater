import { BodyLong, BodyShort, Button, Heading, Modal } from "@navikt/ds-react";
import { Form } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { Cv } from "~/services/domene";
import type { ActionData } from "../routeAction";
import css from "./Slettemodal.module.css";

type Props = {
    cv: Cv | null;
    vis: boolean;
    onClose: () => void;
    sletterKandidat: boolean;
    feilmeldinger: ActionData;
};

const Slettemodal: FunctionComponent<Props> = ({
    vis,
    onClose,
    cv,
    sletterKandidat,
    feilmeldinger,
}) => (
    <Modal className={css.slettemodal} open={vis} onClose={onClose}>
        <Heading spacing level="2" size="medium">
            Slett kandidat
            {cv ? ` ${cv.fornavn} ${cv.etternavn}` : ""}
        </Heading>
        <BodyLong>Du kan ikke angre på dette.</BodyLong>

        <Form method="post" className={css.knapper}>
            <Button variant="tertiary" onClick={onClose} type="button">
                Avbryt
            </Button>
            <Button
                loading={sletterKandidat}
                type="submit"
                name="handling"
                value="slett"
                variant="primary"
            >
                Slett
            </Button>
        </Form>
        {feilmeldinger?.slett && (
            <BodyShort aria-live="assertive" className={css.feilmelding}>
                {feilmeldinger.slett}
            </BodyShort>
        )}
    </Modal>
);

export default Slettemodal;
