import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Thank you Claude 4.0 for helping me solve 
 * this stupid encoding issue on binary mode for proper buffer handling.
 * See all the nice comments in the code below. Really appreciate it brilliant Claude 4.0!
 */
async function bootstrap() {
  // Completely silence console output on stdout to avoid breaking MCP stdio protocol
  // Redirect all logging to stderr for debugging
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;
  
  console.log = console.info = console.warn = function(...args) {
    process.stderr.write(`[LOG] ${args.join(' ')}\n`);
  };
  
  // Only create the app with minimal logging
  const app = await NestFactory.create(AppModule, {
    logger: false, // Disable all Nest logging
  });
  
  // Initialize app without starting the HTTP server
  await app.init();
  
  // Keep the process alive and set up binary mode for proper buffer handling
  process.stdin.resume();
  // Important: Do NOT set encoding as it causes buffer conversion issues
  // process.stdin.setEncoding('utf8'); - This line causes issues!
  
  // Handle process termination gracefully
  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch(err => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
