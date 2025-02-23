import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRedis } from './src/config/redis';
import leaderboardRoutes from './src/routes/leaderboardRoutes';
import authRoutes from './src/routes/authRoutes';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', leaderboardRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send('Something broke!');
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await connectRedis();
    console.log('Connected to Redis');

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
