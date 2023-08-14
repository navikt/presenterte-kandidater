import { CheckmarkCircleIcon, ChevronRightIcon, ExternalLinkIcon } from "@navikt/aksel-icons";
import { BodyShort, Heading, Link, Panel } from "@navikt/ds-react";
import css from "./Spørreskjemalenke.module.css";

const Spørreskjemalenke = () => {
    return (
        <Panel className={css.wrapper}>
            <div className={css.ikon}>
                <ChevronRightIcon fontSize="5rem" aria-hidden />
            </div>
            <div className={css.tekst}>
                <Heading level="3" size="medium" spacing>
                    Hjelp oss å gjøre løsningen bedre for deg
                </Heading>
                <BodyShort spacing>
                    Svar på noen raske spørsmål om hvordan du synes siden fungerer.
                </BodyShort>
                <BodyShort as={"ul"} spacing>
                    <li>
                        <CheckmarkCircleIcon aria-hidden fontSize="1.5rem" /> Det tar bare to
                        minutter
                    </li>
                    <li>
                        <CheckmarkCircleIcon aria-hidden fontSize="1.5rem" /> Er helt anonymt
                    </li>
                </BodyShort>
                <Link
                    target="_blank"
                    href="https://www.survey-xact.no/LinkCollector?key=X3QEX5RFLJ3P"
                >
                    Gå til spørsmålene
                    <ExternalLinkIcon aria-hidden fontSize="1.5rem" />
                </Link>
            </div>
        </Panel>
    );
};

export default Spørreskjemalenke;
