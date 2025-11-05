"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSalt = generateSalt;
exports.generateHash = generateHash;
// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');
function generateSalt(saltRound = 5) {
    return bcrypt.genSaltSync(saltRound);
}
function generateHash(rawText) {
    let round = this.round || 10;
    return bcrypt.hashSync(rawText, generateSalt(round));
}
