import { Modal, Heading, BodyLong, Button, BodyShort } from "@navikt/ds-react";
import { Form } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { ActionData as KandidatActionData } from "~/routes/kandidatliste/$stillingId/kandidat/$kandidatId";
import type { Cv } from "~/services/domene";

type Props = {
    cv: Cv | null;
    vis: boolean;
    onClose: () => void;
    sletterKandidat: boolean;
    feilmeldinger: KandidatActionData;
};

const Slettemodal: FunctionComponent<Props> = ({
    vis,
    onClose,
    cv,
    sletterKandidat,
    feilmeldinger,
}) => (
    <Modal className="kandidatside__slettemodal" open={vis} onClose={onClose}>
        <Heading spacing level="1" size="medium">
            Slett kandidat
            {cv ? ` ${cv.fornavn} ${cv.etternavn}` : ""}
        </Heading>
        <BodyLong>Du kan ikke angre på dette.</BodyLong>

        <Form method="post" className="kandidatside__knapperISlettemodal">
            <Button variant="tertiary" onClick={onClose}>
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
            <BodyShort aria-live="assertive" className="kandidatside__feilmeldingISlettemodal">
                {feilmeldinger.slett}
            </BodyShort>
        )}
    </Modal>
);

export default Slettemodal;
