import type { FunctionComponent } from "react";
import { BodyShort, ReadMore, Tooltip } from "@navikt/ds-react";
import { useFetcher } from "@remix-run/react";
import css from "./Kontaktinformasjon.module.css";
import cvCss from "./Cv.module.css";

type Props = {
    epost: string | null;
    telefon: string | null;
};

const Kontaktinformasjon: FunctionComponent<Props> = ({ epost, telefon }) => {
    const fetcher = useFetcher();

    const onVisKontaktinformasjon = () => {
        const formData = new FormData();
        formData.set("handling", "vis-kontaktinformasjon");
        fetcher.submit(formData, { method: "get" });
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
