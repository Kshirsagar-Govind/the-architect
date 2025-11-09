import ErrorHandler from "./errorHandler";
import httpStatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = process.env.SECRET_KEY || 'your_secret_key';
export interface IDecodedToken {
  id: string;
  email: string;
}

export function generateSalt(saltRound: number = 5) {
  return bcrypt.genSaltSync(saltRound);
}
export async function generateHash(this: any, rawText: string) {
  let round = this.round || 10;
  return await bcrypt.hashSync(rawText, generateSalt(round));
}

export async function generateAuthToken(data: Object) {
  return await jwt.sign(data, secretKey);
}

export async function generateForgetPasswordToken(data: Object) {
  return await jwt.sign(data , secretKey, { expiresIn: '15m' });
}

export async function verifyPassword(password: String, hash: String) {
  return await bcrypt.compare(password, hash);
}

export async function decodeJWTToken(token: string): Promise<IDecodedToken> {
  try {
    const decoded = jwt.verify(token, secretKey) as IDecodedToken;
    return decoded;
  } catch (err) {
    throw new ErrorHandler({
      statusCode: httpStatusCodes.UNAUTHORIZED,
      errorMessage: "Invalid or expired refresh token",
    });
  }
}
// https://chatgpt.com/g/g-p-690a11ebad94819191b2a029356cee75-interview-prep/shared/c/690a1252-4bf0-8322-aa06-4ad119f80815?owner_user_id=user-uUdLESHy1AcqnnKTMKKNbSQ2