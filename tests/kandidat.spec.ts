import { gotoApp } from './gotoApp';
import { snapshotTest } from './snapshotTest';
import {
  sjekkDialog,
  sjekkPekerfølsomtInnhold,
  sjekkTilgjengelighet,
  tilgjengelighetstest,
} from '@navikt/toi-next-frontend/a11y';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';
const STILLING_ID = '720696c9-0077-464f-b0dc-c12b95db32d4';
const KANDIDAT_ID = '23d45ba2-ce9e-446e-9137-5ebb44bf6490';

test.describe('Kandidatvisning', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(
      page,
      `/${STILLING_ID}/kandidat/${KANDIDAT_ID}?virksomhet=${VIRKSOMHET}`,
    );
    await expect(
      page.getByRole('heading', { name: 'CV-en til Joare Mossby' }),
    ).toBeVisible();
  });

  test('viser kandidat-CV', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'CV-en til Joare Mossby' }),
    ).toBeVisible();
  });

  test('vurderingsvalgene er en navngitt gruppe', async ({ page }) => {
    await expect(
      page.getByRole('radiogroup', {
        name: /^Vurdering av kandidat til stilling/,
      }),
    ).toBeVisible();
  });

  test('hovedinnholdet er målet for «Hopp til hovedinnhold»', async ({
    page,
  }) => {
    await expect(page.locator('main#maincontent')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  });

  snapshotTest(test);
  test(
    'slettemodalen er tilgjengelig (2.1.2, 2.4.3, 4.1.2)',
    { tag: '@a11y' },
    async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Kjøres bare i Chromium');
      await sjekkDialog(
        page,
        page.getByRole('button', { name: 'Slett kandidat' }),
      );
    },
  );

  test(
    'hjelpeteksten på e-postadressen er tilgjengelig (1.4.13)',
    { tag: '@a11y' },
    async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Kjøres bare i Chromium');
      await page
        .getByRole('button', { name: 'Vis kontaktinformasjon' })
        .click();
      const epostlenke = page.getByRole('link', {
        name: 'kristoffer@kandidat.no',
      });
      await expect(epostlenke).toHaveAccessibleDescription(
        'Skriv en e-post til kandidaten',
      );
      await sjekkPekerfølsomtInnhold(page, epostlenke);
    },
  );

  test(
    'åpen kontaktinformasjon er tilgjengelig',
    { tag: '@a11y' },
    async ({ page }, testInfo) => {
      await page
        .getByRole('button', { name: 'Vis kontaktinformasjon' })
        .click();
      await expect(
        page.getByRole('link', { name: 'kristoffer@kandidat.no' }),
      ).toBeVisible();
      await sjekkTilgjengelighet(page, {}, testInfo);
    },
  );

  tilgjengelighetstest(test, { utvidet: true, reflow: true });
});
