import axios from "axios"

const HOST = "http://localhost:8080/auth";

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
        id: string,
        firstName: string,
        lastName: string,
        profile?: UserProfileType | null,
        email: string,
        created: string,
        lastUpdated: string,
    },
};
type ResponseErrorType = {
    status: 1,
    error?: string,
    errors?: ErrorType[],
};
type SignupResponseSuccessType = {
    status: 0;
    message: string;
}

const config = {
    headers:{
        'Content-Type': 'application/json',
    }
};

export const signIn = (user: {email: string, password: string}) => {
    return axios.get<SigninResponseSuccessType | ResponseErrorType>(HOST + "signin", {...config, params: user});
}

export const signUp = (user: {firstName: string, lastName: string, email: string, password: string}) => {
    return axios.post<SignupResponseSuccessType | ResponseErrorType>(HOST + "signup", user, {...config});
}