import { LocalStorageKeys } from "@/components/utils/constants/LocalStorage";
import axios from "axios"

export const HOST_USER = "http://localhost:8080";
export const USER_INFO_API = HOST_USER + "/user/info";
export const ADMIN_USERS_API = HOST_USER + "/user/users";
export const USERS_FILTERS_API = HOST_USER + "/user/filters";
export const ADMIN_MODIFY_USER_RIGHTS = HOST_USER + "/admin/modify";
export const ADMIN_DELETE_USER_RIGHTS = HOST_USER + "/admin/delete";
export const PROFILE_MODIFY = "http://localhost:8080/user/";

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
    drawings: number;
    rating: number | null;
    reviews: number;
    profile: {
        about: string,
        birthdate: number,
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

const config = () => {
    const token = localStorage.getItem(LocalStorageKeys.USER_TOKEN);

    return token ? {
        headers:{
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        }
    } : {
        headers:{
            'Content-Type': 'application/json',
        }
    }
};

export const getUser = (userId: string) => {
    return axios.get<UserResponseSuccessType>(USER_INFO_API, {...config(), params: {userId: userId}});
}

export const getUsers = () => {
    return axios.get<{users: UserType[]}>(ADMIN_USERS_API, {...config()});
}

export const getUsersFilters = () => {
    return axios.get<{users: UserType[]}>(USERS_FILTERS_API, {...config()});
}

export const modifyUser = (userId: string) => {
    return axios.get(ADMIN_MODIFY_USER_RIGHTS, {...config(), params: {userId: userId}});
}

export const deleteUser = (userId: string) => {
    return axios.get(ADMIN_DELETE_USER_RIGHTS, {...config(), params: {userId: userId}});
}

export const modifyProfile = (props : {
    userId: string;
    firstName?: string;
    lastName?: string;
    about?: string;
}) => {
    return axios.post(PROFILE_MODIFY, props, {...config()});
}