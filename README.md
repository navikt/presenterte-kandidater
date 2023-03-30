# Presenterte-kandidater

Arbeidsgiverflate for å se kandidater presentert av markedskontakter.

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



# Henvendelser

## For Nav-ansatte

* Dette Git-repositoriet eies
  av [team Toi i produktområde Arbeidsgiver](https://teamkatalog.nav.no/team/76f378c5-eb35-42db-9f4d-0e8197be0131).
* Slack-kanaler:
    * [#arbeidsgiver-toi-dev](https://nav-it.slack.com/archives/C02HTU8DBSR)
    * [#rekrutteringsbistand-værsågod](https://nav-it.slack.com/archives/C02HWV01P54)

## For folk utenfor Nav

IT-avdelingen i [Arbeids- og velferdsdirektoratet](https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/arbeids-og-velferdsdirektoratet-kontorinformasjon)

