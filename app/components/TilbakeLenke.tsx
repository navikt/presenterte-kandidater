import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import type { FunctionComponent, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

const Tilbakelenke: FunctionComponent<Props> = ({ href, children }) => (
  <Link href={href} className={'navds-link mb-4'}>
    <ArrowLeftIcon aria-hidden />
    {children}
  </Link>
);

export default Tilbakelenke;
