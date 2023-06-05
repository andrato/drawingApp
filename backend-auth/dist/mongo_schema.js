"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelUserInfo = exports.modelUserAuth = void 0;
const mongoose_1 = require("mongoose");
/* SCHEMAS */
const userAuthSchema = new mongoose_1.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    created: {
        type: Number,
    },
    lastUpdated: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
    }
}, { collection: 'users' });
const userInfoSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    profile: {
        about: {
            type: String,
        }
    },
    created: {
        type: Number,
    },
    lastUpdated: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
    }
}, { collection: 'users_info' });
/* MODEL */
const auth = mongoose_1.connection.useDb('auth');
const info = mongoose_1.connection.useDb('users_info');
exports.modelUserAuth = auth.model('user', userAuthSchema);
exports.modelUserInfo = info.model('user_info', userInfoSchema);
