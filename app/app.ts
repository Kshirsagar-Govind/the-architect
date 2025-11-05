import express from 'express';
import type { Request, Response } from 'express';
import userRoutes from './routes/user.routes';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});
app.use('/api/user', userRoutes);

export default app;
