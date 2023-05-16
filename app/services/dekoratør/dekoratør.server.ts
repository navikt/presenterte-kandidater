import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
import type { Dekoratørfragmenter } from "./dekoratør";
import { hentBrødsmulesti, hentDekoratørMiljø } from "./dekoratør";
import { hentMiljø, Miljø } from "../miljø";

const visDekoratørUnderUtvikling = false;
const brukSsrDekoratørIMiljø = true;

export const hentSsrDekoratør = async (): Promise<Dekoratørfragmenter | null> => {
    const miljø = hentMiljø();

    if (miljø === Miljø.Lokalt) {
        if (visDekoratørUnderUtvikling) {
            return await hentDekoratør(miljø);
        } else {
            return hentTomDekoratør();
        }
    } else {
        if (brukSsrDekoratørIMiljø) {
            return await hentDekoratør(miljø);
        } else {
            return null;
        }
    }
};

export const hentDekoratør = async (miljø: Miljø): Promise<Dekoratørfragmenter> => {
    const decorator = await fetchDecoratorHtml({
        env: hentDekoratørMiljø(miljø),
        simple: false,
        chatbot: false,
        context: "arbeidsgiver",
        breadcrumbs: hentBrødsmulesti(miljø),
    });

    return {
        styles: decorator.DECORATOR_STYLES,
        header: decorator.DECORATOR_HEADER,
        footer: decorator.DECORATOR_FOOTER,
        scripts: decorator.DECORATOR_SCRIPTS,
    };
};

export const hentTomDekoratør = (): Dekoratørfragmenter => {
    return {
        styles: "",
        header: "",
        footer: "",
        scripts: "",
    };
};
