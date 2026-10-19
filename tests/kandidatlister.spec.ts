import { gotoApp } from './gotoApp';
import { snapshotTest } from './snapshotTest';
import { tilgjengelighetstest } from '@navikt/toi-next-frontend/a11y';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';

test.describe('Kandidatlister', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page, `/?virksomhet=${VIRKSOMHET}`);
    await expect(page.getByText('Aktive rekrutteringsprosesser')).toBeVisible();
  });

  test('viser kandidatlister', async ({ page }) => {
    await expect(page.getByText('Vilkår for tjenesten')).toBeVisible();
  });

  test('mobilvisning viser innhold uten horisontal scrolling', async ({
    page,
    isMobile,
    viewport,
  }) => {
    test.skip(!isMobile, 'Gjelder mobilvisning');
    if (!viewport) {
      throw new Error('Mobiltesten krever en konfigurert skjermstørrelse');
    }
    await expect(page.getByText('Vilkår for tjenesten')).toBeVisible();
    const innholdsbredde = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(innholdsbredde).toBeLessThanOrEqual(viewport.width);
  });

  snapshotTest(test);
  tilgjengelighetstest(test, { reflow: true });
});
