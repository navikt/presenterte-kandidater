import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import type { Kandidatvurdering } from "~/services/domene";

export type Handling = "endre-vurdering" | "slett" | "vis-kontaktinformasjon";

export type ActionData =
    | undefined
    | {
          slett?: string;
          endreVurdering?: string;
      };

export const routeAction: ActionFunction = async ({ request, context, params }) => {
    const { stillingId, kandidatId } = params;

    if (stillingId === undefined || kandidatId === undefined) {
        throw new Error("Stilling eller kandidat er ikke definert");
    }

    const formData = await request.formData();
    const handling = formData.get("handling") as Handling;

    if (handling === "endre-vurdering") {
        return endreVurdering(request, kandidatId, formData.get("vurdering") as Kandidatvurdering);
    } else if (handling === "slett") {
        return slett(request, stillingId, kandidatId);
    } else if (handling === "vis-kontaktinformasjon") {
        loggVisKontaktinfo(request, kandidatId);

        return null;
    } else {
        return null;
    }
};

const endreVurdering = async (
    request: Request,
    kandidatId: string,
    vurdering: Kandidatvurdering
) => {
    const respons = await proxyTilApi(request, `/kandidat/${kandidatId}/vurdering`, "PUT", {
        arbeidsgiversVurdering: vurdering,
    });

    if (respons.ok) {
        return null;
    } else {
        return json<ActionData>({
            endreVurdering: "Klarte ikke å endre vurdering",
        });
    }
};

const slett = async (request: Request, stillingId: string, kandidatId: string) => {
    const respons = await proxyTilApi(request, `/kandidat/${kandidatId}`, "DELETE");

    if (respons.ok) {
        return redirect(`/kandidatliste/${stillingId}`);
    } else {
        return json<ActionData>({
            slett: "Klarte ikke å slette kandidaten",
        });
    }
};

const loggVisKontaktinfo = async (request: Request, kandidatId: string) => {
    return await proxyTilApi(request, `/kandidat/${kandidatId}/registrerviskontaktinfo`, "POST");
};
