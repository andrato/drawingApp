import { Router, Request, Response} from "express";
import multer from "multer";
import fs from 'fs';
import { generateFilename } from "./helpers";
import { modelDrawing, modelDrawingInProgress } from "../mongo_schema";
import { DrawingType, defaultDrawingInProgress } from "./types";

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
            cb(null, videoDir);
            return;
        }
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const userId = (req.query.userId ?? 'guest') as string;

        if(file.mimetype === "image/jpeg") {
            cb(null, generateFilename(file.originalname, 'jpeg', userId));
            return;
        }
        cb(null, generateFilename(file.originalname, 'mp4', userId));
    }
});
const upload = multer({storage: storage});

router.post('/', upload.array('files'),
    async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        const newDrawing: DrawingType = {
            ...defaultDrawingInProgress,
            userId: req.params.userId,
            name: `${files[0]?.destination}_${files[0].originalname}`,
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
            existingDrawing = await modelDrawingInProgress.findOne({name: newDrawing.name});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }

        if (existingDrawing) {
            console.log("will update");

            const updateDrawing: DrawingType & {_id: string}  = {
                ...existingDrawing,
                lastUpdated: newDrawing.lastUpdated,
                video: newDrawing.video,
                image: newDrawing.image,
            }

            try {
                await modelDrawing.updateOne({name: newDrawing.name}, {
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
                // drawingId: drawingNew._id;
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