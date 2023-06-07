import mongoose, { Schema, model, Types, connection } from "mongoose";

/* SCHEMAS */
const commentsSchema = new Schema({
    userId: {
        type: String,
        index: true, 
        require: true,
    },
    drawingId: {
        type: String,
        index: true, 
        require: true,
    },
    comment: String,
    created: Number
}, { collection: 'comments'});

const ratingsSchema = new Schema({
    userId: {
        type: String,
        index: true, 
        require: true,
    },
    drawingId: {
        type: String,
        index: true, 
        require: true,
    },
    rating: Number,
    created: Number
}, { collection: 'ratings'});

/* MODEL */
const commentsDb = connection.useDb('comments');

export const modelComment = commentsDb.model('comment', commentsSchema);
export const modelRating = commentsDb.model('rating', ratingsSchema);