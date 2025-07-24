import { spawn } from 'child_process';

async function cleanup() {
  console.log('🧹 Cleaning up development processes...');
  
  try {
    if (process.platform === 'win32') {
      // Windows cleanup
      console.log('Stopping Windows processes...');
      spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'ignore' });
      spawn('taskkill', ['/F', '/IM', 'tsx.exe'], { stdio: 'ignore' });
    } else {
      // Unix-like systems cleanup
      console.log('Stopping Unix processes...');
      
      // Kill processes by name patterns
      const killCommands = [
        ['pkill', ['-f', 'vite']],
        ['pkill', ['-f', 'tsx.*dev']],
        ['pkill', ['-f', 'node.*3000']],
        ['pkill', ['-f', 'node.*3001']],
      ];
      
      for (const [cmd, args] of killCommands) {
        try {
          spawn(cmd, args, { stdio: 'ignore' });
        } catch (error) {
          // Ignore errors
        }
      }
    }
    
    console.log('✅ Cleanup completed');
    console.log('You can now run npm start again');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
  
  process.exit(0);
}

cleanup();
