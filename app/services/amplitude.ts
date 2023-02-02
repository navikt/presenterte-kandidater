import type { AmplitudeClient } from "amplitude-js";
import amplitudeJs from "amplitude-js";
import { hentMiljø, Miljø } from "./miljø";

let client: AmplitudeClient | null = null;

export const settOppAmplitude = (): AmplitudeClient | null => {
    const miljø = hentMiljø();

    // if (hentMiljø() === Miljø.Lokalt) {
    //     return null;
    // }

    client = amplitudeJs.getInstance();
    client.init(
        miljø === Miljø.ProdGcp
            ? "a8243d37808422b4c768d31c88a22ef4"
            : "6ed1f00aabc6ced4fd6fcb7fcdc01b30",
        "",
        {
            apiEndpoint: "amplitude.nav.no/collect",
            saveEvents: false,
            includeUtm: true,
            batchEvents: false,
            includeReferrer: false,
        }
    );

    return client;
};

export const sendEvent = (område: string, hendelse: string, data?: Object): void => {
    if (client === null) {
        client = settOppAmplitude();
    }

    if (client) {
        client.logEvent(["#presenterte-kandidater", område, hendelse].join("_"), data);
    }
};
