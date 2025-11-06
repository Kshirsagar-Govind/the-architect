import express, { Request, Response } from 'express';
import userRoutes from './routes/user.routes';
import ErrorHandlerMiddleware from './middlewares/errorHandler.middleware';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

app.use('/api/user', userRoutes);

app.use(ErrorHandlerMiddleware);

export default app;
