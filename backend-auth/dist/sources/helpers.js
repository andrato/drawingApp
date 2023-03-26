"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.generateHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateHash = (password) => {
    const salt = bcrypt_1.default.genSaltSync(12);
    const hash = bcrypt_1.default.hashSync(password, salt);
    return hash;
};
exports.generateHash = generateHash;
const comparePassword = (password, hashPassword) => {
    return bcrypt_1.default.compareSync(password, hashPassword);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=helpers.js.map