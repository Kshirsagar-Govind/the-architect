"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
let route = express_1.default.Router();
route.get('/', user_controller_1.getUsers);
route.post('/', verifyToken_1.default, user_controller_1.createNewUser);
route.put('/:id', verifyToken_1.default, user_controller_1.updateUser);
route.delete('/:id', verifyToken_1.default, user_controller_1.deleteUser);
exports.default = route;
