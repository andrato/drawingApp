import { Schema, model } from "mongoose";

/* SCHEMAS */
const drawingSchemaInProgress = new Schema({
    userId: String,
    created: Number,
    lastUpdated: Number,
    title: String,
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
        location: String,
        filename: String,
        size: Number,
    },
    image: {
        location: String,
        filename: String,
        size: Number,
    },
}, { collection: 'drawings_inprogress'});

const drawingSchema = new Schema({
    userId: String,
    created: {
        type: Number,
        index: true,
        require: true,
        sort: -1,
    },
    lastUpdated: Number,
    title: String,
    displayTitle: String,
    categories: [String],
    likes: Number,
	comments: Number,
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
export const modelDrawingInProgress = model('drawingInProgress', drawingSchemaInProgress);