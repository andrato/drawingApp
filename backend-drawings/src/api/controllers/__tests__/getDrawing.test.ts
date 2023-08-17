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

describe('Get /drawing', () => {
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
        it('Should return the drawing', async () => {
            const response = await request(app).get('/drawing').query({drawingId: id});

            expect(response.statusCode).toBe(200);
            expect(response.body.drawing.displayTitle).toBe(drawing.displayTitle);
        });
    });
    describe('If no drawing is found', () => {
        it('Should return status 200 and null for drawing', async () => {
            const response = await request(app).get('/drawing').query({drawingId: "644fc9902157f5cacc5dde89"});

            expect(response.statusCode).toBe(200);
            expect(response.body.drawing).toBe(null);
        });
    });
    describe('If drawing id is missing', () => {
        it('Should return status 400 and validation error', async () => {
            const response = await request(app).get('/drawing').query({});

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].msg).toBe('drawingId param missing!');
        });
    });
});

