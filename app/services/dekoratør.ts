import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
import { hentMiljø, Miljø } from "./miljø";

let dekoratør: Dekoratørfragmenter;

export type Dekoratørfragmenter = {
    styles: string;
    header: string;
    footer: string;
    scripts: string;
};

const hentDekoratør = async (): Promise<Dekoratørfragmenter> => {
    if (dekoratør) return dekoratør;

    const miljø = hentMiljø();

    if (miljø === Miljø.Lokalt) {
        return {
            styles: "",
            header: "",
            footer: "",
            scripts: "",
        };
    }

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
        scripts: decorator.DECORATOR_SCRIPTS,
    };

    return dekoratør;
};

const hentBrødsmulesti = (miljø: Miljø) => {
    if (miljø === Miljø.ProdGcp) {
        return [
            {
                title: "Min side - arbeidsgiver",
                url: "https://arbeidsgiver.nav.no/min-side-arbeidsgiver/",
            },
            {
                title: "Kandidatlister",
                url: "https://arbeidsgiver.nav.no/kandidatliste/",
            },
        ];
    } else if (miljø === Miljø.DevGcp) {
        return [
            {
                title: "Min side - arbeidsgiver",
                url: "https://min-side-arbeidsgiver.dev.nav.no/min-side-arbeidsgiver/",
            },
            {
                title: "Kandidatlister",
                url: "https://presenterte-kandidater.dev.nav.no/kandidatliste/",
            },
        ];
    } else {
        return [];
    }
};

const hentDekoratørMiljø = (miljø: Miljø) => {
    return miljø === Miljø.ProdGcp ? "prod" : "dev";
};

export default hentDekoratør;
