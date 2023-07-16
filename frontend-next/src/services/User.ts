import axios from "axios"

export const HOST_USER = "http://localhost:8080/user";

export type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: {
        about: {
            type: String,
        },
        birthdate: Number,
    }
    imgLocation: string;
}

export type UserResponseSuccessType = {
    status: 0 | 1;
    user: UserType;
};


export type UserResponseErrorType = {
    status: 1,
    error?: string,
    errors?: ErrorType[],
};

const config = {
    headers:{
        'Content-Type': 'application/json',
    }
};

export const getUser = (userId: string) => {
    return axios.get<UserResponseSuccessType>(HOST_USER + "/info", {...config, params: {userId: userId}});
}

// export const getProfileInfo = () => {

// }