import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as util from 'util';
import ffmpeg from 'fluent-ffmpeg';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new AWS.S3({
    accessKeyId: "DO00KXHTXKTZJR3DK2N8",
    secretAccessKey: "g92AoaxwWG/7tNKp6+CYOlgEwUe+oCTWvs0qW3k/yAU",
    region: "fra1",
});

const s3Client = new S3Client({
    endpoint: 'https://drawings-media.fra1.digitaloceanspaces.com',
    forcePathStyle: true, // Configures to use subdomain/virtual calling format.
    region: "fra1", 
    credentials: {
      accessKeyId: "DO00KXHTXKTZJR3DK2N8",
      secretAccessKey: "g92AoaxwWG/7tNKp6+CYOlgEwUe+oCTWvs0qW3k/yAU" 
    }
});

const bucketName = 'videos';
const tempFilePath = 'downloaded.mp4';
const tempFilePathAbsolute = path.resolve(__dirname, tempFilePath);
// const downloadObject = util.promisify(s3.getObject.bind(s3));
// const uploadObject = util.promisify(s3.upload.bind(s3));

export async function downloadVideo(key: string) {
    try {
        const { Body} = await s3Client.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        }));

        if (!Body) {
            return;
        }

        const bodyBuffer = await Body.transformToByteArray();

        fs.writeFileSync(tempFilePath, bodyBuffer);

        console.log('Video downloaded successfully.');
        await processVideo(key);
    } catch (error) {
        console.error('Error downloading video:', error);
    }
}

async function processVideo(key: string) {
    try {
        await new Promise<void>((resolve, reject) => {
            const command = ffmpeg()
                .input(tempFilePathAbsolute);

            command
                // .videoCodec('copy')
                .inputOptions(['-i '])
                // .outputOptions([
                //     // '-movflags',
                //     // 'faststart',
                //     '-c:v libvpx-vp9 ',
                //     // 'h264',
                //     // '-c:a',
                //     // 'aac',
                // ])
                .on('end', () => {
                    console.log('Conversion finished');
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                })
                .save(key);

            // command
            //     .input(tempFilePath)
            //     .inputOptions(['-i '])
            //     .on('end', () => {
            //         console.log('Video processing completed.');
            //         resolve();
            //     })
            //     .on('error', (err: any) => {
            //         console.error('Error processing video:', err);
            //         reject(err);
            //     })
            //     .save(key);
        });

        await uploadVideo(key);
    } catch (error) {
        console.error('Error processing video:', error);
    }
}

async function uploadVideo(key: string) {
    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fs.createReadStream(key),
        }));

        console.log('Processed video uploaded successfully.');
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}