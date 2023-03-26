"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelUser = void 0;
const mongoose_1 = require("mongoose");
/* SCHEMAS */
const signInSchema = new mongoose_1.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
}, { collection: 'users' });
/* MODEL */
exports.modelUser = (0, mongoose_1.model)('signIn', signInSchema);
