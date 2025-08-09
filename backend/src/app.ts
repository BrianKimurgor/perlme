// src/app.ts
import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

// Basic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
