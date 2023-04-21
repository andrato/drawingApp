import axios from "axios"

const HOST = "http://localhost:8080/";

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
      'Content-Type': 'application/json',
    }
};

export const getDrawing = (id: string) => {
    // return axios.get<DrawingResponseSuccessType | DrawingResponseErrorType>(HOST + "signin", {...config, params: user});
     
}