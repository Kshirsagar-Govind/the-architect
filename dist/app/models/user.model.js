"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateHash_1 = require("../utils/generateHash");
const generateID_1 = require("../utils/generateID");
class User {
    constructor(data) {
        this.id = (0, generateID_1.generateUserId)();
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    hashPassowrd() {
        this.password = generateHash_1.generateHash.call({ round: 10 }, this.password);
    }
}
exports.default = User;
