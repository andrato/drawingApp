import { LocalStorageKeys } from '@/components/utils/constants/LocalStorage';
import { injectMetadata } from './Seek';
import getBlobDuration from 'get-blob-duration';

interface CanvasRecorder {
  start: () => void;
  stop: () => void;
  save: () => Promise<Blob | null>;
  pause: () => void;
  download: () => void;
  createStream: <T extends HTMLCanvasElement>(canvas: T) => void;
  captureMediaStream: <T extends MediaStream>(mediaStream: T) => void;
}

export const CanvasRecorder = (): CanvasRecorder => {
    let stream: MediaStream;
    let recordedBlobs: Blob[] = [];
    let supportedType: string | null = null;
    let mediaRecorder: MediaRecorder | null = null;

    /* private functions */
    const handleStop = () => {
        const superBuffer = download();
    }

    const handleDataAvailable = (event: any) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    const resetEverything = () => {
        recordedBlobs = [];
        supportedType = null;
        mediaRecorder = null;
    }

    /* public functions */
    function stop() {
        if (mediaRecorder?.state === "recording") {
            mediaRecorder.stop();
            resetEverything();
        }
    }

    const pause = () => {
        if (mediaRecorder?.state === "recording") {
            mediaRecorder.pause();
        }
    }

    const start = () => {
        if (mediaRecorder?.state === "recording") {
            return;
        }

        if (mediaRecorder?.state === "paused") {
            mediaRecorder.resume();
            return;
        }

        let types = [
            'video/webm,codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
            'video/webm;codecs=h264',
            'video/webm;codecs=daala',
            'video/vp8',
            'video/mpeg'
        ]
        
        for (let i in types) {
            if (MediaRecorder.isTypeSupported(types[i])) {
                supportedType = types[i];
                break;
            }
        }
        if (supportedType === null) {
            console.error('No supported type found for MediaRecorder');
            return;
        }

        /* check https://www.wowza.com/blog/what-is-video-bitrate-and-what-bitrate-should-you-use*/
        let options = {
            mimeType: supportedType,
            videoBitsPerSecond: 2500000, // 25000000000 = 2.5 Mbps
            // VideoFrame: 30,
            // CompressionStream: 2,
        }

        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            alert('MediaRecorder is not supported by this browser.');
            return;
        }

        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // collect 100ms of data blobs
    }

    const createStream = <T extends HTMLCanvasElement>(canvas: T) => {
        if (!stream) {
            stream = canvas.captureStream(); //fps
        }
    }

    const captureMediaStream =  <T extends MediaStream>(mediaStream: T) => {
        stream = mediaStream;
    }

    const download = async () => {
        let buggyBlob = new Blob(recordedBlobs, { type: 'video/webm' });
        // const size = await getBlobDuration(buggyBlob);
        // const newerBlob: Blob = {
        //     ...buggyBlob,
        //     size,
        // }

        const newerBlob = await injectMetadata(buggyBlob);

        if (!newerBlob) {
            return;
        }

        // const file = new File([newerBlob], 'sample.txt', { type: newerBlob.type })
        

        // Save the file
        const url = window.URL.createObjectURL(buggyBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `randomName.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    const save = async () => {
        if (null === supportedType) {
            console.error("type no supported");
            return null;
        }

        // /* add metadata for seek tot the blob */
        // let buggyBlob = new Blob(recordedBlobs, { type: supportedType });
        // let newerBlob: Blob | undefined;
        // try {
        //     newerBlob = await injectMetadata(buggyBlob);
        // } catch (err) {
        //     console.error("A")
        // }

        // if (!newerBlob) {
        //     return null;
        // }

        /* create file */
        const filename = localStorage.getItem(LocalStorageKeys.FILENAME) ?? "UNKNOWN";

        // return new File([newerBlob], filename, { type: supportedType });

        return new File(recordedBlobs, filename, { type: supportedType });
    }


    return {
        start,
        stop,
        save,
        pause,
        download,
        createStream,
        captureMediaStream,
    }
}