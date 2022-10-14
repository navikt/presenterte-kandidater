import { renderToString } from "react-dom/server";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import { hentMiljø, Miljø } from "./miljø";

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

const hentDekoratør = async () => {
    const miljø = hentMiljø();

    const decorator = await fetchDecoratorReact({
        env: process.env.NODE_ENV === "production" ? "prod" : "dev",
        simple: false,
        chatbot: false,
        context: "arbeidsgiver",
        breadcrumbs: hentBrødsmulesti(miljø),
    });

    const HeaderHtml = renderToString(<decorator.Header />);
    const ScriptsHtml = renderToString(<decorator.Scripts />);
    const FooterHtml = renderToString(<decorator.Footer />);
    const StylesHtml = renderToString(<decorator.Styles />);

    return {
        Header: HeaderHtml,
        Scripts: ScriptsHtml,
        Footer: FooterHtml,
        Styles: StylesHtml,
    };
};

export default hentDekoratør;
