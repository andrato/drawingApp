import { Schema, model } from "mongoose";

/* SCHEMAS */
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
        },
        birthdate: Number,
    },
    created: {
        type: Number,
    },
    lastUpdated: {
        type: Number,
    },
    imgLocation: String,

}, { collection: 'users_info'});

/* MODEL */
export const modelUserInfo = model('userInfo', userInfoSchema);
