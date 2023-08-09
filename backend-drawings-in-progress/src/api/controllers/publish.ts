import { Request, Response} from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { DrawingType } from "../utils/types";
import { modelDrawing, modelDrawingInProgress } from "../../mongo_schema";
import axios from "axios";

export const publishSchema = {
    drawingId: {
        isLength: {
            errorMessage: 'Missing or incorrect drawingId!',
            options: { min: 1 },
        },
    },
    title: {
        isLength: {
            errorMessage: 'Missing or incorrect title!',
            options: { min: 1 },
        },
    },
    displayTitle: {
        isLength: {
            errorMessage: 'Missing or incorrect displayTitle!',
            options: { min: 1 },
        },
    },
    categories: {
        isArray: {
            bail:true,
            options: {
                min: 0,
            },
        },
    },
    userName: {
        isLength: {
            errorMessage: 'Missing or incorrect userName!',
            options: { min: 1 },
        },
    },
}

export const publish = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }

    const drawingId = req.body.drawingId;
    const userName = req.body.userName;
    const userImg = req.body.userImg;

    // move to drawings and erase from DrawingInProgress
    let existingDrawing: (DrawingType | null) = null;
    const mongoId = new mongoose.Types.ObjectId(drawingId);

    if (drawingId === 'undefined') {
        return res.status(500).json({
            status: 1, 
            error: "No drawing found! Make sure you draw something before save/publish!",
        });
    }

    // check if there is already a drawing with a name
    try {
        existingDrawing = await modelDrawingInProgress.findOne({_id: mongoId});
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    if (!existingDrawing) {
        return res.status(500).json({
            status: 1, 
            error: "No drawing found! Make sure you draw something before save/publish!",
        })
    }

    // add drawing in Drawing and remove it from DrawingsInProgress
    try {
        const newDrawing: DrawingType = {
            userId: existingDrawing.userId,
            userInfo: {
                name: userName,
                imgPath: userImg ?? null, 
            },
            created: Date.now(),
            lastUpdated: Date.now(),
            title: existingDrawing.title,
            displayTitle: req.body.displayTitle,
            categories: req.body.categories ?? [],
            description: req.body.description ?? '',
            likes: 0, 
            comments: 0,
            topArt: false,
            topAmateur: false,
            video: {
                filename: existingDrawing.video.filename,
                location: existingDrawing.video.location,
                size: existingDrawing.video.size,
            },
            image: {
                filename: existingDrawing.image.filename,
                location: existingDrawing.image.location,
                size: existingDrawing.image.size,
            },
        }

        await modelDrawing.create(newDrawing);
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured while saving! Please try again later",
        })
    }

    try {
        await modelDrawingInProgress.deleteOne({_id: mongoId});
    } catch (err) {
        return res.status(200).json({
            status: 0, 
            error: "Error while deleting from modelDrawingInProgress",
        })
    }

    // add drawing to user
    try {
        await axios.post("http://backend-users:8004/addDrawing", {}, { params: {userId: existingDrawing.userId}});
    } catch (err) {
        return res.status(200).json({
            status: 0, 
            error: "Error saving for users",
        })
    }

    return res.status(200).json({
        status: 0, 
        message: "All good",
    });
}