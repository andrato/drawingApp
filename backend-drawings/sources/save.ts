import { Router, Request, Response} from "express";
import multer from "multer";
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const videoDir = './uploads/videos';
        const imageDir = './uploads/images';

        // // when creating the dir for user
        // // we'll also create the videos/ and images/ dir
        // if (!fs.existsSync(dir)) {
        //     fs.mkdirSync(dir+'/videos/', { recursive: true });
        //     fs.mkdirSync(dir+'/images/', { recursive: true });
        // }
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        if(file.mimetype === "image/jpeg") {
            cb(null, videoDir);
            return;
        }
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        if(file.mimetype === "image/jpeg") {
            cb(null, file.originalname+".jpeg");
            return;
        }
        cb(null, file.originalname+".mp4");
    }
});
const upload = multer({storage: storage});

router.post('/', upload.array('files'),
    async (req: Request, res: Response) => {
        console.log('form data', req.file);
        console.log('form data', req.files);

        // if (req.file?.originalname){
        //     await getImage(req.file.originalname);
        // }
        
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