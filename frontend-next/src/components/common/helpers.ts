import { LocalStorageKeys } from "../utils/constants/LocalStorage";

export const isSameUser = (userId: string) => {
    const userInfo = localStorage.getItem(LocalStorageKeys.USER_INFO);

    if (!userInfo) {
        return true;
    }

    const loggedUserId = JSON.parse(userInfo)?.id;

    if (loggedUserId === userId) {
        return true;
    }

    return false;
}

export const isUserLoggedIn = () => {
    const userInfo = localStorage.getItem(LocalStorageKeys.USER_INFO);
    const userToken = localStorage.getItem(LocalStorageKeys.USER_TOKEN);

    if (!userInfo || !userToken) {
        return false;
    }

    return true;
}

type Params = {
    userName: string,
    firstName?: string,
    lastName?: string,
} | {
    firstName: string,
    lastName: string,
    userName?: string,
}

export const getNameInitials = (params: Params) => {
    let firstNameInitial;
    let lastNameInitial;

    if (params.userName) {
        const names = params.userName.split(" ");
        
        if (names.length > 1) {
            firstNameInitial = names[0][0];
            lastNameInitial = names[1][0];
        } else if (names.length) {
            firstNameInitial = names[0][0];
        }
    }

    if (params.firstName && params.lastName) {
        firstNameInitial = params.firstName[0];
        lastNameInitial = params.lastName[0];
    }

    return {firstNameInitial, lastNameInitial};
}

export const getUserInfo = () => {
    const userLocalhost = localStorage.getItem(LocalStorageKeys.USER_INFO);

    if (!userLocalhost) {
        return null;
    }

    const userInfo = JSON.parse(userLocalhost);

    return userInfo;
}