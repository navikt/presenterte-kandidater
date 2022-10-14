import { hentMiljø, Miljø } from "./miljø";

const hentBrødsmulesti = (miljø: Miljø) => {
    console.log("Henter brødsmulesti fra miljø", miljø);

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

export const Styles = () => (
    <link rel="stylesheet" href="https://dekoratoren.ekstern.dev.nav.no/css/client.css" />
);

export const Header = () => <div id="decorator-header" />;
export const Footer = () => <div id="decorator-footer" />;
export const Env = () => {
    const miljø = hentMiljø();
    const brødsmulesti = hentBrødsmulesti(miljø);
    const urlEncoded = encodeURIComponent(JSON.stringify(brødsmulesti));

    return (
        <div
            id="decorator-env"
            data-src={`https://dekoratoren.ekstern.dev.nav.no/env?simple=false&chatbot=false&context=arbeidsgiver&breadcrumbs=${urlEncoded}`}
        ></div>
    );
};

export const Scripts = () => (
    <script async src="https://dekoratoren.ekstern.dev.nav.no/client.js"></script>
);
