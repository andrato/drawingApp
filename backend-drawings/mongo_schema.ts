import mongoose, { Schema, model } from "mongoose";

/* SCHEMAS */
const drawingSchemaInProgress = new Schema({
    userId: String,
    created: Number,
    lastUpdated: Number,
    name: String,
    displayName: String,
	topArt: {
        type: Boolean,
        default: false,
    }, 
	topAmateur: {
        type: Boolean,
        default: false,
    }, 
	video: {
        destination: String,
        filename: String,
        path: String,
        size: Number,
    },
    image: {
        destination: String,
        filename: String,
        path: String,
        size: Number,
    },
}, { collection: 'drawings_inprogress'});

const drawingSchema = new Schema({
    userId: String,
    created: Number,
    lastUpdated: Number,
    name: String,
    displayName: String,
    categories: [String],
    likes: Number,
	comments: Number,
	topArt: {
        type: Boolean,
        default: false,
    }, 
	topAmateur: {
        type: Boolean,
        default: false,
    }, 
	video: {
        destination: String,
        filename: String,
        path: String,
        size: Number,
    },
    image: {
        destination: String,
        filename: String,
        path: String,
        size: Number,
    },
}, { collection: 'drawings'});

/* MODEL */
export const modelDrawing = model('drawing', drawingSchema);
export const modelDrawingInProgress = model('drawingInProgress', drawingSchemaInProgress);