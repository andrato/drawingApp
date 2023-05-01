"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
const express_1 = require("express");
const mongo_schema_1 = require("../mongo_schema");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.Check = router;
const checkDrawingSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
    name: {
        isLength: {
            errorMessage: 'name param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
};
router.get('/', (0, express_validator_1.checkSchema)(checkDrawingSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 1,
            errors: errors.array(),
        });
    }
    const drawingName = req.query.name;
    const userId = req.query.userId;
    const name = `${userId}_${drawingName}`;
    let existingDrawing = null;
    // if we find drawing in db, we update it
    try {
        existingDrawing = yield mongo_schema_1.modelDrawing.findOne({ name: name });
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            error: err,
        });
    }
    if (existingDrawing !== null) {
        return res.status(200).json({
            status: 1,
            error: "There is already a drawing with this name. Please select another one!",
        });
    }
    try {
        existingDrawing = yield mongo_schema_1.modelDrawingInProgress.findOne({ name: name });
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            error: err,
        });
    }
    if (existingDrawing !== null) {
        return res.status(200).json({
            status: 1,
            error: "There is already a drawing with this name. Please select another one!",
        });
    }
    return res.status(200).json({
        status: 0,
        message: "All good",
    });
}));
//# sourceMappingURL=check.js.map