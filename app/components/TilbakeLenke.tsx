import { Back } from '@navikt/ds-icons';
import Link from 'next/link';
import type { FunctionComponent, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

const Tilbakelenke: FunctionComponent<Props> = ({ href, children }) => (
  <Link href={href} className={'navds-link mb-4'}>
    <Back aria-hidden />
    {children}
  </Link>
);

export default Tilbakelenke;
