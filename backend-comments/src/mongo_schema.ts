import mongoose, { Schema, model, Types, connection } from "mongoose";

/* SCHEMAS */
const repliesSchema = new Schema({
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
    commentId: {
        type: String,
        index: true, 
        require: true,
    },
    reply: String,
    created: Number
}, { collection: 'replies'});

const reviewsSchema = new Schema({
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
    comment: String,
    created: Number,
    lastUpdated: Number,
}, { collection: 'reviews'});

/* MODEL */
const commentsDb = connection.useDb('reviews');

export const modelReply = commentsDb.model('replies', repliesSchema);
export const modelRating = commentsDb.model('reviews', reviewsSchema);