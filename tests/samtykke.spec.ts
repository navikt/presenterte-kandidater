import { gotoApp } from './gotoApp';
import { sjekkSkjemafeil } from '@navikt/toi-next-frontend/a11y';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';

test.describe('Samtykke', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/hentsamtykke', (route) =>
      route.fulfill({ json: { harSamtykket: false } }),
    );
    await gotoApp(page, `/samtykke?virksomhet=${VIRKSOMHET}`);
    await expect(
      page.getByRole('button', { name: 'Godta vilkår' }),
    ).toBeVisible();
  });

  test('feilmeldingen er koblet til avkrysningsboksen', async ({ page }) => {
    await page.getByRole('button', { name: 'Godta vilkår' }).click();

    await expect(
      page.getByRole('group', { name: 'Godkjenner du vilkårene?' }),
    ).toHaveAttribute('aria-invalid', 'true');
    await expect(
      page.getByRole('checkbox', { name: 'Jeg har lest og godtar vilkårene.' }),
    ).toHaveAccessibleDescription(/Du må huke av for å godta vilkårene/);
  });
});

test.describe('Samtykke – tilgjengelighet', { tag: '@a11y' }, () => {
  test('feil ved innsending er koblet til feltet (3.3.1)', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'Kjøres bare i Chromium');
    await page.route('**/hentsamtykke', (route) =>
      route.fulfill({ json: { harSamtykket: false } }),
    );
    await gotoApp(page, `/samtykke?virksomhet=${VIRKSOMHET}`);
    await sjekkSkjemafeil(
      page,
      page.getByRole('button', { name: 'Godta vilkår' }),
    );
  });
});
