"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyToken;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwt = require('jsonwebtoken');
function VerifyToken(req, res, next) {
    try {
        let authorization = req.headers['authorization'] || '';
        if (!authorization) {
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ message: 'NO TOKEN' });
        }
        let token = authorization.split(' ')[1];
        const secretKey = process.env.JWT_SECRET || 'your_secret_key';
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res
                    .status(http_status_codes_1.default.BAD_REQUEST)
                    .json({ message: 'INVALLID TOKEN' });
            }
            req.user = decoded;
            next();
        });
    }
    catch (err) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ message: 'INVALLID TOKEN' });
    }
}
