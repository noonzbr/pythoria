import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import progressRoutes from './routes/progress.js';
import hintsRoutes from './routes/hints.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/progress', progressRoutes);
app.use('/api/ai', hintsRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Pythoria' }));

// In production, serve the Vite build and handle client-side routing
if (isProd) {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`🐉 Pythoria server running on port ${PORT}`));
