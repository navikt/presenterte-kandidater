# Guide til tilgjengelighetserklæringen

Presenterte kandidater skal oppfylle alle A- og AA-krav i WCAG 2.1. Denne guiden viser hvordan du tester hvert kriterium i tilgjengelighetserklæringen for appen på [a11y-statement.nav.no](https://a11y-statement.nav.no), og hva Playwright-testene allerede sjekker automatisk.

Presenterte kandidater er for arbeidsgivere som er logget inn på nav.no. De ser kandidatlistene sine, åpner kandidater, vurderer dem og kan slette dem fra listen. Første gang må de godta vilkårene på `/samtykke`.

## Slik svarer du i erklæringen

| Svar         | Når                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------- |
| Ja           | Både de automatiske testene og en manuell test viser at kravet er oppfylt på alle sider.     |
| Nei          | Du har funnet minst ett brudd. Beskriv avviket og planen for å rette det.                    |
| Ikke testet  | Kriteriet er ikke testet manuelt ennå. Grønne automatiske tester alene er ikke nok til «Ja». |
| Ikke aktuelt | Appen har ikke innholdet kriteriet gjelder, for eksempel video.                              |

De automatiske testene finner mange brudd, men de kan ikke bekrefte at et krav er oppfylt. axe kan for eksempel se at et bilde har alternativtekst, men ikke om teksten beskriver bildet.

## Hva testes automatisk

Tre spec-filer bruker `tilgjengelighetstest(test, { utvidet: true, reflow: true })` fra `@navikt/toi-next-frontend/a11y`:

| Spec                           | Side                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| `tests/kandidatlister.spec.ts` | Oversikten over kandidatlister (`/?virksomhet=…`)                 |
| `tests/kandidatliste.spec.ts`  | Kandidatlisten for én stilling (`/<stillingsId>?virksomhet=…`)    |
| `tests/kandidat.spec.ts`       | Én kandidat (`/<stillingsId>/kandidat/<kandidatId>?virksomhet=…`) |

Testene kjører i `chromium-desktop` og `chromium-mobile` og stopper deploy hvis de feiler.

Dette er merket med `data-axe-ignore` og blir ikke sjekket:

- Dekoratøren i `app/layout.tsx`
- Virksomhetsvelgeren i `app/components/Header.tsx`. Den kommer fra `@navikt/virksomhetsvelger`, som et annet team eier. Den har kjente funn på 2.5.3 og 1.4.4.

Notifikasjonswidgeten i headeren blir sjekket.

### axe og reflow

Testen «Tilgjengelighet (WCAG 2.1 A/AA)» kjører axe med taggene `wcag2a`, `wcag2aa`, `wcag21a` og `wcag21aa`. Tabellen under viser hvilke axe-regler som hører til hvert kriterium.

Den samme testen sjekker reflow (1.4.10): vinduet settes til 320 × 256 px, og testen feiler hvis siden ruller horisontalt.

### Utvidede sjekker

Testen «Tilgjengelighet – utvidede sjekker» kjører i nettleseren på de samme sidene:

| Sjekk                 | Kriterier                  | Slik virker den                                                                                                                              |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Tekstforstørrelse     | 1.4.4                      | Dobler rot-skriftstørrelsen og feiler hvis tekst blir kuttet av.                                                                             |
| Tekstavstand          | 1.4.12                     | Legger på WCAG-tekstavstanden og feiler hvis tekst blir kuttet av.                                                                           |
| Visningsretning       | 1.3.4                      | Laster siden i stående og liggende format og sjekker at innholdet vises i begge.                                                             |
| Tastatur              | 2.1.1, 2.1.2, 2.4.7, 3.2.1 | Tabber gjennom hele siden. Feiler hvis klikkbare elementer ikke kan nås, fokus står fast, fokus ikke vises eller fokus alene åpner noe nytt. |
| Hopp til hovedinnhold | 2.4.1                      | Tabber til første lenke og sjekker at den peker til et mål som finnes, og at neste Tab etter Enter går til hovedinnholdet eller videre.      |

Hver kjøring legger ved `fokusrekkefølge.txt` i rapporten. Den er nyttig når du sjekker 2.4.3.

### Sidetitler

`tests/sidetitler.spec.ts` sjekker med `toHaveTitle` at hver side har sin egen tittel (2.4.2), og at tittelen oppdateres når du navigerer i appen. Titlene settes med `sidetittel()` fra `app/util/sidetittel.ts`:

| Side                           | Tittel                                 |
| ------------------------------ | -------------------------------------- |
| Oversikten over kandidatlister | Kandidatlister – Foreslåtte kandidater |
| Kandidatlisten for én stilling | Kandidatliste – Foreslåtte kandidater  |
| Én kandidat                    | Kandidat – Foreslåtte kandidater       |
| Samtykkesiden                  | Vilkår – Foreslåtte kandidater         |

Mangler samtykke, viser appen samtykkeskjemaet på URL-en brukeren åpnet. Da settes tittelen til «Vilkår – Foreslåtte kandidater» mens skjemaet vises, og testen sjekker at siden får riktig tittel etter samtykke.

Titlene sendes til Umami med hver sidevisning, så de skal aldri inneholde navn på personer.

### Sjekker for interaksjoner

Disse testene utfører en handling på siden og sjekker resultatet. De er tagget `@a11y` og kjøres sammen med de andre tilgjengelighetstestene.

| Test                                                                                      | Kriterier                  | Hva sjekkes                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sjekkDialog` på slettemodalen (`tests/kandidat.spec.ts`)                                 | 2.1.1, 2.1.2, 2.4.3, 4.1.2 | Åpner dialogen med Enter og sjekker at den har navn, og at fokus flyttes inn og blir i dialogen. Kjører axe på dialogen, lukker med Esc og sjekker at fokus går tilbake til knappen.                                              |
| `sjekkSkjemafeil` på samtykkeskjemaet (`tests/samtykke.spec.ts`)                          | 3.3.1                      | Sender inn skjemaet med feil og sjekker at feltene er markert med `aria-invalid`, at feilmeldingen er koblet til feltet, og at lenkene i feiloppsummeringen virker.                                                               |
| `sjekkPekerfølsomtInnhold` på hjelpeteksten til e-postadressen (`tests/kandidat.spec.ts`) | 1.4.13, 2.5.3              | Åpner kontaktinformasjonen og sjekker at lenken har e-postadressen som navn og hjelpeteksten som beskrivelse. Viser hjelpeteksten med hover og fokus, flytter pekeren over den, og sjekker at den blir værende og lukkes med Esc. |
| `sjekkTilgjengelighet` på åpen kontaktinformasjon (`tests/kandidat.spec.ts`)              | Som axe over               | Åpner «Vis kontaktinformasjon» og kjører axe på siden.                                                                                                                                                                            |

### Dette testes ikke automatisk

- Dekoratøren og virksomhetsvelgeren
- Samtykkesiden utover feil ved innsending
- Andre tilstander som åpnes etter at siden er lastet, utover slettemodalen, kontaktinformasjonen og hjelpeteksten på e-postadressen
- Feilmeldinger, for eksempel når en vurdering ikke blir lagret
- Om tekster, alternativtekster og overskrifter gir mening

### Kjør testene lokalt

```sh
pnpm run test:a11y                                                     # alle tilgjengelighetstester
pnpm exec playwright test --grep @a11y-utvidet --project='chromium*'   # bare utvidede sjekker
```

Kjører du `pnpm dev` samtidig, setter du `PLAYWRIGHT_PORT` til en ledig port.

### Legg til test for en ny side

Legg til `tilgjengelighetstest` i `describe`-blokken der `beforeEach` åpner siden:

```ts
import { tilgjengelighetstest } from '@navikt/toi-next-frontend/a11y';

test.describe('Ny side', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page, `/ny-side?virksomhet=${VIRKSOMHET}`);
  });

  tilgjengelighetstest(test, { utvidet: true, reflow: true });
});
```

Test dialoger, skjemaer og hjelpetekster med `sjekkDialog`, `sjekkSkjemafeil` og `sjekkPekerfølsomtInnhold`. Bruk `sjekkTilgjengelighet` for andre tilstander som åpnes etter at siden er lastet. Legg testen i samme `describe`-blokk, så `beforeEach` åpner siden. Taggen `@a11y` gjør at `pnpm run test:a11y` tar den med:

```ts
import { sjekkDialog } from '@navikt/toi-next-frontend/a11y';

