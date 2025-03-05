export const formaterMånedOgÅr = (dato: string) => {
  const månedOgÅr = new Date(dato).toLocaleDateString('nb-NO', {
    month: 'long',
    year: 'numeric',
  });

  return månedOgÅr[0].toUpperCase() + månedOgÅr.slice(1);
};

export const formaterPeriode = (fra: string, til: string | null) => {
  const fraMånedÅr = formaterMånedOgÅr(fra);
  const tilMånedÅr = til ? formaterMånedOgÅr(til) : '(Nåværende)';

  return `${fraMånedÅr}—${tilMånedÅr}`;
};
