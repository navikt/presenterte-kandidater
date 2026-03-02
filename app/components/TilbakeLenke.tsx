import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Link as AkselLink } from '@navikt/ds-react';
import NextLink from 'next/link';
import type { FunctionComponent, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

const Tilbakelenke: FunctionComponent<Props> = ({ href, children }) => (
  <AkselLink as={NextLink} href={href} className='mb-4'>
    <ArrowLeftIcon aria-hidden />
    {children}
  </AkselLink>
);

export default Tilbakelenke;
