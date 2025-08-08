import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupStaticServing } from './static-serve.js';
import yahrzeitRoutes from './routes/yahrzeit.js';
import lettersRoutes from './routes/letters.js';
import learningRoutes from './routes/learning.js';
import tehillimRoutes from './routes/tehillim.js';
import shmirasHalashonRoutes from './routes/shmiras-halashon.js';
import chatRoutes from './routes/chat.js';
import chofetzChaimRoutes from './routes/chofetz-chaim.js';
// Load environment variables first
dotenv.config();
console.log('🔑 Loaded Gemini API Key:', process.env.GEMINI_API_KEY ? '[SET]' : '[NOT SET]');
console.log('🔑 Loaded OpenAI API Key:', process.env.OPENAI_API_KEY ? '[SET]' : '[NOT SET]');
console.log('🔧 Initializing Yahrzeit Tracker server...');
const app = express();
// Enable CORS for all routes
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'Yahrzeit Tracker API is running',
        dedication: 'ליועלי נשמת חיה שרה לאה בת אורי ז״ל (In memory of Chaya Sara Leah Bas Uri zt"l)',
        openaiKeyStatus: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET',
        geminiKeyStatus: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET'
    });
    return;
});
// Import database connection after initial setup
let dbConnectionReady = false;
try {
    console.log('🔧 Loading database connection...');
    await import('./database/connection.js');
    dbConnectionReady = true;
    console.log('✅ Database connection ready');
}
catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('The server will start but API endpoints may not work properly');
}
// API routes - only add if database is ready
if (dbConnectionReady) {
    console.log('🔧 Setting up API routes...');
    app.use('/api/yahrzeit', yahrzeitRoutes);
    app.use('/api/letters', lettersRoutes);
    app.use('/api/learning', learningRoutes);
    app.use('/api/tehillim', tehillimRoutes);
    app.use('/api/shmiras-halashon', shmirasHalashonRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api', chofetzChaimRoutes);
    console.log('✅ API routes configured');
}
else {
    // Fallback routes when database is not ready
    app.use('/api/*', (req, res) => {
        res.status(503).json({
            error: 'Database not available',
            message: 'The database connection is not ready. Please try again later.'
        });
        return;
    });
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
    return;
});
// Export a function to start the server
export async function startServer(port) {
    try {
        if (process.env.NODE_ENV === 'production') {
            setupStaticServing(app);
        }
        const server = app.listen(port, '0.0.0.0', () => {
            console.log('');
            console.log('🚀 Yahrzeit Tracker API Server running successfully!');
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Server: http://localhost:${port}`);
            console.log(`💾 Database: ${dbConnectionReady ? 'Connected' : 'Not available'}`);
            console.log(`🔌 API Health: http://localhost:${port}/api/health`);
            console.log('🕯️  In memory of Chaya Sara Leah Bas Uri zt"l (ליועלי נשמת חיה שרה לאה בת אורי ז״ל)');
            console.log('');
        });
        // Graceful shutdown
        const shutdown = (signal) => {
            console.log(`${signal} received, shutting down gracefully`);
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        return server;
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('Starting Yahrzeit Tracker server...');
    startServer(process.env.PORT || 3001);
}
