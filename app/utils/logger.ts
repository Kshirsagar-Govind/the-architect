import fs from 'fs';
import path from 'path';

// Define folder + file paths separately
const logDir = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDir, 'app.logs.txt');

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Main logging function
export function Log(level: string, message: string) {
  const log = `[${level}] :: ${message} - ${new Date().toISOString()}\n`;
  fs.appendFileSync(logFilePath, log, { encoding: 'utf8' });
}

// Export logger object for simple use
const Logger = {
  INFO: (message: string) => Log('INFO', message),
  ERROR: (message: string) => Log('ERROR', message),
  WARNING: (message: string) => Log('WARNING', message),
};

export default Logger;
