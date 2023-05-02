import Bedriftsmeny from "@navikt/bedriftsmeny";
import type { FunctionComponent } from "react";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";

type Props = {
    organisasjoner: Organisasjon[];
};

const Header: FunctionComponent<Props> = ({ organisasjoner }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orgnummer, setOrgnummer] = useState<string | null>(searchParams.get("virksomhet"));
    const navigate = useNavigate();

    useEffect(() => {
        console.log(
            "Orgnummer i headeren:",
            orgnummer,
            "orgnummerfraUrl:",
            searchParams.get("virksomhet")
        );
    });

    useEffect(() => {
        if (orgnummer) {
            const orgnummerFraUrl = searchParams.get("virksomhet");

            if (orgnummerFraUrl !== null && orgnummer !== orgnummerFraUrl) {
                console.log(
                    `Orgnummer fra url er annerledes det i useState, så redirecter til "/kandidatliste?virksomhet=${orgnummer}"`
                );

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
        />
    );
};

export default Header;
