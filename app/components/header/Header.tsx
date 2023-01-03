import Bedriftsmeny from "@navikt/bedriftsmeny";
import { useCallback, useEffect, useState } from "react";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import type { FunctionComponent } from "react";
import { useSearchParams } from "@remix-run/react";
import { useNavigate } from "react-router-dom";

type Props = {
    organisasjoner: Organisasjon[];
};

const Header: FunctionComponent<Props> = ({ organisasjoner }) => {
    const [orgnummer, setOrgnummer] = useState<string | null>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

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
        () => [orgnummer || null, setOrgnummer],
        [orgnummer]
    );

    return (
        <Bedriftsmeny
            sidetittel="Kandidater"
            organisasjoner={organisasjoner}
            orgnrSearchParam={useOrgnrHook}
        />
    );
};

export default Header;
