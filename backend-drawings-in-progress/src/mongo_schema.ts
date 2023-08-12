import { Schema, connection, model } from "mongoose";

/* SCHEMAS */
const drawingSchemaInProgress = new Schema({
    userId: String,
    created: Number,
    lastUpdated: Number,
    title: String,
    displayName: String,
	category: {
        type: String,
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
    labels: {
        type: [String],
        default: [],
        index: true,
        require: false,
    },
    rating: Number,
	reviews: Number,
    description: String,
	category: {
        type: String,
        default: "gallery",
        index: true,
        require: false,
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