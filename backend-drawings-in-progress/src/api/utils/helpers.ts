
export const VIDEO_EXT = "webm";
export const IMAGE_EXT = "jpeg";

export const generateFilename = (filename: string, type: string, userId: string) => {
    return `${userId}_${filename}.${type}`;
}