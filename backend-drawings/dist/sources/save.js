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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Save = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./utils/helpers");
const mongo_schema_1 = require("../mongo_schema");
const types_1 = require("./utils/types");
const router = (0, express_1.Router)();
exports.Save = router;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const videoDir = './uploads/inprogress/videos';
        const imageDir = './uploads/inprogress/images';
        if (!fs_1.default.existsSync(videoDir)) {
            fs_1.default.mkdirSync(videoDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(imageDir)) {
            fs_1.default.mkdirSync(imageDir, { recursive: true });
        }
        if (file.mimetype === "image/jpeg") {
            cb(null, imageDir);
            return;
        }
        cb(null, videoDir);
    },
    filename: (req, file, cb) => {
        var _a;
        const userId = ((_a = req.query.userId) !== null && _a !== void 0 ? _a : 'guest');
        if (file.mimetype === "image/jpeg") {
            cb(null, (0, helpers_1.generateFilename)(file.originalname, 'jpeg', userId));
            return;
        }
        cb(null, (0, helpers_1.generateFilename)(file.originalname, 'mp4', userId));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', upload.array('files'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const files = req.files;
    const userId = String(req.query.userId);
    const newDrawing = Object.assign(Object.assign({}, types_1.defaultDrawingInProgress), { userId: userId, name: `${userId}_${files[0].originalname}`, video: {
            destination: (_a = files[0]) === null || _a === void 0 ? void 0 : _a.destination,
            filename: (_b = files[0]) === null || _b === void 0 ? void 0 : _b.filename,
            path: (_c = files[0]) === null || _c === void 0 ? void 0 : _c.path,
            size: (_d = files[0]) === null || _d === void 0 ? void 0 : _d.size,
        }, image: {
            destination: (_e = files[1]) === null || _e === void 0 ? void 0 : _e.destination,
            filename: (_f = files[1]) === null || _f === void 0 ? void 0 : _f.filename,
            path: (_g = files[1]) === null || _g === void 0 ? void 0 : _g.path,
            size: (_h = files[1]) === null || _h === void 0 ? void 0 : _h.size,
        } });
    let existingDrawing = null;
    // if we find drawing in db, we update it
    try {
        existingDrawing = yield mongo_schema_1.modelDrawingInProgress.findOne({ name: newDrawing.name });
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            error: err,
        });
    }
    if (existingDrawing) {
        try {
            yield mongo_schema_1.modelDrawing.updateOne({ name: newDrawing.name }, {
                $set: {
                    "lastUpdated": newDrawing.lastUpdated,
                    "video": newDrawing.video,
                    "image": newDrawing.image,
                }
            });
            return res.status(200).json({
                status: 0,
                message: "updated drawing",
            });
        }
        catch (err) {
            return res.status(500).json({
                status: 1,
                error: "Update failed",
            });
        }
    }
    try {
        yield mongo_schema_1.modelDrawingInProgress.create(newDrawing);
        return res.status(200).json({
            status: 0,
            message: "created drawing",
            // drawingId: drawingNew._id;
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            error: "Creating failed",
        });
    }
}));
//# sourceMappingURL=save.js.map