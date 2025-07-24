import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import yahrzeitRoutes from './routes/yahrzeit.js';
import lettersRoutes from './routes/letters.js';
import learningRoutes from './routes/learning.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/yahrzeit', yahrzeitRoutes);
app.use('/api/letters', lettersRoutes);
app.use('/api/learning', learningRoutes);

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
