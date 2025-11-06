// import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const bcrypt = require('bcryptjs');
export function generateSalt(saltRound: number = 5) {
  return bcrypt.genSaltSync(saltRound);
}
export async function generateHash(this: any, rawText: string) {
  let round = this.round || 10;
  return await bcrypt.hashSync(rawText, generateSalt(round));
}

export async function generateAuthToken(data:Object){
  return await jwt.sign(data,secretKey);
}