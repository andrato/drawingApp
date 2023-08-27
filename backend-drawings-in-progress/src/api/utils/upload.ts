import { Request} from "express";
import multer from "multer";
import multerS3 from 'multer-s3';
import { IMAGE_EXT, VIDEO_EXT, generateFilename } from "./helpers";
import { S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectAclCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import Ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

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

// export const updateFile = async (key: string, bucket: "videos" | "images") => {
//     const params = {
//         Bucket: bucket,
//         Key: key,
//     };

//     try {
//         const data = await s3.send(new PutObjectCommand(params));
//         return data;
//     } catch (err) {
//         throw(err);
//     }
// }

// const getObjectCommand = new GetObjectCommand({
//     Bucket: 'video',
//     Key: 'your-object-key'
// });


// const stream = s3.send(getObjectCommand).then(data => {
//     return new Readable({
//         read() {
//             this.push(data);
//             this.push(null);
//         }
//     });
// });

// const proc = new ffmpeg(stream)
//     .outputOptions(['-movflags isml+frag_keyframe'])
//     .toFormat('mp4')
//     .withAudioCodec('copy')
//     //.seekInput(offset) this is a problem with piping
//     .on('error', function(err,stdout,stderr) {
//         console.log('an error happened: ' + err.message);
//         console.log('ffmpeg stdout: ' + stdout);
//         console.log('ffmpeg stderr: ' + stderr);
//     })
//     .on('end', function() {
//         console.log('Processing finished !');
//     })
//     .on('progress', function(progress) {
//         console.log('Processing: ' + progress.percent + '% done');
//     })
//     .pipe(res, { end: true });

// export const updateBucketFile = async (key: string, bucket: "videos" | "images") => {
//     const params = {
//         Bucket: bucket,
//         Key: key,
//     };

//     let stream: Readable;
//     try {
//         const file = await s3.send(new GetObjectAclCommand(params));

//         if (!file) {
//             return null;
//         }

//         stream = new Readable({
//             read() {
//                 this.push(file);
//                 this.push(null);
//             }
//         });
//     } catch (err) {
//         throw("Error retrieving object");
//     }
  
//     // Set up the ffmpeg process
//     let ffmpegProcess = new Ffmpeg(stream); 
  
//     ffmpegProcess.on('error', (err, stdout, stderr) => {
//       // Handle errors here
//     }).on('end', () => {
//       // Processing is complete
//     }).pipe(() => {
//       // Create a new stream
//       let pt = new stream.PassThrough();
  
//       // Reuse the same params object and set the Body to the stream
//       params.Key = 'preview_' + req.body.key;
//       params.Body = pt;
  
//       // Upload and wait for the result
//       s3.upload(params, (err, data) => {
//         if (err)
//           return console.error(err);
  
//         console.log("done");
//       })
//     });
// };