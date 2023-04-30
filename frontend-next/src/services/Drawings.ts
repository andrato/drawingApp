import axios from "axios"

const HOST = "http://localhost:3002/";

type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

type DrawingResponseSuccessType = {
    status: 0;
    drawing: {
        created: string,
        categories: string[],

    },
};
type DrawingResponseErrorType = {
    status: 1,
    error?: string,
    errors?: ErrorType[],
};

const config = {
    headers:{
        "Content-Type": "multipart/form-data",
    }
};

export const getDrawing = (id: string) => {
    // return axios.get<DrawingResponseSuccessType | DrawingResponseErrorType>(HOST + "signin", {...config, params: user});  
}

export const postDrawing = (formData: FormData) => {
    console.log("data is: " + JSON.stringify(formData));

    for (const value of formData.values()) {
        console.log(value);
      }

    return axios.post(HOST + "save", formData, {...config});
}