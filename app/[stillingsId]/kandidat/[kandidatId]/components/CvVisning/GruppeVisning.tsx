import { Heading } from '@navikt/ds-react';
import type { ReactNode } from 'react';

type GruppeProps = {
  icon: ReactNode;
  tittel: string;
  children: ReactNode;
};

export default function Gruppe({ icon, tittel, children }: GruppeProps) {
  return (
    <section className='self-stretch mt-8 md:px-6'>
      <div className='flex items-center gap-4 px-6 py-2 -mx-4 md:-mx-6 mb-8 bg-gray-50 border-b border-gray-400'>
        <div className='w-6 h-6'>{icon}</div>
        <Heading level='3' size='small'>
          {tittel}
        </Heading>
      </div>
      {children}
    </section>
  );
}
