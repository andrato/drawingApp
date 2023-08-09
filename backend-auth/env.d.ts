declare namespace NodeJS {
    export interface ProcessEnv{ 
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        PASSWORD_SECRET: string;
        MONGO_AUTH: string;
        MONGO_USERS_INFO: string;
        MONGO_URL_TEST: string;
    }
}
