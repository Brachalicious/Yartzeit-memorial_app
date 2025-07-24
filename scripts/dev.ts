import { startServer } from '../server/index.js';
import { spawn } from 'child_process';
import { createServer } from 'net';

let viteProcess;

// Function to check if a port is available
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find an available port starting from a given port
async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (port < startPort + 10) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// Function to kill processes on specific ports
async function killProcessOnPort(port: number) {
  try {
    if (process.platform === 'win32') {
      // Windows
      spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'ignore' });
    } else {
      // Unix-like systems
      const { spawn: spawnSync } = await import('child_process');
      spawnSync('pkill', ['-f', `.*${port}.*`], { stdio: 'ignore' });
    }
  } catch (error) {
    // Ignore errors when killing processes
  }
}

async function startDev() {
  try {
    console.log('🚀 Starting Yahrzeit Tracker development servers...');
    console.log('📖 In loving memory of Chaya Sara Leah Bas Uri');
    console.log('');
    
    // Check if ports are available and clean up if needed
    console.log('🔍 Checking port availability...');
    
    if (!(await isPortAvailable(3001))) {
      console.log('⚠️  Port 3001 is in use, attempting to free it...');
      await killProcessOnPort(3001);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!(await isPortAvailable(3000))) {
      console.log('⚠️  Port 3000 is in use, attempting to free it...');
      await killProcessOnPort(3000);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Find available ports if still occupied
    const apiPort = await isPortAvailable(3001) ? 3001 : await findAvailablePort(3001);
    const frontendPort = await isPortAvailable(3000) ? 3000 : await findAvailablePort(3000);

    if (apiPort !== 3001) {
      console.log(`⚠️  Using port ${apiPort} instead of 3001 for API server`);
    }
    if (frontendPort !== 3000) {
      console.log(`⚠️  Using port ${frontendPort} instead of 3000 for frontend`);
    }

    // Start the Express API server first
    console.log(`🔧 Starting Express API server on port ${apiPort}...`);
    await startServer(apiPort);
    console.log('✅ Express server started successfully');
    console.log('');

    // Wait a moment for the server to fully initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Start Vite dev server
    console.log(`🔧 Starting Vite dev server on port ${frontendPort}...`);
    viteProcess = spawn('npx', ['vite', 'dev', '--port', frontendPort.toString(), '--host'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
      env: { 
        ...process.env, 
        FORCE_COLOR: '1',
        NODE_ENV: 'development',
        VITE_API_PORT: apiPort.toString()
      }
    });

    viteProcess.on('error', (error) => {
      console.error('❌ Failed to start Vite dev server:', error);
    });

    viteProcess.on('close', (code) => {
      console.log(`Vite dev server exited with code ${code}`);
    });

    console.log('');
    console.log('🎉 Development servers started successfully!');
    console.log('');
    console.log(`📱 Frontend: http://localhost:${frontendPort}`);
    console.log(`🔌 Backend API: http://localhost:${apiPort}`);
    console.log(`💊 Health Check: http://localhost:${apiPort}/api/health`);
    console.log('');
    console.log('🕯️  Memorial Application for Chaya Sara Leah Bas Uri');
    console.log('   Features: Yahrzeit tracking, Memorial candle, Letters to heaven');
    console.log('   Torah learning, Tehillim dedication, Comfort chat');
    console.log('');

  } catch (error) {
    console.error('❌ Failed to start development servers:', error);
    console.error('Stack trace:', error.stack);
    
    // Clean up on error
    if (viteProcess) {
      viteProcess.kill();
    }
    
    process.exit(1);
  }
}

// Graceful shutdown
const cleanup = () => {
  console.log('\n🛑 Shutting down development servers...');
  
  if (viteProcess) {
    try {
      viteProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds if it doesn't respond
      setTimeout(() => {
        if (viteProcess && !viteProcess.killed) {
          viteProcess.kill('SIGKILL');
        }
      }, 5000);
    } catch (error) {
      console.error('Error killing Vite process:', error);
    }
  }
  
  // Clean up ports
  killProcessOnPort(3000).catch(() => {});
  killProcessOnPort(3001).catch(() => {});
  
  setTimeout(() => {
    process.exit(0);
  }, 1000);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  cleanup();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  cleanup();
});

// Handle Windows Ctrl+C
if (process.platform === 'win32') {
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

startDev();
