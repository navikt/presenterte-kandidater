import type { Miljø as NotifikasjonMiljø } from "@navikt/arbeidsgiver-notifikasjon-widget";
import { NotifikasjonWidget } from "@navikt/arbeidsgiver-notifikasjon-widget";
import Bedriftsmeny from "@navikt/bedriftsmeny";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { useNavigate, useSearchParams } from "@remix-run/react";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useState } from "react";
import { Miljø, hentMiljø } from "~/services/miljø";

type Props = {
    organisasjoner: Organisasjon[];
};

const Header: FunctionComponent<Props> = ({ organisasjoner }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orgnummer, setOrgnummer] = useState<string | null>(searchParams.get("virksomhet"));
    const navigate = useNavigate();
    const miljø = hentMiljøTilNotifikasjonWidget();

    useEffect(() => {
        if (orgnummer) {
            const orgnummerFraUrl = searchParams.get("virksomhet");

            if (orgnummerFraUrl !== null && orgnummer !== orgnummerFraUrl) {
                navigate(`/kandidatliste?virksomhet=${orgnummer}`);
            } else {
                setSearchParams(
                    new URLSearchParams({
                        virksomhet: orgnummer,
                    }),
                    {
                        replace: true,
                    }
                );
            }
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [orgnummer, navigate, setSearchParams]);

    const useOrgnrHook: () => [string | null, (orgnr: string) => void] = useCallback(
        () => [orgnummer, setOrgnummer],
        [orgnummer]
    );

    return (
        <Bedriftsmeny
            sidetittel="Kandidater"
            organisasjoner={organisasjoner}
            orgnrSearchParam={useOrgnrHook}
        >
            <NotifikasjonWidget miljo={miljø} apiUrl="/kandidatliste/notifikasjoner" />
        </Bedriftsmeny>
    );
};

const hentMiljøTilNotifikasjonWidget = (): NotifikasjonMiljø => {
    switch (hentMiljø()) {
        case Miljø.DevGcp:
            return "dev";
        case Miljø.ProdGcp:
            return "prod";
        case Miljø.Lokalt:
            return "local";
        default:
            return "prod";
    }
};

export default Header;
