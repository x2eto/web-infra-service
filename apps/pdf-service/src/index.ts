import { createApp } from './app';
import { closeBrowser, initBrowser } from './browser';

const PORT = process.env.PORT || 3001; // Default to 3001 for PDF service

async function start() {
  try {
    await initBrowser();
    const app = await createApp();
    app.listen(PORT, () => {
      console.log(`PDF Service is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to launch browser or start server:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('\nGracefully shutting down...');
  await closeBrowser();
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown();
});
process.on('SIGTERM', () => {
  void shutdown();
});

void start();
