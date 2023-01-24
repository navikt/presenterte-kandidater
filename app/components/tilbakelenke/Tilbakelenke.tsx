import type { FunctionComponent, ReactNode } from "react";
import { Back } from "@navikt/ds-icons";
import { Link } from "@remix-run/react";
import css from "./Tilbakelenke.module.css";

type Props = {
    href: string;
    children: ReactNode;
};

const Tilbakelenke: FunctionComponent<Props> = ({ href, children }) => (
    <Link to={href} className={"navds-link " + css.tilbakelenke}>
        <Back aria-hidden />
        {children}
    </Link>
);

export default Tilbakelenke;
