export enum Miljø {
  DevGcp = 'dev-gcp',
  ProdGcp = 'prod-gcp',
  Lokalt = 'lokalt',
}

export const getBasePath = () =>
  process.env.NODE_ENV === 'development' ? '' : '';

export const getApiPath = () =>
  process.env.NODE_ENV === 'development' ? '' : '/kandidatliste';

export const getClusterFSS = () => {
  // Sjekker om nåværende cluster er prod-gcp, hvis det er det returneres prod-fss, hvis ikke returneres dev-fss
  if (process.env.NAIS_CLUSTER_NAME === 'prod-gcp') {
    return 'prod-fss';
  } else {
    return 'dev-fss';
  }
};

export const getClusterGCP = () => {
  const cluster = process.env.NAIS_CLUSTER_NAME;

  return cluster;
};

const erHosKlient = () => typeof window !== 'undefined';

export const hentMiljø = () => {
  return erHosKlient() ? hentMiljøFraKlient(window) : hentMiljøFraServer();
};

export const erLokalt = () => hentMiljø() === Miljø.Lokalt;

const hentMiljøFraServer = () => {
  const clusterName = process.env.NAIS_CLUSTER_NAME;

  if (clusterName === Miljø.DevGcp) {
    return Miljø.DevGcp;
  } else if (clusterName === Miljø.ProdGcp) {
    return Miljø.ProdGcp;
  } else {
    return Miljø.Lokalt;
  }
};

const hentMiljøFraKlient = (window: Window) => {
  const { href } = window.location;

  if (href.includes('dev.nav.no')) {
    return Miljø.DevGcp;
  } else if (href.includes('nav.no')) {
    return Miljø.ProdGcp;
  } else {
    return Miljø.Lokalt;
  }
};
