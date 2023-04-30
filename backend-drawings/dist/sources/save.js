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
const router = (0, express_1.Router)();
exports.Save = router;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const videoDir = './uploads/videos';
        const imageDir = './uploads/images';
        // // when creating the dir for user
        // // we'll also create the videos/ and images/ dir
        // if (!fs.existsSync(dir)) {
        //     fs.mkdirSync(dir+'/videos/', { recursive: true });
        //     fs.mkdirSync(dir+'/images/', { recursive: true });
        // }
        if (!fs_1.default.existsSync(videoDir)) {
            fs_1.default.mkdirSync(videoDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(imageDir)) {
            fs_1.default.mkdirSync(imageDir, { recursive: true });
        }
        if (file.mimetype === "image/jpeg") {
            cb(null, videoDir);
            return;
        }
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        if (file.mimetype === "image/jpeg") {
            cb(null, file.originalname + ".jpeg");
            return;
        }
        cb(null, file.originalname + ".mp4");
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', upload.array('files'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('form data', req.file);
    console.log('form data', req.files);
    // if (req.file?.originalname){
    //     await getImage(req.file.originalname);
    // }
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