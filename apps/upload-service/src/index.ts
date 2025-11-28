import { createApp } from './app';

const PORT = process.env.PORT || 3002; // Default to 3002 for Upload service

function start() {
  try {
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Upload Service is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

function shutdown() {
  console.log('\nGracefully shutting down...');
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown();
});
process.on('SIGTERM', () => {
  void shutdown();
});

void start();
