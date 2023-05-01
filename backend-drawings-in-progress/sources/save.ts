import { Router, Request, Response} from "express";
import multer from "multer";
import fs from 'fs';
import { IMAGE_EXT, VIDEO_EXT, generateFilename } from "./utils/helpers";
import { modelDrawing, modelDrawingInProgress } from "../mongo_schema";
import { DrawingType, defaultDrawingInProgress } from "./utils/types";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const videoDir = './uploads/inprogress/videos';
        const imageDir = './uploads/inprogress/images';

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        if(file.mimetype === "image/jpeg") {
            cb(null, imageDir);
            return;
        }
        cb(null, videoDir);
    },
    filename: (req, file, cb) => {
        const userId = (req.query.userId ?? 'guest') as string;

        if(file.mimetype === "image/jpeg") {
            cb(null, generateFilename(file.originalname, IMAGE_EXT, userId));
            return;
        }
        cb(null, generateFilename(file.originalname, VIDEO_EXT, userId));
    }
});
const upload = multer({storage: storage});

router.post('/', upload.array('files'),
    async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        const userId= String(req.query.userId);

        const newDrawing: DrawingType = {
            ...defaultDrawingInProgress,
            userId: userId,
            title: `${userId}_${files[0].originalname}`,
            video: {
                destination: files[0]?.destination,
                filename: files[0]?.filename,
                path: files[0]?.path,
                size: files[0]?.size,
            },
            image: {
                destination: files[1]?.destination,
                filename: files[1]?.filename,
                path: files[1]?.path,
                size: files[1]?.size,
            }
        };

        let existingDrawing: (DrawingType & {_id: string} | null) = null;

        // if we find drawing in db, we update it
        try {
            existingDrawing = await modelDrawingInProgress.findOne({title: newDrawing.title});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }

        if (existingDrawing) {
            try {
                await modelDrawing.updateOne({title: newDrawing.title}, {
                    $set: {
                        "lastUpdated": newDrawing.lastUpdated,
                        "video": newDrawing.video,
                        "image": newDrawing.image,
                    }
                });

                return res.status(200).json({
                    status: 0, 
                    message: "updated drawing",
                })
            } catch (err) {
                return res.status(500).json({
                    status: 1, 
                    error: "Update failed",
                })
            }
        }

        try {
            await modelDrawingInProgress.create(newDrawing);

            return res.status(200).json({
                status: 0, 
                message: "created drawing",
            })
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: "Creating failed",
            })
        }
    }
);

export {router as Save};