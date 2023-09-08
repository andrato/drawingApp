import { CanvasElem, OptionsType } from "./types";

function subscribe(eventName: string, listener: any) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: any) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: string, data: CanvasElem[] | OptionsType | string) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}
  
export { publish, subscribe, unsubscribe};