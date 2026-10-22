import Kandidatlister from './Kandidatlister';
import { sidetittel } from '@/app/util/sidetittel';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: sidetittel('Kandidatlister') };

export default function Home() {
  return <Kandidatlister />;
}
