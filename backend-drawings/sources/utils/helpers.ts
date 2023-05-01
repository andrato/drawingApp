
export const VIDEO_EXT = "mp4";
export const IMAGE_EXT = "jpeg";

export const generateFilename = (filename: string, type: string, userId: string) => {
    return `${userId}_${filename}.${type}`;
}