import { Schema, model } from "mongoose";

/* SCHEMAS */
const drawingSchema = new Schema({
    userId: {
        type: String,
    },
    created: {
        type: Number,
    },
    categories: [String],
    likes: {
        type: Number,
    },
	comments: {
        type: Number,
    },
	topArt: {
        type: Boolean,
        default: false,
    }, 
	topAmateur: {
        type: Boolean,
        default: false,
    }, 
	videoPath: {
        type: String,
    },
    imagePath: {
        type: String,
    }

}, { collection: 'drawings'});

/* MODEL */
export const modelDrawing = model('drawing', drawingSchema);
