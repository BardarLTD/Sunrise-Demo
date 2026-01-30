import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Hello World endpoint
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello World from the backend!' });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${String(PORT)}`);
});
