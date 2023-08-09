
export const defaultUser: UserType = {
    firstName: "",
	lastName: "",
    email: "",
    profile: null,
    created: Math.floor(Date.now()),
    lastUpdated: Math.floor(Date.now()),
    drawings: 0,
}

export type ProfileType = {
    about?: string;
    birthdate?: number;
}

export type UserType = {
    firstName: string;
	lastName: string;
    email: string;
    profile: ProfileType | null;
    created: number;
    lastUpdated: number;
    imgLocation?: string;
    drawings?: number;
}

export type RequestUserInfoType = {
    email: string;
}