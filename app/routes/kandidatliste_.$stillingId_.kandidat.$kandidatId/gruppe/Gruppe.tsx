import { Heading } from "@navikt/ds-react";
import type { FunctionComponent, ReactNode } from "react";

import css from "./Gruppe.module.css";

const Gruppe: FunctionComponent<{
    icon: ReactNode;
    tittel: string;
    children: ReactNode;
}> = ({ icon, tittel, children }) => {
    return (
        <section className={css.gruppe}>
            <div className={css.header}>
                {icon}
                <Heading level="3" size="small">
                    {tittel}
                </Heading>
            </div>
            {children}
        </section>
    );
};

export default Gruppe;
