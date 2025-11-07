import dotenv from 'dotenv';
dotenv.config();
import app from './app/app';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'; // only if not already set
}
const PORT = 8080;
console.log('process.env.NODE_ENV ->', process.env.NODE_ENV);

// if (process.env.NODE_ENV !== 'test') {
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
//   });
// }
