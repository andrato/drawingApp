import axios from "axios"

const HOST = "http://localhost:8080/";

type UserProfileType = {
    about: string
};

type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

type SigninResponseSuccessType = {
    status: 0;
    accessToken: string;
    user: {
        firstName: string,
        lastName: string,
        profile?: UserProfileType | null,
        email: string,
        created: string,
        lastUpdated: string,
    },
};
type SigninResponseErrorType = {
    status: 1,
    error?: string,
    errors?: ErrorType[],
};

const config = {
    headers:{
      'Content-Type': 'application/json',
    }
};

export const signIn = (user: {email: string, password: string}) => {
    return axios.get<SigninResponseSuccessType | SigninResponseErrorType>(HOST + "signin", {...config, params: user});
}