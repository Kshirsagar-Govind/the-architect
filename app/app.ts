import express, { Request, Response } from 'express';
const cors = require('cors');
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import vulnerabilityRoutes from './routes/vulnerabilities.routes';
import subscriptionRoutes from './routes/subscription.routes';
import ErrorHandlerMiddleware from './middlewares/errorHandler.middleware';
import { activityLogs } from './middlewares/activityLog.middleware';
import { prisma } from "./lib/prisma";
const app = express();

export async function PostgresTest() {
  const users = await prisma.session.findMany();
  console.log("✅ Postgres DB Connected");
}

// PostgresTest()

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.get("/prisma-test", async (req, res) => {
  const users = await prisma.session.findMany();
  res.json({
    prisma: "working",
    usersCount: users.length,
  });
});

app.get("/", (req, res) => {
  res.json({ ok: true, from: "🔥 SERVER WORKING PROPERLY 🔥" });

});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, from: "🔥 SERVER WORKING PROPERLY 🔥" });
});


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/vulnerability', vulnerabilityRoutes);
app.use('/api/plan', subscriptionRoutes);

app.use(ErrorHandlerMiddleware);

export default app;
