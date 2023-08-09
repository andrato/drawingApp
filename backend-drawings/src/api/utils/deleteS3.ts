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