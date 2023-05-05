import { Router, Request, Response} from "express";
import { modelDrawing, modelDrawingInProgress } from "../mongo_schema";
import { DrawingType } from "./utils/types";
import { checkSchema, validationResult } from "express-validator";
import {promises as fsPromises} from 'fs';
import { IMAGE_EXT, VIDEO_EXT } from "./utils/helpers";

const router = Router();

const checkPublishSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is missing!',
            options: { min: 1 },
        },
    },
    title: {
        isLength: {
            errorMessage: 'title param missing!',
            options: { min: 1 },
        },
    },
    previousTitle: {
        isLength: {
            errorMessage: 'previousTitle param missing!',
            options: { min: 1 },
        }
    },
    categories: {
        isArray: {
            bail:true,
            options: {
                min: 0,
            },
        },
    },
}
router.post('/',
    checkSchema(checkPublishSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: 1,
                errors: errors.array(),
            });
        }

        const previousTitle = req.body.previousTitle;
        const title = req.body.title;
        const userId = req.body.userId;

        const previousName = `${userId}_${previousTitle}`;
        const name = `${userId}_${title}`;

        let existingDrawing: (DrawingType | null) = null;

        // check if there is already a drawing with a name
        try {
            existingDrawing = await modelDrawing.findOne({title: name});
        } catch (err) {
            return res.status(200).json({
                status: 1, 
                error: "Choose a different name! You have already a drawing with the same name!",
            })
        }

        // check for drawing in modelDrawingInProgress db
        try {
            existingDrawing = await modelDrawingInProgress.findOne({title: previousName});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }

        // if drawing does not exist => user probably didn't draw anything
        if (!existingDrawing) {
            return res.status(200).json({
                status: 1, 
                error: "There is nothing to publish",
            });
        }

        let finalVideoPath, finalImagePath, finalVideoFilename, finalImageFilename;

        // Rename drawing video and image if it's the case
        if (name !== previousName) {
            const prevPathVideo = existingDrawing.video.path;
            const pathVideo = `${existingDrawing.video.destination}/${name}.${VIDEO_EXT}`;

            const prevPathImage = existingDrawing.image.path;
            const pathImage = `${existingDrawing.image.destination}/${name}.${IMAGE_EXT}`;

            finalVideoPath = pathVideo;
            finalVideoFilename = `${name}.${VIDEO_EXT}`;

            finalImagePath = pathImage;
            finalImageFilename = `${name}.${IMAGE_EXT}`;

            try {
                await fsPromises.rename(prevPathVideo, pathVideo);
                await fsPromises.rename(prevPathImage, pathImage);
            } catch (err) {
                console.log(JSON.stringify(err));

                return res.status(200).json({
                    status: 0, 
                    error: "Failed to save",
                });
            }
        }

        // add to the drawings db (final drawings)
        const newEntry = {
            ...existingDrawing,
            created: Date.now(),
            lastUpdated: Date.now(),
            title: name,
            categories: req.body.categories,
            description: req.body.description ?? "",
            video: {
                ...existingDrawing.video,
                ...(finalVideoFilename ? {filename: finalVideoFilename} : {}),
                ...(finalVideoPath ? {path: finalVideoPath} : {}),
            },
            image: {
                ...existingDrawing.image,
                ...(finalImageFilename ? {filename: finalImageFilename} : {}),
                ...(finalImagePath ? {path: finalImagePath} : {}),
            },
        }

        try {
            await modelDrawing.create(newEntry);
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: "Error when adding in drawings final",
            })
        }

        // remove from drawings in progress db
        try {
            await modelDrawingInProgress.deleteOne({title: previousName});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: "Error when deleting from drawing in progress",
            });
        }

        return res.status(200).json({
            status: 0, 
            message: "All good",
        });
    }
);

export {router as Publish};