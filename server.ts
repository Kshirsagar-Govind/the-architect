import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "./app/config/db";
import app from './app/app';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'; // only if not already set
}
connectDB();
const PORT = 8080;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}
