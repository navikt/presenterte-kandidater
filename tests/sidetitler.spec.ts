import { gotoApp } from './gotoApp';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';
const STILLING = '720696c9-0077-464f-b0dc-c12b95db32d4';
const KANDIDAT = '23d45ba2-ce9e-446e-9137-5ebb44bf6490';

// WCAG 2.4.2 Sidetitler: hver side skal ha en tittel som beskriver formålet.
// Titler sendes til Umami, så de skal aldri inneholde navn på personer.
const sider: [sti: string, tittel: string][] = [
  [`/?virksomhet=${VIRKSOMHET}`, 'Kandidatlister'],
  [`/${STILLING}?virksomhet=${VIRKSOMHET}`, 'Kandidatliste'],
  [`/${STILLING}/kandidat/${KANDIDAT}?virksomhet=${VIRKSOMHET}`, 'Kandidat'],
  [`/samtykke?virksomhet=${VIRKSOMHET}`, 'Vilkår'],
];

test.describe('Sidetitler (WCAG 2.4.2)', { tag: '@a11y' }, () => {
  test('tittelen oppdateres ved navigering i appen', async ({ page }) => {
    await gotoApp(page, `/?virksomhet=${VIRKSOMHET}`);
    await expect(page).toHaveTitle('Kandidatlister – Foreslåtte kandidater');
    await page.locator(`a[href^="/${STILLING}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/${STILLING}`));
    await expect(page).toHaveTitle('Kandidatliste – Foreslåtte kandidater');
  });

  for (const [sti, tittel] of sider) {
    test(`«${tittel}» har riktig sidetittel`, async ({ page }) => {
      await gotoApp(page, sti);
      await expect(page).toHaveTitle(`${tittel} – Foreslåtte kandidater`);
    });
  }

  for (const [sti, tittelEtterSamtykke] of [
    [`/?virksomhet=${VIRKSOMHET}`, 'Kandidatlister'],
    [
      `/${STILLING}/kandidat/${KANDIDAT}?virksomhet=${VIRKSOMHET}`,
      'Kandidatlister',
    ],
  ]) {
    test(`samtykkeskjemaet på ${sti.split('?')[0]} har tittelen «Vilkår» til brukeren har samtykket`, async ({
      page,
    }) => {
      let harSamtykket = false;
      await page.route('**/hentsamtykke', (route) =>
        route.fulfill({ json: { harSamtykket } }),
      );
      await page.route('**/samtykke', (route) => {
        if (route.request().method() !== 'POST') return route.fallback();
        harSamtykket = true;
        return route.fulfill({ json: {} });
      });

      await gotoApp(page, sti);
      await expect(
        page.getByRole('button', { name: 'Godta vilkår' }),
      ).toBeVisible();
      await expect(page).toHaveTitle('Vilkår – Foreslåtte kandidater');

      await page
        .getByRole('checkbox', { name: 'Jeg har lest og godtar vilkårene.' })
        .check();
      await page.getByRole('button', { name: 'Godta vilkår' }).click();

      await expect(
        page.getByRole('button', { name: 'Godta vilkår' }),
      ).toBeHidden();
      await expect(page).toHaveTitle(
        `${tittelEtterSamtykke} – Foreslåtte kandidater`,
      );
    });
  }
});
