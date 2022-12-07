# Presenterte-kandidater

Arbeidsgiverflate for å se kandidater presentert av markedskontakter.

## Feature toggle

Applikasjonen er under utvikling, og alle virksomhetene som skal ha tilgang må legges til i følgende feature toggle:

```
namespace: toi
cluster: dev-gcp/prod-gcp
secret: presenterte-kandidater-toggle
```

Virksomhetene eksponeres i miljøvariabelen `PRESENTERTE_KANDIDATER_TOGGLE`.

## Lokal utvikling

Noen pakker under `@navikt` hentes fra Github sitt NPM-repository. For at dette skal fungere må du først autentisere mot Github:

```
npm login --registry https://npm.pkg.github.com
```

Brukernavn er Github-brukernavnet ditt. Passordet er et [Personal Access Token](https://github.com/settings/tokens) med `read:packages`-scope. Tokenet må autentiseres med SSO mot navikt-organisasjonen.

Når du er logget inn kan du kjøre:

```
npm install
```

For å starte utviklingsserveren, kjør:

```
npm run dev
```

## Teknologi

- Appen er laget med [Remix](https://remix.run/docs), et SSR-rammeverk for React.
- Vi bruker [MSW](https://mswjs.io/) for lokal mocking under utvikling.
