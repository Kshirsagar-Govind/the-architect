import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './app/config/db';
import app from './app/app';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const PORT = Number(process.env.PORT) || 8080;

async function startServer() {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on PORT: ${PORT}`);
      });
    } else {
      console.log('🧪 Running in test mode — server not started');
    }
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
}

startServer();
export default app;
