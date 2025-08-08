import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app) {
    // Serve static files from the public directory
    const publicPath = path.join(process.cwd(), 'dist', 'public');
    console.log('Setting up static serving from:', publicPath);
    app.use(express.static(publicPath, {
        maxAge: '1d',
        etag: true,
        lastModified: true
    }));
    // For any non-API routes, serve the index.html file (SPA routing)
    app.get('/*splat', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/')) {
            return next();
        }
        // Skip static assets
        if (req.path.includes('.') && !req.path.endsWith('.html')) {
            return next();
        }
        const indexPath = path.join(publicPath, 'index.html');
        console.log('Serving SPA route:', req.path, 'from:', indexPath);
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('Error serving index.html:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });
}
