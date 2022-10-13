import { renderToString } from "react-dom/server";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

const brødsmulesti = [
    {
        title: "Arbeidsgiver",
        url: "https://www.nav.no/no/bedrift",
    },
    {
        title: "Min side - arbeidsgiver",
        url: "https://arbeidsgiver.nav.no/min-side-arbeidsgiver/",
    },
];

const hentDekoratør = async () => {
    const decorator = await fetchDecoratorReact({
        env: process.env.NODE_ENV === "production" ? "prod" : "dev",
        simple: false,
        chatbot: false,
        context: "arbeidsgiver",
        breadcrumbs: brødsmulesti,
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
