// import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

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
// https://chatgpt.com/g/g-p-690a11ebad94819191b2a029356cee75-interview-prep/shared/c/690a1252-4bf0-8322-aa06-4ad119f80815?owner_user_id=user-uUdLESHy1AcqnnKTMKKNbSQ2