test('slettemodalen er tilgjengelig', { tag: '@a11y' }, async ({ page }) => {
  await sjekkDialog(page, page.getByRole('button', { name: 'Slett kandidat' }));
});
```

## Verktøy for manuell testing

- **Tastatur**: Tab, Shift+Tab, Enter, mellomrom, piltaster og Esc
- **VoiceOver** på Mac: slå på og av med Cmd+F5. VO+U åpner rotoren med lister over overskrifter, lenker og skjemafelt.
- **Zoom**: Cmd+plus til 200 % og 400 %. Endre også standard skriftstørrelse i nettleseren (Chrome: Innstillinger → Utseende → Skriftstørrelse).
- **Chrome DevTools**: fargevelgeren viser kontrastforholdet. Under Rendering kan du simulere fargeblindhet.
- **Bokmerket for tekstavstand**: [Text spacing bookmarklet](https://www.html5accessibility.com/tests/tsbookmarklet.html)
- **Testguider**: [Universell utforming på Aksel](https://aksel.nav.no/god-praksis/universell-utforming) og [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

Test hele flyten som arbeidsgiver i dev:

1. Logg inn og godta vilkårene på samtykkesiden.
2. Bytt virksomhet i virksomhetsvelgeren.
3. Åpne en kandidatliste og en kandidat.
4. Endre vurderingen av kandidaten.
5. Slett en kandidat fra listen.

## Kriteriene

### 1 Mulig å oppfatte

| Kriterium                                 | Testes automatisk                                                                                                                              | Slik tester du manuelt                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Ikke-tekstlig innhold               | axe: `image-alt`, `svg-img-alt`, `role-img-alt`, `input-image-alt`, `object-alt`                                                               | Gå gjennom sidene med VoiceOver. Ikoner som betyr noe, for eksempel ikonene for vurdering, skal ha en tekst som beskriver dem. Pynteikoner skal ha `aria-hidden`.                                                                                                                                                                            |
| 1.2.1 Bare lyd og bare video              | Ingen                                                                                                                                          | Ikke aktuelt så lenge appen ikke har lyd eller video.                                                                                                                                                                                                                                                                                        |
| 1.2.2 Teksting                            | axe: `video-caption`                                                                                                                           | Ikke aktuelt så lenge appen ikke har video.                                                                                                                                                                                                                                                                                                  |
| 1.2.3 Synstolking eller mediealternativ   | Ingen                                                                                                                                          | Ikke aktuelt så lenge appen ikke har video.                                                                                                                                                                                                                                                                                                  |
| 1.2.5 Synstolking                         | Ingen                                                                                                                                          | Ikke aktuelt så lenge appen ikke har video.                                                                                                                                                                                                                                                                                                  |
| 1.3.1 Informasjon og relasjoner           | axe: `list`, `listitem`, `dlitem`, `definition-list`, `th-has-data-cells`, `td-headers-attr`, `aria-required-children`, `aria-required-parent` | Åpne overskriftslisten i VoiceOver-rotoren. Nivåene skal speile strukturen, også i CV-en. Vurderingsvalgene er en `ToggleGroup` på desktop og en `RadioGroup` på mobil. Sjekk i begge visningene at VoiceOver leser navnet på gruppen og hvilket valg som er valgt. Kandidatene skal ligge i en ekte liste.                                  |
| 1.3.2 Meningsbærende rekkefølge           | Ingen                                                                                                                                          | La VoiceOver lese hele siden (VO+A). Rekkefølgen skal gi mening også på mobil.                                                                                                                                                                                                                                                               |
| 1.3.3 Sensoriske egenskaper               | Ingen                                                                                                                                          | Instruksjoner skal ikke bare vise til form, farge, plassering eller lyd.                                                                                                                                                                                                                                                                     |
| 1.3.4 Visningsretning                     | Utvidet sjekk: visningsretning                                                                                                                 | Åpne appen på mobil og bytt mellom stående og liggende format.                                                                                                                                                                                                                                                                               |
| 1.3.5 Identifiser formål med inndata      | axe: `autocomplete-valid`                                                                                                                      | Ikke aktuelt: skjemaene spør ikke om opplysninger om arbeidsgiveren selv.                                                                                                                                                                                                                                                                    |
| 1.4.1 Bruk av farge                       | axe: `link-in-text-block`                                                                                                                      | Vurderingen av en kandidat skal også vises med tekst eller ikon, ikke bare farge. Se på sidene i gråtoner (DevTools → Rendering → Emulate vision deficiencies → Achromatopsia).                                                                                                                                                              |
| 1.4.2 Styring av lyd                      | axe: `no-autoplay-audio`                                                                                                                       | Ikke aktuelt så lenge appen ikke spiller lyd.                                                                                                                                                                                                                                                                                                |
| 1.4.3 Kontrast (minimum)                  | axe: `color-contrast`                                                                                                                          | Sjekk hover, fokus og valgt vurdering med fargevelgeren i DevTools. Krav: 4,5:1 for vanlig tekst og 3:1 for stor tekst.                                                                                                                                                                                                                      |
| 1.4.4 Endring av tekststørrelse           | Utvidet sjekk: tekstforstørrelse, axe: `meta-viewport`                                                                                         | Zoom til 200 % og sett standard skriftstørrelse i nettleseren til «Svært stor». Ingen tekst eller funksjon skal forsvinne eller overlappe. Test også samtykkesiden og slettemodalen.                                                                                                                                                         |
| 1.4.5 Bilder av tekst                     | Ingen                                                                                                                                          | Tekst skal ikke vises som bilde. Logoer er unntatt.                                                                                                                                                                                                                                                                                          |
| 1.4.10 Dynamisk tilpasning (reflow)       | Reflow i hovedtesten                                                                                                                           | Sett vinduet til 1280 px og zoom til 400 %. Sidene skal ikke rulle horisontalt. Test samtykkesiden og slettemodalen.                                                                                                                                                                                                                         |
| 1.4.11 Kontrast for ikke-tekstlig innhold | Ingen                                                                                                                                          | Kanter på knapper og avkrysningsbokser, ikoner som betyr noe og fokusmarkering skal ha 3:1 mot bakgrunnen.                                                                                                                                                                                                                                   |
| 1.4.12 Tekstavstand                       | Utvidet sjekk: tekstavstand, axe: `avoid-inline-spacing`                                                                                       | Bruk bokmerket for tekstavstand på en lang CV, samtykkesiden og slettemodalen. Ingen tekst skal bli kuttet av.                                                                                                                                                                                                                               |
| 1.4.13 Pekerfølsomt innhold               | `sjekkPekerfølsomtInnhold` på hjelpeteksten til e-postadressen                                                                                 | Flytt musen fra utløseren og over på hjelpeteksten, for eksempel hjelpeteksten på e-postadressen til kandidaten. Innholdet skal bli værende til du flytter musen eller fokus bort, eller lukker det. Dekker innholdet annet innhold, skal det kunne lukkes med Esc uten å flytte musen eller fokus. Feilmeldinger fra validering er unntatt. |

### 2 Mulig å betjene

| Kriterium                                 | Testes automatisk                                                                                                              | Slik tester du manuelt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1.1 Tastatur                            | Utvidet sjekk: tastatur, axe: `scrollable-region-focusable`, `frame-focusable-content`                                         | Gjennomfør hele flyten med bare tastatur, også virksomhetsvelgeren og notifikasjonene.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.1.2 Ingen tastaturfelle                 | Utvidet sjekk: tastatur, `sjekkDialog` på slettemodalen                                                                        | Åpne slettemodalen, virksomhetsvelgeren og notifikasjonene. Du skal komme ut igjen med Tab eller Esc.                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2.1.4 Hurtigtaster som består av ett tegn | Ingen                                                                                                                          | Ikke aktuelt så lenge appen ikke har hurtigtaster.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 2.2.1 Justerbar hastighet                 | axe: `meta-refresh`                                                                                                            | Finn ut hvor lenge innloggingen varer. Er grensen kortere enn 20 timer, skal brukeren få varsel minst 20 sekunder før den går ut og kunne forlenge den med en enkel handling. Dekoratøren har et slikt varsel. Sjekk at det vises, leses av VoiceOver og kan brukes med tastatur.                                                                                                                                                                                                                        |
| 2.2.2 Pause, stopp, skjul                 | axe: `blink`, `marquee`                                                                                                        | Innhold som beveger seg, blinker eller ruller, starter automatisk, varer mer enn 5 sekunder og vises sammen med annet innhold, skal kunne pauses, stoppes eller skjules. Innhold som oppdateres automatisk og vises sammen med annet innhold, skal kunne pauses, stoppes, skjules eller få justert hvor ofte det oppdateres, uansett hvor lenge det varer. Unntaket gjelder bare når bevegelsen eller oppdateringen er nødvendig, for eksempel en lasteindikator mens brukeren ikke kan gjøre noe annet. |
| 2.3.1 Terskelverdi på maksimalt tre glimt | Ingen                                                                                                                          | Ikke aktuelt så lenge ingenting blinker.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2.4.1 Hoppe over blokker                  | axe: `bypass`, utvidet sjekk: hopp til hovedinnhold                                                                            | Trykk Tab på en ny side. Dekoratørens «Hopp til hovedinnhold» skal flytte fokus til hovedinnholdet. Lenken peker til `#maincontent`, så `<main>` i `app/layout.tsx` må ha `id='maincontent'`.                                                                                                                                                                                                                                                                                                            |
| 2.4.2 Sidetitler                          | axe: `document-title`, `tests/sidetitler.spec.ts`                                                                              | Tittelen i fanen skal beskrive siden. Sjekk at den gir mening også når siden viser en feilmelding. Nye sider får tittel med `sidetittel()` i `metadata` eller `generateMetadata`. Kandidatnavn skal ikke stå i tittelen.                                                                                                                                                                                                                                                                                 |
| 2.4.3 Fokusrekkefølge                     | Delvis: `sjekkDialog` på slettemodalen og vedlegget `fokusrekkefølge.txt`                                                      | Tab gjennom sidene. Rekkefølgen skal følge det visuelle. Når slettemodalen åpnes, skal fokus flyttes inn i den. Når den lukkes, skal fokus gå tilbake til knappen som åpnet den, eller til listen etter sletting.                                                                                                                                                                                                                                                                                        |
| 2.4.4 Formål med lenke (i kontekst)       | axe: `link-name`                                                                                                               | Åpne lenkelisten i VoiceOver-rotoren. Hver lenke, sammen med listepunktet den står i, skal forklare hvor den går.                                                                                                                                                                                                                                                                                                                                                                                        |
| 2.4.5 Flere måter                         | Ingen                                                                                                                          | Sidene skal kunne nås på minst to måter, for eksempel fra oversikten, brødsmulestien og «Min side – arbeidsgiver». Samtykkesiden er et steg i en prosess og er unntatt.                                                                                                                                                                                                                                                                                                                                  |
| 2.4.6 Overskrifter og ledetekster         | Ingen                                                                                                                          | Les overskriftene og ledetekstene for seg. De skal beskrive innholdet og valgene uten resten av siden.                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.4.7 Synlig fokus                        | Utvidet sjekk: tastatur                                                                                                        | Tab gjennom sidene og slettemodalen. Fokusmarkeringen skal være tydelig.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2.5.1 Pekerbevegelser                     | Ingen                                                                                                                          | Ikke aktuelt så lenge ingenting krever bevegelser med flere fingre, som å knipe, eller bevegelser som må følge en bestemt bane, som å sveipe i et mønster. Vanlig dra og slipp hører ikke til dette kriteriet.                                                                                                                                                                                                                                                                                           |
| 2.5.2 Pekeravbrytelse                     | Ingen                                                                                                                          | Handlinger skal utløses når du slipper museknappen, ikke når du trykker den ned.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2.5.3 Ledetekst i navn                    | Navnet på e-postlenken i `tests/kandidat.spec.ts`. axe-regelen `label-content-name-mismatch` er eksperimentell og kjøres ikke. | Når en kontroll har `aria-label`, skal den inneholde den synlige teksten, helst først. Med Talekontroll på Mac skal du kunne si «Klikk» og den synlige teksten. Virksomhetsvelgeren har et kjent funn her. Aksel `Tooltip` setter `aria-label` på elementet den ligger rundt. Har elementet synlig tekst, bruker du `describesChild`, så blir hjelpeteksten en beskrivelse i stedet.                                                                                                                     |
| 2.5.4 Bevegelsesaktivering                | Ingen                                                                                                                          | Ikke aktuelt så lenge appen ikke bruker bevegelsessensorer.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### 3 Forståelig

