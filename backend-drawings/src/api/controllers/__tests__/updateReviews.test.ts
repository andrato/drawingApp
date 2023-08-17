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

describe('Post /updateReviews', () => {
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
        it('Should change drawing reviews and rating', async () => {
            const response = await request(app).post('/updateReviews').send({drawingId: id, rating: 3, reviews: 2});

            expect(response.statusCode).toBe(200);
            expect(response.body.drawing.reviews).toBe(2);
            expect(response.body.drawing.rating).toBe(3);
        });
    });
    describe('When drawing is not found', () => {
        it('Should return http 500 and error message', async () => {
            const response = await request(app).post('/updateReviews').send({drawingId: "644fc9902157f5cacc5dde89", rating: 3, reviews: 2});

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Drawing could not be found!');
        });
    });
    describe('When drawing occures in mongo', () => {
        it('Should return http 500 and error message', async () => {
            const response = await request(app).post('/updateReviews').send({drawingId: "random id", rating: 3, reviews: 2});

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('An error occured! Please try again later!');
        });
    });
    describe('When body is wrong', () => {
        it('Should return http 400 and validation erros', async () => {
            const response = await request(app).post('/updateReviews').send({rating: 3, reviews: 2});

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].msg).toBe('Missing or incorrect drawingId!');
        });
    });
});

