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
npm run start
```

## Hvordan teste manuelt i dev-miljøet

Du trenger en testvirksomhet, samt en testperson som har rettigheter til å se virksomhetens kandidatlister.

### Testvirksomhet

Vi bruker en håndfull spesifikke testvirksomheter. De er [hardkodet i appen Rekrutteringsbistand](https://github.com/navikt/rekrutteringsbistand/blob/master/src/stilling/api/devVirksomheter.ts) og er opprettet i Altinn sitt testmiljø.

### Testperson
Du kan (bør?) opprette din egen testperson, som du logger på med når du skal se arbeidsgivers kandidatliste for en virksomhet. Din nye testperson må få sine rettigheter fra en annen testperson, som har har rettigheter i Altinn på denne virksomheten til å gi rettigheter til andre testpersoner. Det finnes [en del testpersoner](https://github.com/navikt/pam-doc/blob/master/pam-doc/docs/Testdata%20-%20personer.md) som er opprettet i PAM, relatert til produktet "arbeidsplassen.no", eid av [team Arbeidsmarked](https://teamkatalog.intern.nav.no/team/7a908a7b-a245-4150-92dc-15c5c8424cb5).
For eksempel: For virksomheten "ORDKNAPP BLOMSTRETE TIGER AS org. nr. 311 185 268" kan du bruke personen "Usikker Jaktterreng" med fnr. 16823449716. 

#### Slik oppretter du din egen testperson:
1. Du oppretter din egen testperson i [Dolly](https://dolly.ekstern.dev.nav.no/).
2. Bruk Altinn sitt testmiljø https://info.tt02.altinn.no.
3. Logg inn: Velge "Logg inn". Velg "TestID". I feltet "Personidentififikator (syntetisk)", skriv inn fnr. til den testpersonen som har rettigheter til å gi rettigheter. Klikk på knappen "Autentiser". Du skal nå kome inn i Altinn.
6. Inne i Altinn, i siden med arkfanetittel "Dine aktører" og et søkefelt med tittel "Velg aktør": Klikk på din virksomhet. Gå til virksomhetens profilside/innstillinger (er samme side) ved å enten velge arkfanen "profil" eller klikke på navn øverst til høyre på siden og velge "Innstillinger".
7. Velg "Andre med rettigheter til virksomheten" > "Legge til ny person eller virksomhet". Skriv inn fnr og etternavn på din nyopprettede testperson.
8. I "Andre med rettigheter til virksomheten", finn din testperson i listen og velg "Gi eller fjern tilgang" > "Gi tilgang til enkelttjenester". Søk med å skrive inn ID-nummeret `5078` (fordi dette nummeret er hardkodet i [rekrutteringsbistans-kandidat-api](https://github.com/navikt/presenterte-kandidater-api/blob/main/src/main/kotlin/no/nav/arbeidsgiver/toi/presentertekandidater/altinn/AltinnKlient.kt#L26)). Enkelttjenesten heter "Rekruttering", men vær obs på at det er flere enkelttjenester med dette navnet, så derfor søk med ID-nummeret.

#### Slik ser du arbeidsigivers kandidatliste:
1. Gå inn på ingressen https://presenterte-kandidater.intern.dev.nav.no/kandidatliste
2. Logg inn med TestID, fnr til din testperson.



# Henvendelser

## For Nav-ansatte

* Dette Git-repositoriet eies
  av [team Toi i produktområde Arbeidsgiver](https://teamkatalog.nav.no/team/76f378c5-eb35-42db-9f4d-0e8197be0131).
* Slack-kanaler:
    * [#arbeidsgiver-toi-dev](https://nav-it.slack.com/archives/C02HTU8DBSR)
    * [#rekrutteringsbistand-værsågod](https://nav-it.slack.com/archives/C02HWV01P54)

## For folk utenfor Nav

IT-avdelingen i [Arbeids- og velferdsdirektoratet](https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/arbeids-og-velferdsdirektoratet-kontorinformasjon)

