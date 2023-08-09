import { Schema, model, connection } from "mongoose";

/* SCHEMAS */
const userAuthSchema = new Schema({
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

}, { collection: 'users'});

const userInfoSchema = new Schema({
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
    },
    drawings: Number,
}, { collection: 'users_info'});

/* MODEL */
const auth = connection.useDb('auth');
const info = connection.useDb('users_info');

export const modelUserAuth = auth.model('user', userAuthSchema);
export const modelUserInfo = info.model('user_info', userInfoSchema);
