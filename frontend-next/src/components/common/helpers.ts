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