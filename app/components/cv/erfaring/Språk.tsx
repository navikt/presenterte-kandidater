import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import { Språkkompetanse } from "~/services/domene";
import type { Språk as SpråkType } from "~/services/domene";
import css from "./Erfaring.module.css";

const Språk: FunctionComponent<{ språk: SpråkType }> = ({ språk }) => {
    const { navn, muntlig, skriftlig } = språk;

    return (
        <div>
            <Heading className={css.tittel} level="4" size="xsmall">
                {navn}
            </Heading>
            <p className={css.tekst}>Muntlig: {språkkompetanseTilVisning(muntlig)}</p>
            <p className={css.tekst}>Skriftlig: {språkkompetanseTilVisning(skriftlig)}</p>
        </div>
    );
};

const språkkompetanseTilVisning = (kompetanse: Språkkompetanse) => {
    switch (kompetanse) {
        case Språkkompetanse.IkkeOppgitt:
            return "Ikke oppgitt";
        case Språkkompetanse.Nybegynner:
            return "Nybegynner";
        case Språkkompetanse.Godt:
            return "Godt";
        case Språkkompetanse.VeldigGodt:
            return "Veldig godt";
        case Språkkompetanse.Førstespråk:
            return "Førstespråk";
        default:
            return kompetanse;
    }
};

export default Språk;
