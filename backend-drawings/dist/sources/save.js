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
const router = (0, express_1.Router)();
exports.Save = router;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // if(file.mimetype === "")
        cb(null, './uploads/video');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + ".mp4");
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', upload.single('videoFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('form data', req.file);
    return res.json({ status: 200, message: 'Video saved' });
}));
// const signInSchema = {
//     // Support bail functionality in schemas
//     email: {
//         isEmail: { 
//             bail: true, 
//             location: "params",
//         }
//     },
//     password: {
//         isLength: {
//             errorMessage: 'Password should be at least 1 chars long!',
//             // Multiple options would be expressed as an array
//             options: { min: 1 },
//             location: "params",
//         },
//     },
// }
//# sourceMappingURL=save.js.map