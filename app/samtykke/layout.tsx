import { sidetittel } from '@/app/util/sidetittel';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: sidetittel('Vilkår') };

export default function SamtykkeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
