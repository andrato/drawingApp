import { Schema, model } from "mongoose";

/* SCHEMAS */
const signInSchema = new Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
}, { collection: 'users'});

/* MODEL */
export const modelUser = model('signIn', signInSchema);
