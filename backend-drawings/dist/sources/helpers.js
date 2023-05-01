"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFilename = void 0;
const generateFilename = (filename, type, userId) => {
    return `${userId}_${filename}.${type}`;
};
exports.generateFilename = generateFilename;
//# sourceMappingURL=helpers.js.map