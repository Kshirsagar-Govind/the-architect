"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = generateUserId;
const randomstring = require('randomstring');
function generateUserId() {
    return randomstring.generate({
        length: 12,
        charset: 'hex',
    });
}
