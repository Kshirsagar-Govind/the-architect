// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');
export function generateSalt(saltRound: number = 5) {
  return bcrypt.genSaltSync(saltRound);
}
export function generateHash(this: any, rawText: string) {
  let round = this.round || 10;
  return bcrypt.hashSync(rawText, generateSalt(round));
}
