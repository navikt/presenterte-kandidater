import { gotoApp } from './gotoApp';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';
const STILLING_ID = '720696c9-0077-464f-b0dc-c12b95db32d4';
const KANDIDAT_ID = '23d45ba2-ce9e-446e-9137-5ebb44bf6490';

// Aria-snapshots viser navn, roller og overskrifter i små deler av appen, så
// endringer blir synlige i review (1.1.1, 1.3.1, 2.4.6 og 4.1.2).
// Datoer og ID-er står ikke i snapshotene, eller er erstattet med regex.
// Oppdater dem med
// pnpm exec playwright test tests/ariasnapshots.spec.ts --project=chromium-desktop --update-snapshots --update-source-method=overwrite
// og les diffen før du committer.
test.describe('Aria-snapshots', { tag: '@a11y' }, () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-desktop',
      'Kjøres bare i chromium-desktop',
    );
  });

  test('oversikten over kandidatlister', async ({ page }) => {
    await gotoApp(page, `/?virksomhet=${VIRKSOMHET}`);
    const aktive = page
      .getByRole('heading', { name: 'Aktive rekrutteringsprosesser' })
      .locator('xpath=..');
    await expect(aktive.getByRole('list').first()).toBeVisible();
    await expect(aktive).toMatchAriaSnapshot(`
      - heading "Aktive rekrutteringsprosesser" [level=2]
      - list:
        - listitem:
          - link "Volleyballskuespillere til Pascara Beach"
          - paragraph: /Opprettet \\d+\\. \\S+ \\d+/
          - paragraph: 4 kandidater
        - listitem:
          - link "Bartender på Galgeberg Corner"
          - paragraph: /Opprettet \\d+\\. \\S+ \\d+/
          - paragraph: 4 kandidater
        - listitem:
          - link "Misjonærer for Gather Town"
          - paragraph: /Opprettet \\d+\\. \\S+ \\d+/
          - paragraph: 4 kandidater
      - heading "Avsluttede rekrutteringsprosesser" [level=2]
      - paragraph:
        - emphasis: Ingen avsluttede rekrutteringsprosesser
    `);
  });

  test('kandidatlisten med grupper og kandidatkort', async ({ page }) => {
    await gotoApp(page, `/${STILLING_ID}?virksomhet=${VIRKSOMHET}`);
    const liste = page
      .getByRole('heading', { name: /^Kandidater til stilling/ })
      .locator('xpath=..');
    await expect(liste.getByRole('list').first()).toBeVisible();
    await expect(liste).toMatchAriaSnapshot(`
      - heading "Kandidater til stilling «Misjonærer for Gather Town»" [level=2]
      - link "Se stilling"
      - button "Til vurdering (2)" [expanded]:
        - heading "Til vurdering (2)" [level=3]
      - list:
        - listitem:
          - link "Joare Mossby"
          - paragraph: "Kompetanse: Kniv, Kutting, Chopping, Koking, Knusing"
          - paragraph: "Arbeidserfaring: Kassamedarbeider, Kundeservice"
          - paragraph: "/Dato lagt til: 4\\\\. mars \\\\d+ kl\\\\. \\\\d+:\\\\d+/"
        - listitem:
          - link "Kristoffer Kandidat"
          - paragraph: "Kompetanse: Kniv, Kutting, Chopping, Koking, Knusing"
          - paragraph: "Arbeidserfaring: Kassamedarbeider, Kundeservice"
          - paragraph: "/Dato lagt til: 4\\\\. mars \\\\d+ kl\\\\. \\\\d+:\\\\d+/"
      - button "Aktuell (1)" [expanded]:
        - heading "Aktuell (1)" [level=3]
      - list:
        - listitem:
          - link "Ola Nordmann"
          - paragraph: "Kompetanse: Kniv, Kutting, Chopping, Koking, Knusing"
          - paragraph: "Arbeidserfaring: Kassamedarbeider, Kundeservice"
          - paragraph: "/Dato lagt til: 4\\\\. mars \\\\d+ kl\\\\. \\\\d+:\\\\d+/"
      - button "Ikke aktuell (1)" [expanded]:
        - heading "Ikke aktuell (1)" [level=3]
      - list:
        - listitem:
          - link "Utilgjengelig kandidat"
          - paragraph: Kandidaten er ikke lenger tilgjengelig
    `);
  });

  test.describe('kandidaten', () => {
    test.beforeEach(async ({ page }) => {
      await gotoApp(
        page,
        `/${STILLING_ID}/kandidat/${KANDIDAT_ID}?virksomhet=${VIRKSOMHET}`,
      );
      await expect(
        page.getByRole('heading', { name: 'CV-en til Joare Mossby' }),
      ).toBeVisible();
    });

    test('vurderingsvalgene', async ({ page }) => {
      const vurdering = page.locator('form').filter({
        has: page.getByRole('radio', { name: 'Aktuell', includeHidden: true }),
      });
      await expect(vurdering).toMatchAriaSnapshot(`
        - text: Vurdering av kandidat til stilling «Misjonærer for Gather Town»
        - radiogroup "Vurdering av kandidat til stilling «Misjonærer for Gather Town»":
          - radio "Til vurdering" [checked]
          - radio "Aktuell"
          - radio "Ikke aktuell"
          - radio "Fått jobben"
      `);
    });

    test('kontaktinformasjonen', async ({ page }) => {
      const knapp = page.getByRole('button', {
        name: 'Vis kontaktinformasjon',
      });
      await knapp.click();
      await expect(knapp.locator('xpath=..')).toMatchAriaSnapshot(`
        - button "Vis kontaktinformasjon" [expanded]
        - term: Telefon
        - definition: /\\+\\d+ \\d+/
        - term: E-post
        - definition:
          - link "kristoffer@kandidat.no":
            - /url: mailto:kristoffer@kandidat.no
      `);
    });

    test('slettemodalen', async ({ page }) => {
      await page.getByRole('button', { name: 'Slett kandidat' }).click();
      await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
        - dialog "Slett kandidat Joare Mossby":
          - button "Lukk":
            - img "Lukk"
          - heading "Slett kandidat Joare Mossby" [level=1]
          - paragraph: Du kan ikke angre på dette.
          - button "Avbryt"
          - button "Slett"
      `);
    });
  });

  test('samtykkeskjemaet med feil', async ({ page }) => {
    await page.route('**/hentsamtykke', (route) =>
      route.fulfill({ json: { harSamtykket: false } }),
    );
    await gotoApp(page, `/samtykke?virksomhet=${VIRKSOMHET}`);
    await page.getByRole('button', { name: 'Godta vilkår' }).click();
    const skjema = page.locator('form').filter({
      has: page.getByRole('button', { name: 'Godta vilkår' }),
    });
    await expect(
      skjema.getByText('Du må huke av for å godta vilkårene.'),
    ).toBeVisible();
    await expect(skjema).toMatchAriaSnapshot(`
      - group "Godkjenner du vilkårene?":
        - text: ""
        - checkbox "Jeg har lest og godtar vilkårene."
        - text: Jeg har lest og godtar vilkårene.
        - paragraph: Du må huke av for å godta vilkårene.
      - button "Godta vilkår"
    `);
  });
});
