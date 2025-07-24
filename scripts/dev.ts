import { startServer } from '../server/index.js';
import { spawn } from 'child_process';

let viteProcess;

async function startDev() {
  try {
    console.log('Starting development servers...');
    
    // Start the Express API server first
    console.log('Starting Express server on port 3001...');
    await startServer(3001);
    console.log('Express server started successfully');

    // Start Vite dev server
    console.log('Starting Vite dev server on port 3000...');
    viteProcess = spawn('npx', ['vite', 'dev', '--port', '3000', '--host'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    viteProcess.on('error', (error) => {
      console.error('Failed to start Vite dev server:', error);
    });

    viteProcess.on('close', (code) => {
      console.log(`Vite dev server exited with code ${code}`);
    });

    console.log('Development servers started successfully!');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend API: http://localhost:3001');

  } catch (error) {
    console.error('Failed to start development servers:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down development servers...');
  if (viteProcess) {
    viteProcess.kill();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nShutting down development servers...');
  if (viteProcess) {
    viteProcess.kill();
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  if (viteProcess) {
    viteProcess.kill();
  }
  process.exit(1);
});

startDev();
