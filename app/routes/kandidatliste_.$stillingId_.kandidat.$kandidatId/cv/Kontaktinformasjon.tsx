import { BodyShort, ReadMore, Tooltip } from "@navikt/ds-react";
import { useSubmit } from "@remix-run/react";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import { sendEvent } from "~/services/amplitude";
import cvCss from "./Cv.module.css";
import css from "./Kontaktinformasjon.module.css";

type Props = {
    epost: string | null;
    telefon: string | null;
};

const Kontaktinformasjon: FunctionComponent<Props> = ({ epost, telefon }) => {
    const [harLogget, setHarLogget] = useState<boolean>(false);
    const submit = useSubmit();

    useEffect(() => {
        const loggPrinting = () => {
            sendEvent("cv", "lukk-print-dialog");
        };

        window.addEventListener("afterprint", loggPrinting);

        return () => {
            window.removeEventListener("afterprint", loggPrinting);
        };
    });

    const onVisKontaktinformasjon = () => {
        if (!harLogget) {
            submit({ handling: "vis-kontaktinformasjon" }, { method: "post" });
            sendEvent("cv", "vis-kontaktinformasjon");
        }

        setHarLogget(true);
    };

    const innhold = (
        <dl className={cvCss.personalia}>
            {telefon && (
                <>
                    <BodyShort as="dt">Telefon</BodyShort>
                    <BodyShort as="dd">{telefon}</BodyShort>
                </>
            )}

            {epost && (
                <>
                    <BodyShort as="dt">E-post</BodyShort>
                    <BodyShort as="dd">
                        <Tooltip
                            className={css.epostTooltip}
                            content="Skriv en e-post til kandidaten"
                        >
                            <a className={css.epost} href={`mailto:${epost}`}>
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
            <div className={css.print}>{innhold}</div>
            <ReadMore
                className={css.ingenPrint}
                onClick={onVisKontaktinformasjon}
                header="Vis kontaktinformasjon"
            >
                {innhold}
            </ReadMore>
        </>
    );
};

export default Kontaktinformasjon;
