import { Request} from "express";
import multer from "multer";
import multerS3 from 'multer-s3';
import { IMAGE_EXT, VIDEO_EXT, generateFilename } from "../utils/helpers";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    endpoint: 'https://drawings-media.fra1.digitaloceanspaces.com',
    forcePathStyle: true, // Configures to use subdomain/virtual calling format.
    region: "fra1", 
    credentials: {
      accessKeyId: "DO00KXHTXKTZJR3DK2N8",
      secretAccessKey: "g92AoaxwWG/7tNKp6+CYOlgEwUe+oCTWvs0qW3k/yAU" 
    }
});

const storage = multerS3({
    s3: s3,
    acl: "public-read",
    bucket: (req, file, cb) => { 
        if(file.mimetype === "image/jpeg") {
            cb(null, "images");
            return;
        }
        cb(null, "videos");
    },
    key: (req: Request, file, cb) => {
        const userId = (req.query.userId ?? 'guest') as string;

        if(file.mimetype === "image/jpeg") {
            cb(null, generateFilename(file.originalname, IMAGE_EXT, userId));
            return;
        }
        cb(null, generateFilename(file.originalname, VIDEO_EXT, userId));
    }
});

export const upload = multer({storage: storage});

/* not used, but it works */
export const deleteFile = async (key: string, bucket: "videos" | "images") => {
    const params = {
        Bucket: bucket,
        Key: key,
    };

    try {
        const data = await s3.send(new DeleteObjectCommand(params));
        return data;
    } catch (err) {
        throw(err);
    }
}