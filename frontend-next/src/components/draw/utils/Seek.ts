import {Decoder, Encoder, tools, Reader} from 'ts-ebml';

/*
 * Needed for Chrome; MediaStream does not add seek and length info to the file
**/
const readAsArrayBuffer = function(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onloadend = () => { resolve(reader.result); };
        reader.onerror = (ev) => { 
            reject(ev); 
        };
    });
}

export const injectMetadata = async function (blob:Blob) {
    const decoder = new Decoder();
    const reader = new Reader();
    reader.logging = false;
    reader.drop_default_duration = false;

    try {
        const buffer = await readAsArrayBuffer(blob);

        if (buffer === null || typeof buffer === 'string') {
            return blob;
        }

        const elms = decoder.decode(buffer);
        elms.forEach((elm) => { reader.read(elm); });
        reader.stop();

        let refinedMetadataBuf = tools.makeMetadataSeekable(
            reader.metadatas, reader.duration, reader.cues);
        let body = buffer.slice(reader.metadataSize);

        const result = new Blob([refinedMetadataBuf, body],
            {type: blob.type});

       return result;
    } catch (err) {
        console.log("some err when making file seekable");
        return blob;
    }
}

export async function main_from_file(file: string) {
    const decoder = new Decoder();
    const reader = new Reader();
    reader.logging = true;
    reader.logGroup = "Raw WebM file";
    reader.drop_default_duration = false;
    const webMBuf = await fetch(file).then(res=> res.arrayBuffer());
    const elms = decoder.decode(webMBuf);
    elms.forEach((elm)=>{ reader.read(elm); });
    reader.stop();
    const refinedMetadataBuf = tools.makeMetadataSeekable(reader.metadatas, reader.duration, reader.cues);
    const body = webMBuf.slice(reader.metadataSize);
    const refinedWebM = new Blob([refinedMetadataBuf, body], {type: "video/webm"});
    const refined_video = document.getElementById("player") as HTMLSourceElement;
    refined_video.src = URL.createObjectURL(refinedWebM);
    document.body.appendChild(refined_video);
  
    // Log the refined WebM file structure.
    const refinedDecoder = new Decoder();
    const refinedReader = new Reader();  
    refinedReader.logging = true;
    refinedReader.logGroup = "Refined WebM file";

    const refinedBuf = (await readAsArrayBuffer(refinedWebM)) as ArrayBuffer;
    const refinedElms = refinedDecoder.decode(refinedBuf);
    refinedElms.forEach((elm)=>{ refinedReader.read(elm); });
    refinedReader.stop();  
  }