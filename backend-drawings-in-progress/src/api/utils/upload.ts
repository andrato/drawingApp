import { Request} from "express";
import multer from "multer";
import multerS3 from 'multer-s3';
import { IMAGE_EXT, VIDEO_EXT, generateFilename } from "./helpers";
import { S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectAclCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import Ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";

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
    },
    
});

export const upload = multer({
    storage: storage,
});

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

const getVideoCommand = (key: string) => new GetObjectCommand({
    Bucket: 'video',
    Key: key,
});

// ToDo: remove this at some point
export const updateBucketFile = async (key: string) => {
    const params = {
        Bucket: "videos",
        Key: key,
    };

    let stream: Readable;
    try {
        const file = await s3.send(new GetObjectAclCommand(params));

        if (!file) {
            return null;
        }

        stream = new Readable({
            read() {
                this.push(file);
                this.push(null);
            }
        });
    } catch (err) {
        throw("Error retrieving object");
    }

    const passthroughStream = new PassThrough();

    // Set up the ffmpeg process
    try {
        // let process = Ffmpeg(stream); 

        Ffmpeg(stream.read())
            .addOptions([
                '-i ',
            ])
            .output(passthroughStream, { end: true })
            .on('progress', (p) => {
                console.log(p);
            })
            .on('error', (err) => {
                console.log(err); 
            })
            .on('end', () => {
                const bucketStreamParams = {
                    ...params,
                    Body: passthroughStream,
                }
        
                try {
                    s3.send(new PutObjectCommand(bucketStreamParams));
                } catch(err) {
                    console.log(err);
                }
            })
            .run()

        // const bucketStreamParams = {
        //     ...params,
        //     Body: passthroughStream,
        // }

        // try {
        //     s3.send(new PutObjectCommand(bucketStreamParams));
        // } catch(err) {
        //     console.log(err);
        // }

        // const s3Response = await s3.upload(bucketStreamParams).promise()

        // process
        //     .addOptions([
        //         '-i ',
        //     ])
        //     .output(key)
        //     .on('end', (newStream) => {
        //         try {
        //             s3.send(new PutObjectCommand({...params, Body: newStream}))
        //         } catch(err) {
        //             console.log(err);
        //         }
        //     })
        //     .run();
    } catch (e) {
        console.error(e);
        throw e;
    }
};