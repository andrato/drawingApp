import { LocalStorageKeys } from '@/components/utils/constants/LocalStorage';

interface CanvasRecorder {
  start: () => void;
  stop: () => void;
  save: (fileName: string) => void;
  pause: () => void;
  download: () => Blob;
  createStream: <T extends HTMLVideoElement>(canvas: T) => void;
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
            'video/webm',
            'video/webm,codecs=vp9',
            'video/vp8',
            'video/webm;codecs=vp8',
            'video/webm;codecs=daala',
            'video/webm;codecs=h264',
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

        let options = {
            mimeType: supportedType,
            videoBitsPerSecond: 2500000, // 25000000000 = 2.5 Mbps
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
            stream = canvas.captureStream(50); //fps
        }
    }

    const captureMediaStream =  <T extends MediaStream>(mediaStream: T) => {
        stream = mediaStream;
    }

    const download = () => {
        return new Blob(recordedBlobs, { type: supportedType ?? ""})
        // return new File(recordedBlobs, "randomName", { type: supportedType ?? ""});

        // // Save the file
        // const url = window.URL.createObjectURL(file);
        // const a = document.createElement('a');
        // a.style.display = 'none';
        // a.href = url;
        // a.download = `${fileName}.webm`;
        // document.body.appendChild(a);
        // a.click();
        // setTimeout(() => {
        //     document.body.removeChild(a);
        //     window.URL.revokeObjectURL(url);
        // }, 100);
    }

    const save = () => {
        if (null === supportedType) {
            console.error("type no supported");
            return null;
        }

        const filename = localStorage.getItem(LocalStorageKeys.FILENAME) ?? "UNKNOWN";

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

// const recordScreen = async () => {
//     stream = await navigator.mediaDevices.getDisplayMedia({
//         video: { mediaSource: 'screen' }
//     })  
// }