import {describe, expect, test} from '@jest/globals';
import {modelUserAuth, modelUserInfo} from "../mongo_schema";
import request from 'supertest';
import mongoose from 'mongoose';

const userAuth = {
    email: "email@ceva.com",
    password: "d3deddfsfds",
    isAdmin: false,
}

const userInfo = {
    firstName: "da",
	lastName: "ceva",
    email: userAuth.email,
    password: userAuth.password,
    profile: {},
    isAdmin: false,
}

const responseSignIn = {
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    profile: {},
    email: userInfo.email,
}

const API_BASE = "http://localhost:8001";

describe('Get /signin', () => {
    let mongoClient: typeof mongoose;

    beforeAll(async () => {
        mongoClient = await mongoose.connect("mongodb://localhost:27017/test");

        try {
            // first, add the required user to the database
            const response = await request(API_BASE + '/signup').post('/').send({ 
                email: userInfo.email, 
                password: userInfo.password, 
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
            });
        } catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {
        await modelUserAuth.findOneAndDelete({email: userInfo.email});
        await modelUserInfo.findOneAndDelete({email: userInfo.email});

        await mongoClient.connection.close();
    });

    describe('When request is successful', () => {
        it('Should return user data', async () => {
            const response = await request(API_BASE + '/signin').get('/').query({ email: userInfo.email, password: userInfo.password });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(0);
            expect(response.body.user.firstName).toBe(responseSignIn.firstName);
            expect(response.body.user.lastName).toBe(responseSignIn.lastName);
            expect(response.body.user.email).toBe(responseSignIn.email);
        });

        describe('When user is not found in DB', () => {
            it('Should return a message that credentials are not valid', async () => {
                const response = await request(API_BASE + '/signin').get('/').query({ email: "otheruser@gmail.com", password: userInfo.password });

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe(1);
                expect(response.body.error).toBe("Wrong credentials! If you don't have an account you can register now!");
            })
        })
    });

    describe('When request fails due to missing params', () => {
        it('Should throw a 400 http error', async () => {
            const response = await request(API_BASE + '/signin').get('/').query({ password: userInfo.password });
            
            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].msg).toBe('Email is wrong or missing!');
        })
    });

    // describe('When request fails because of mongo', () => {
    //     it('Should throw a 500 http error', async () => {
    //         await mongoClient.connection.close();

    //         modelUserAuth.

    //         const response = await request(API_BASE + '/signin').get('/').query({ password: userInfo.password });
    //         expect(response.statusCode).toBe(500);
    //     })
    // });
});

