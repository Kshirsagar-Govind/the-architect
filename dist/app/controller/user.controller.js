"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUsers = getUsers;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = __importDefault(require("../models/user.model"));
let Users = [];
function createNewUser(req, res) {
    try {
        let { name, email, password } = req.body;
        let userExists = Users.find((u) => u.email == email);
        if (userExists) {
            return res
                .status(http_status_codes_1.default.CONFLICT)
                .json({ message: 'Account already exists' });
        }
        const newUser = new user_model_1.default({
            id: 'NA',
            name,
            email,
            password,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        newUser.hashPassowrd();
        return res
            .status(http_status_codes_1.default.CREATED)
            .json({ message: 'New User Created' });
    }
    catch (err) {
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ err });
    }
}
function deleteUser(req, res) {
    try {
        let { id } = req.params;
        let userExists = Users.find((u) => u.id == id);
        if (!userExists) {
            res
                .status(http_status_codes_1.default.NOT_FOUND)
                .json({ message: 'No Account exists with given id' });
        }
        let deleteIndex = Users.findIndex((u) => u.id == id);
        Users.splice(deleteIndex, 1);
        return res
            .status(http_status_codes_1.default.OK)
            .json({ message: `User with id ${id} is deleted` });
    }
    catch (err) {
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ err });
    }
}
function updateUser(req, res) {
    try {
        let { id } = req.params;
        let { name } = req.body;
        let userExists = Users.find((u) => u.id == id);
        if (!userExists) {
            res
                .status(http_status_codes_1.default.NOT_FOUND)
                .json({ message: 'No Account exists with given id' });
        }
        let updateIndex = Users.findIndex((u) => u.id == id);
        Users[updateIndex].name = name;
        Users[updateIndex].updatedAt = new Date();
        return res
            .status(http_status_codes_1.default.OK)
            .json({ message: `User detail updated` });
    }
    catch (err) {
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ err });
    }
}
function getUsers(req, res) {
    try {
        if (Users.length == 0) {
            return res
                .status(http_status_codes_1.default.NO_CONTENT)
                .json({ message: 'No Users available' });
        }
        return res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'Users fetched', data: Users });
    }
    catch (err) {
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ err });
    }
}
