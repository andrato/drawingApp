import {describe, expect } from '@jest/globals';
import {modelDrawing} from "../../../mongo_schema";
import request from 'supertest';
import mongoose, { Types } from 'mongoose';
import app from '../../../app';

const drawing = {
    "userId": "6473baf69e50a1ee81d8c0ed",
    "userInfo": {
      "name": "Nou",
      "imgPath": "Nou"
    },
    "created": 1685683409496,
    "lastUpdated": 1685683409496,
    "title": "6473baf69e50a1ee81d8c0ed_dsad",
    "displayTitle": "Un titlu nou",
    "description": "",
    "video": {
      "location": "https://drawings-media.fra1.digitaloceanspaces.com/videos/6473baf69e50a1ee81d8c0ed_dsad.mp4",
      "filename": "6473baf69e50a1ee81d8c0ed_dsad.mp4",
      "size": 25102
    },
    "image": {
      "location": "https://drawings-media.fra1.digitaloceanspaces.com/images/6473baf69e50a1ee81d8c0ed_dsad.jpeg",
      "filename": "6473baf69e50a1ee81d8c0ed_dsad.jpeg",
      "size": 11889
    },
    "rating": 2.5,
    "reviews": 1,
    "labels": [
      "Digital Art",
      "Portrait"
    ],
    "category": "topAmateur"
}

let id: string;

describe('Get /', () => {
    let mongoClient: typeof mongoose;

    beforeAll(async () => {
        mongoClient = await mongoose.connect("mongodb://localhost:27017/test");

        const response = await modelDrawing.create(drawing);
        id = response._id.toString();
    });

    afterAll(async () => {
        await modelDrawing.deleteOne({_id: id});

        await mongoClient.connection.close();
    });

    describe('When request is successful', () => {
        describe('When there is no query param ', () => {
            it('Should return all drawings', async () => {
                const response = await request(app).get('/').query({});

                expect(response.statusCode).toBe(200);
                expect(response.body.drawings[0].displayTitle).toBe(drawing.displayTitle);
            });
        });
        describe('When searching for a category with no drawings', () => {
            it('Should return empty array', async () => {
                const response = await request(app).get('/').query({category: "a category"});

                expect(response.statusCode).toBe(200);
                expect(response.body.drawings.length).toBe(0);
            });
        });
        describe('When searching for a category drawings', () => {
            it('Should return the drawings', async () => {
                const response = await request(app).get('/').query({category: "topAmateur"});

                expect(response.statusCode).toBe(200);
                expect(response.body.drawings[0].displayTitle).toBe(drawing.displayTitle);
            });
        });

        describe('When searching based on date', () => {
            it('Should return the drawings', async () => {
                const response = await request(app).get('/').query({startDate: 1685683409490});

                expect(response.statusCode).toBe(200);
                expect(response.body.drawings[0].displayTitle).toBe(drawing.displayTitle);
            });
        });
    });
});

