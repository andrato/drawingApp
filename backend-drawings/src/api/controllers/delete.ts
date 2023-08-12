
import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";
import { deleteFile } from "../utils/deleteS3";
import { DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { validationResult } from "express-validator";

export const deleteSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const deleteDrawing = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const userId = req.query.userId;

    let drawings: DrawingType[] = [];
    try {
        drawings = await modelDrawing.find({userId: userId});
        
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    // delete media from aws
    const promisesImages: Promise<DeleteObjectCommandOutput>[]= drawings.map((drawing) => 
        deleteFile(drawing.image.filename, "images")
    );
    const promisesVideos: Promise<DeleteObjectCommandOutput>[]= drawings.map((drawing) => 
        deleteFile(drawing.video.filename, "videos")
    );
    try {
        await Promise.all(promisesImages);
        await Promise.all(promisesVideos);
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "Error occured when deleteing from aws",
        })
    }
    

    // delete from DB
    try {
        await modelDrawing.deleteMany({userId: userId});
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    return res.status(200).json();
}