| Kriterium                                                             | Testes automatisk                                              | Slik tester du manuelt                                                                                                                                                                           |
| --------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1.1 Språk på siden                                                  | axe: `html-has-lang`, `html-lang-valid`                        | `<html lang='nb'>` er satt i `app/layout.tsx`.                                                                                                                                                   |
| 3.1.2 Språk på deler av innholdet                                     | axe: `valid-lang` sjekker bare at `lang`-verdiene er gyldige   | CV-er kan inneholde tekst på engelsk eller andre språk. Sjekk at lengre tekster på andre språk har `lang`. Navn og faguttrykk er unntatt.                                                        |
| 3.2.1 Fokus                                                           | Utvidet sjekk: tastatur                                        | Fokus alene skal ikke åpne nye sider, vinduer eller dialoger.                                                                                                                                    |
| 3.2.2 Inndata                                                         | Ingen                                                          | Å velge vurdering lagrer valget. Det er greit så lenge brukeren ikke sendes til en ny side og forstår at valget lagres. Bytte av virksomhet laster en ny oversikt, og det må komme tydelig fram. |
| 3.2.3 Konsekvent navigering                                           | Ingen                                                          | Dekoratøren og brødsmulestien skal stå på samme sted og i samme rekkefølge på alle sider.                                                                                                        |
| 3.2.4 Konsekvent identifikasjon                                       | Ingen                                                          | Samme funksjon skal ha samme navn og ikon overalt, for eksempel vurderingene.                                                                                                                    |
| 3.3.1 Identifikasjon av feil                                          | `sjekkSkjemafeil` på samtykkeskjemaet                          | Prøv å sende samtykkeskjemaet uten å huke av. Feilen skal beskrives med tekst. Sjekk også feilmeldingen når en vurdering ikke blir lagret.                                                       |
| 3.3.2 Ledetekster eller instruksjoner                                 | axe: `form-field-multiple-labels`, se også `label` under 4.1.2 | Vurderingsvalgene og avkrysningsboksen for vilkårene skal ha ledetekster som forklarer hva brukeren velger.                                                                                      |
| 3.3.3 Forslag ved feil                                                | Ingen                                                          | Feilmeldingen skal si hva brukeren kan gjøre, for eksempel prøve igjen.                                                                                                                          |
| 3.3.4 Forhindring av feil (juridiske feil, økonomiske feil, datafeil) | Ingen                                                          | Å godta vilkårene er en juridisk forpliktelse, og sletting fjerner data. Begge må bekreftes eller kunne angres. Slettemodalen skal be om bekreftelse.                                            |

### 4 Robust

| Kriterium                | Testes automatisk                                                                                                                                                                                                                              | Slik tester du manuelt                                                                                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1.1 Parsing            | Ingen                                                                                                                                                                                                                                          | W3C regner kriteriet som alltid oppfylt for HTML, og det er fjernet i WCAG 2.2. Svar «Ja».                                                                                                              |
| 4.1.2 Navn, rolle, verdi | axe: `button-name`, `link-name`, `label`, `select-name`, `nested-interactive`, `aria-allowed-attr`, `aria-hidden-focus`, `aria-input-field-name`, `aria-valid-attr-value` og flere `aria-*`-regler, `sjekkDialog` sjekker at dialogen har navn | Gå gjennom kontrollene med VoiceOver. Hver kontroll skal leses med navn, rolle og tilstand, for eksempel hvilken vurdering som er valgt.                                                                |
| 4.1.3 Statusbeskjeder    | Ingen                                                                                                                                                                                                                                          | Når vurderingen er lagret, en kandidat er slettet eller lagringen feiler, skal VoiceOver lese opp beskjeden uten at fokus flyttes. Beskjeden trenger `role='status'`, `role='alert'` eller `aria-live`. |
