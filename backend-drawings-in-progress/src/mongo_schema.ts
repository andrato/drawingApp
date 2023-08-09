import { Schema, connection, model } from "mongoose";

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
}, { collection: 'drawings_in_progress'});

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
const drawingsDB = connection.useDb('drawings');
const drawingsInProgressDB = connection.useDb('drawings_in_progress');

export const modelDrawing = drawingsDB.model('drawing', drawingSchema);
export const modelDrawingInProgress = drawingsInProgressDB.model('drawingInProgress', drawingSchemaInProgress);