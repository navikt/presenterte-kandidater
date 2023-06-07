import {BodyShort, Heading, Link, LinkPanel, Panel} from "@navikt/ds-react";
import css from './Spørreskjemalenke.module.css';
import {CheckmarkCircleIcon, ChevronRightDoubleIcon, ExternalLinkIcon} from "@navikt/aksel-icons";

const Spørreskjemalenke = () => {
    return (
        <Panel className={css.wrapper}>
            <div className={css.ikon}>
                <ChevronRightDoubleIcon fontSize="5rem" aria-hidden />
            </div>
            <div className={css.tekst}>
                <Heading level="3" size="medium" spacing>
                    Hjelp oss å gjøre løsningen bedre for deg
                </Heading>
                <BodyShort spacing>
                    Svar på noen raske spørsmål om hvordan du synes siden fungerer.
                </BodyShort>
                <BodyShort as={"ul"} spacing>
                    <li><CheckmarkCircleIcon aria-hidden fontSize="1.5rem" /> Det tar bare to minutter</li>
                    <li><CheckmarkCircleIcon aria-hidden fontSize="1.5rem" /> Er helt anonymt</li>
                </BodyShort>
                <Link href="https://www.survey-xact.no/servlet/com.pls.morpheus.web.pages.CoreRespondentCollectLinkAnonymous">
                    Gå til spørsmålene
                    <ExternalLinkIcon aria-hidden fontSize="1.5rem" />
                </Link>
            </div>
        </Panel>
    )
}

export default Spørreskjemalenke;