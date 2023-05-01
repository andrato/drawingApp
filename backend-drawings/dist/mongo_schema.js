"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelDrawingInProgress = exports.modelDrawing = void 0;
const mongoose_1 = require("mongoose");
/* SCHEMAS */
const drawingSchemaInProgress = new mongoose_1.Schema({
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
}, { collection: 'drawings_inprogress' });
const drawingSchema = new mongoose_1.Schema({
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
}, { collection: 'drawings' });
/* MODEL */
exports.modelDrawing = (0, mongoose_1.model)('drawing', drawingSchema);
exports.modelDrawingInProgress = (0, mongoose_1.model)('drawingInProgress', drawingSchemaInProgress);
//# sourceMappingURL=mongo_schema.js.map