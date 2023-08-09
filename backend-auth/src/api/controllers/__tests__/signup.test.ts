import {describe, expect } from '@jest/globals';
import {modelUserAuth, modelUserInfo} from "../../../mongo_schema";
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../app';

const user = {
    firstName: "da",
    lastName: "ceva",
    email: "email@ceva.com",
    password: "d3deddfsfds",
    profile: {},
    isAdmin: false,
}

describe('Get /signin', () => {
    let mongoClient: typeof mongoose;

    beforeAll(async () => {
        mongoClient = await mongoose.connect("mongodb://localhost:27017/test");
    });

    afterAll(async () => {
        await modelUserAuth.findOneAndDelete({email: user.email});
        await modelUserInfo.findOneAndDelete({email: user.email});

        await mongoClient.connection.close();
    });

    describe('When request is successful', () => {
        it('Should return a response message', async () => {
            const response = await request(app).post('/signup').send({ 
                email: user.email, 
                password: user.password, 
                firstName: user.firstName,
                lastName: user.lastName,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(0);
            expect(response.body.message).toBe("Created successfully");
        });
    });

    describe('When user is already registered', () => {
        it('Should return an error message', async () => {
            const response = await request(app).post('/signup').send({ 
                email: user.email, 
                password: user.password, 
                firstName: user.firstName,
                lastName: user.lastName,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(1);
            expect(response.body.error).toBe("There is already a user with this email address!");
        })
    })
});