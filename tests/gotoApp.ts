import { ventTilKlar } from './ventTilKlar';
import { Page } from '@playwright/test';

const PORT = process.env.PLAYWRIGHT_PORT || '1337';

export async function gotoApp(page: Page, path: string = '/') {
  await page.goto(`http://localhost:${PORT}${path}`, {
    waitUntil: 'domcontentloaded',
  });
  await ventTilKlar(page);
}
