import { chromium, type Browser } from 'playwright';

let sharedBrowser: Browser | null = null;

export async function initBrowser(): Promise<Browser> {
  if (sharedBrowser) return sharedBrowser;
  const headless = process.env.PW_HEADLESS !== 'false';
  const userArgs = (process.env.PW_ARGS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const defaultArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-ipc-flooding-protection',
    '--disable-breakpad',
    '--font-render-hinting=none',
  ];
  sharedBrowser = await chromium.launch({
    headless,
    args: [...defaultArgs, ...userArgs],
  });
  return sharedBrowser;
}

export async function getBrowser(): Promise<Browser> {
  if (!sharedBrowser) {
    sharedBrowser = await initBrowser();
  }
  return sharedBrowser;
}

export async function closeBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}
