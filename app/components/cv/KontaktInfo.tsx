import { FunctionComponent } from "react";
import { BodyShort, ReadMore, Tooltip } from "@navikt/ds-react";
import css from "./Cv.module.css";
import { useFetcher } from "@remix-run/react";

type Props = {
    epost: string | null;
    telefon: string | null;
};
const KontaktInfo: FunctionComponent<Props> = ({ epost, telefon }) => {
    const fetcher = useFetcher();

    return (
        <ReadMore
            onClick={(event) => fetcher.submit({ handling: "vis-kontakt" }, { method: "get" })}
            header="Vis kontaktinformasjon"
        >
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
        </ReadMore>
    );
};
export default KontaktInfo;
