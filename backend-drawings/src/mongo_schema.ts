import mongoose, { Schema, model, Types } from "mongoose";

/* SCHEMAS */
const drawingSchema = new Schema({
    userId: String,
    userInfo: {
        name: String,
        imgPath: String,
    },
    created: {
        type: Number,
        index: true,
        require: true,
    },
    lastUpdated: Number,
    title: String,
    displayTitle: String,
    categories: [String],
    rating: Number,
    reviews: Number,
    description: String,
	topArt: {
        type: Boolean,
        default: false,
        index: true,
        require: true,
    }, 
	topAmateur: {
        type: Boolean,
        default: false,
        index: true,
        require: true,
    }, 
	video: {
        location: String,
        filename: String,
        size: Number,
    },
    image: {
        location: String,
        filename: String,
        size: Number,
    },
}, { collection: 'drawings'});

/* MODEL */
export const modelDrawing = model('drawing', drawingSchema);