import { STILLING_ID_UTEN_TILGANG } from '../mocks/handlers';
import { gotoApp } from './gotoApp';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';

test.describe('Feilhåndtering', () => {
  test('403 fra backend gir tilgangsfeil, ikke valideringsfeil', async ({
    page,
  }) => {
    const responsFraProxy = page.waitForResponse((respons) =>
      respons.url().includes(`/kandidatliste/${STILLING_ID_UTEN_TILGANG}`),
    );

    await gotoApp(
      page,
      `/${STILLING_ID_UTEN_TILGANG}?virksomhet=${VIRKSOMHET}`,
    );

    expect((await responsFraProxy).status()).toBe(403);
    await expect(
      page.getByText('Du har ikke rett tilgang i Altinn (Statuskode 403)'),
    ).toBeVisible();
    await expect(page.getByText('ZodError')).toHaveCount(0);
  });
});
