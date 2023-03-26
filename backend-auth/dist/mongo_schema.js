"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelUser = void 0;
const mongoose_1 = require("mongoose");
/* SCHEMAS */
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    profile: {
        about: {
            type: String,
        }
    },
    created: {
        type: Number,
    },
    lastUpdated: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
    }
}, { collection: 'users' });
/* MODEL */
exports.modelUser = (0, mongoose_1.model)('user', userSchema);
//# sourceMappingURL=mongo_schema.js.map