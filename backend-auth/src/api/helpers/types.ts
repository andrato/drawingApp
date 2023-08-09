
export const defaultUser = {
    firstName: "",
	lastName: "",
    email: "",
    password: "",
    profile: null,
    created: Math.floor(Date.now()),
    lastUpdated: Math.floor(Date.now()),
    isAdmin: false,
}

export type ProfileType = {
    about: string;
}
export type UserInfoType = {
    firstName: string;
	lastName: string;
    email: string;
    password: string;
    profile: ProfileType | null;
    created: number;
    lastUpdated: number;
    isAdmin: boolean;
    drawings: number;
}

export type UserAuthType = {
    email: string;
    password: string;
    created: number;
    lastUpdated: number;
    isAdmin: boolean;
}

export type RequestSignInType = {
    email: string;
    password: string;
}

export type RequestSignUpType = {
    firstName: string;
	lastName: string;
    email: string;
    password: string;
}