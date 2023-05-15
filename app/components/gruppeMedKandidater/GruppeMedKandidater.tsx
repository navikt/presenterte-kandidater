import { Accordion, Heading } from "@navikt/ds-react";
import { visVurdering } from "~/routes/kandidatliste.$stillingId.kandidat.$kandidatId._index";
import Kandidatsammendrag from "../kandidatsammendrag/Kandidatsammendrag";

import type { ReactNode } from "react";
import type { Kandidatvurdering, Kandidat } from "~/services/domene";

import css from "./GruppeMedKandidater.module.css";

const GruppeMedKandidater = ({
    vurdering,
    icon,
    kandidater,
    stillingId,
}: {
    vurdering?: Kandidatvurdering;
    icon: ReactNode;
    kandidater: Kandidat[];
    stillingId: string;
}) => {
    const kandidaterMedGittStatus = kandidater.filter(
        (kandidat) => kandidat.kandidat.arbeidsgiversVurdering === vurdering
    );

    if (kandidaterMedGittStatus.length === 0) {
        return null;
    }

    return (
        <Accordion>
            <Accordion.Item defaultOpen={kandidaterMedGittStatus.length > 0}>
                <Accordion.Header>
                    <div className={css.header}>
                        {icon}
                        <Heading level="3" size="small">
                            {visVurdering(vurdering)} ({kandidaterMedGittStatus.length})
                        </Heading>
                    </div>
                </Accordion.Header>
                <Accordion.Content className={css.innhold}>
                    <ul className={css.kandidater}>
                        {kandidaterMedGittStatus.map((kandidat) => (
                            <Kandidatsammendrag
                                key={kandidat.kandidat.uuid}
                                kandidat={kandidat}
                                stillingId={stillingId}
                            />
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export default GruppeMedKandidater;
