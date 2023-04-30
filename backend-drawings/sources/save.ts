import { Router, Request, Response} from "express";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // if(file.mimetype === "")
        cb(null, './uploads/video');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname+".mp4")
    }
});
const upload = multer({storage: storage});

router.post('/', upload.single('videoFile'),
    async (req: Request, res: Response) => {
        console.log('form data', req.file);

        return res.json({status: 200, message: 'Video saved'})
    }
);

export {router as Save};


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