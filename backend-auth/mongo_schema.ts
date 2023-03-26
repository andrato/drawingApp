import { Schema, model } from "mongoose";

/* SCHEMAS */
const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
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

}, { collection: 'users'});

/* MODEL */
export const modelUser = model('user', userSchema);
