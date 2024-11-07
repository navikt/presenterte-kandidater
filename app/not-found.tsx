import Link from 'next/link';
import { getBasePath } from './util/miljø';

export default function NotFound() {
  return (
    <div>
      <h2>Fant ikke siden</h2>
      <Link href={getBasePath()}>Gå til forsiden</Link>
    </div>
  );
}
