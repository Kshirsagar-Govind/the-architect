import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './app/config/db';
import app, { PostgresTest } from './app/app';
// import { initKafkaProducer } from './app/kafka/producers';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// const PORT = 8000;
const PORT = Number(process.env.PORT) || 8080;

async function startServer() {
  try {
    await connectDB();
    await PostgresTest();
    // await initKafkaProducer();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
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
