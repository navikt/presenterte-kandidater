import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
import type { Dekoratørfragmenter } from "./dekoratør";
import { hentBrødsmulesti, hentDekoratørMiljø } from "./dekoratør";
import { hentMiljø } from "./miljø";

let dekoratør: Dekoratørfragmenter;

export const hentDekoratør = async (): Promise<Dekoratørfragmenter> => {
    if (dekoratør) return dekoratør;

    const miljø = hentMiljø();
    const decorator = await fetchDecoratorHtml({
        env: hentDekoratørMiljø(miljø),
        simple: false,
        chatbot: false,
        context: "arbeidsgiver",
        breadcrumbs: hentBrødsmulesti(miljø),
    });

    dekoratør = {
        styles: decorator.DECORATOR_STYLES,
        header: decorator.DECORATOR_HEADER,
        footer: decorator.DECORATOR_FOOTER,
        scripts: decorator.DECORATOR_SCRIPTS.replace('async=""', ""),
    };

    return dekoratør;
};
