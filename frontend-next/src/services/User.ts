import axios from "axios"

export const HOST_USER = "http://localhost:8080/user";
export const USER_INFO_API = HOST_USER + "/info";
export const ADMIN_USERS_API = HOST_USER + "/admin/users";

export type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

export type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    created: number,
    lastUpdated: number,
    imgLocation: string;
    isAdmin: boolean;
    profile: {
        about: {
            type: String,
        },
        birthdate: Number,
    }
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
    return axios.get<UserResponseSuccessType>(USER_INFO_API, {...config, params: {userId: userId}});
}

export const getUsers = () => {
    return axios.get<{users: UserType[]}>(ADMIN_USERS_API, {...config});
}