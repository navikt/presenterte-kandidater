import Bedriftsmeny from "@navikt/bedriftsmeny";
import { useCallback, useEffect, useState } from "react";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import type { FunctionComponent } from "react";
import { useSearchParams } from "@remix-run/react";

type Props = {
    organisasjoner: Organisasjon[];
};

const Header: FunctionComponent<Props> = ({ organisasjoner }) => {
    const [orgnummer, setOrgnummer] = useState<string | null>();
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (orgnummer) {
            setSearchParams(
                new URLSearchParams({
                    virksomhet: orgnummer,
                })
            );
        }
    }, [orgnummer, setSearchParams]);

    const useOrgnrHook: () => [string | null, (orgnr: string) => void] = useCallback(
        () => [orgnummer || null, setOrgnummer],
        [orgnummer]
    );

    return <Bedriftsmeny organisasjoner={organisasjoner} orgnrSearchParam={useOrgnrHook} />;
};

export default Header;
