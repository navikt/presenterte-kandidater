import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Fant ikke siden</h2>
      <Link href={'/'}>Gå til forsiden</Link>
    </div>
  );
}
