import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import { hentMiljø, Miljø } from "./miljø";

export type Dekoratørfragmenter = {
    styles: string;
    header: string;
    footer: string;
    scripts: string;
};

export const settInnDekoratørHosKlienten = () => {
    const miljø = hentMiljø();

    if (miljø !== Miljø.Lokalt) {
        injectDecoratorClientSide({
            env: hentDekoratørMiljø(miljø),
            simple: false,
            chatbot: false,
            context: "arbeidsgiver",
            breadcrumbs: hentBrødsmulesti(miljø),
        });
    }
};

export const hentBrødsmulesti = (miljø: Miljø) => {
    if (miljø === Miljø.ProdGcp) {
        return [
            {
                title: "Min side – arbeidsgiver",
                url: "https://arbeidsgiver.nav.no/min-side-arbeidsgiver/",
            },
            {
                title: "Kandidater til dine stillinger",
                url: "https://arbeidsgiver.nav.no/kandidatliste/",
            },
        ];
    } else {
        return [
            {
                title: "Min side – arbeidsgiver",
                url: "https://arbeidsgiver.intern.dev.nav.no/min-side-arbeidsgiver/",
            },
            {
                title: "Kandidater til dine stillinger",
                url: "https://presenterte-kandidater.intern.dev.nav.no/kandidatliste/",
            },
        ];
    }
};

export const hentDekoratørMiljø = (miljø: Miljø) => {
    return miljø === Miljø.ProdGcp ? "prod" : "dev";
};
