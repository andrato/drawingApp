"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelDrawing = void 0;
const mongoose_1 = require("mongoose");
/* SCHEMAS */
const drawingSchema = new mongoose_1.Schema({
    userId: {
        type: String,
    },
    created: {
        type: Number,
    },
    labels: [String],
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
}, { collection: 'drawings' });
/* MODEL */
exports.modelDrawing = (0, mongoose_1.model)('drawing', drawingSchema);
