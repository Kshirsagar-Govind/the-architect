import express, { Request, Response } from 'express';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import vulnerabilityRoutes from './routes/vulnerabilities.routes';
import subscriptionRoutes from './routes/subscription.routes';

import ErrorHandlerMiddleware from './middlewares/errorHandler.middleware';
import { activityLogs } from './middlewares/activityLog.middleware';

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "-- Welcome to The Architect Server --",
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/vulnerability', vulnerabilityRoutes);
app.use('/api/plan', subscriptionRoutes);

app.use(ErrorHandlerMiddleware);

export default app;
