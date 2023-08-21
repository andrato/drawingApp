import { Request, Response} from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { DrawingType, defaultDrawingInProgress } from "../utils/types";
import { modelDrawingInProgress } from "../../mongo_schema";

export const saveSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is missing!',
            options: { min: 1 },
        },
    },
}

export const save = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }

    const files = req.files as Express.MulterS3.File[];
    const userId= String(req.query.userId);
    const drawingId = String(req.query.drawingId) as string;
    const title = files[0]?.key.split(".")[0];

    const newDrawing: DrawingType = {
        ...defaultDrawingInProgress,
        userId: userId,
        title: title,
        video: {
            location: files[0]?.location,
            filename: files[0]?.key,
            size: files[0]?.size,
        },
        image: {
            location: files[1]?.location,
            filename: files[1]?.key,
            size: files[1]?.size,
        }
    };

    console.log("Location is: " + newDrawing.video.location);

    // if drawingId exists => drawing should exists
    if (drawingId !== 'undefined') {
        let existingDrawing: (DrawingType & {_id: string} | null) = null;

        const mongoId = new mongoose.Types.ObjectId(drawingId);

        try {
            existingDrawing = await modelDrawingInProgress.findOne({_id: mongoId, title: title});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: "Error on find in progress drawings",
            })
        }

        // // if existingDrawing has different name => we must erase from volume
        // if (existingDrawing && existingDrawing.title !== title) {
        //     try {
        //         await deleteFile(existingDrawing.title+"."+IMAGE_EXT, "images");
        //     } catch (err) {
        //         // nothing
        //     }

        //     try {
        //         await deleteFile(existingDrawing.title+"."+VIDEO_EXT, "videos");
        //     } catch (err) {
        //         // nothing
        //     }

        //     try {
        //         await modelDrawingInProgress.updateOne({_id: mongoId}, {
        //             $set: {
        //                 "title": newDrawing.title,
        //                 "lastUpdated": newDrawing.lastUpdated,
        //                 "video.$[].location": newDrawing.video.location,
        //                 "video.$[].filename": newDrawing.video.filename,
        //                 "video.$[].size": newDrawing.video.size,
        //                 "image.$[].location": newDrawing.image.location,
        //                 "image.$[].filename": newDrawing.image.filename,
        //                 "image.$[].size": newDrawing.image.size,
        //             }
        //         });

        //         return res.status(200).json({
        //             status: 0, 
        //             message: "updated drawing",
        //         })
        //     } catch (err) {
        //         return res.status(500).json({
        //             status: 1, 
        //             error: "Update failed",
        //         })
        //     }
        // }

        if (existingDrawing) {
            try {
                await modelDrawingInProgress.updateOne({_id: mongoId}, {
                    $set: {
                        "lastUpdated": newDrawing.lastUpdated,
                        "video.$[].size": newDrawing.video.size,
                        "image.$[].size": newDrawing.image.size,
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
    }

    try {
        const model = await modelDrawingInProgress.create(newDrawing);

        return res.status(200).json({
            status: 0, 
            drawingId: model._id,
            message: "created drawing",
        })
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            code: 1001,
            error: "Creating failed",
        })
    }
}


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const videoDir = './uploads/inprogress/videos';
//         const imageDir = './uploads/inprogress/images';

//         if (!fs.existsSync(videoDir)) {
//             fs.mkdirSync(videoDir, { recursive: true });
//         }

//         if (!fs.existsSync(imageDir)) {
//             fs.mkdirSync(imageDir, { recursive: true });
//         }

//         if(file.mimetype === "image/jpeg") {
//             cb(null, imageDir);
//             return;
//         }
//         cb(null, videoDir);
//     },
//     filename: (req, file, cb) => {
//         const userId = (req.query.userId ?? 'guest') as string;

//         if(file.mimetype === "image/jpeg") {
//             cb(null, generateFilename(file.originalname, IMAGE_EXT, userId));
//             return;
//         }
//         cb(null, generateFilename(file.originalname, VIDEO_EXT, userId));
//     }
// });