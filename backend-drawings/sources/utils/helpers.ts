

export const generateFilename = (filename: string, type: string, userId: string) => {
    return `${userId}_${filename}.${type}`;
}