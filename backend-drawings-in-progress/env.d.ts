// declare global {
    namespace NodeJS {
        export interface ProcessEnv{ 
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            PASSWORD_SECRET: string;
            MONGO_AUTH: string;
        }
    }
// }

// // dummy export so we don't have errors
// export {}