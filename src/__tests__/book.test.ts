/* import supertest from 'supertest';
import createServer from '../utils/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Book from '../models/Book';

const app = createServer();

describe('book', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe('get book route', () => {
        describe('given the book does not exist', () => {
            it('should return a 404', async () => {
                const bookId = '92ea8ec00223efcf3fda6ff3';
                await supertest(app).get(`/books/get/${bookId}`).expect(404);
            });
        });
        describe('given the book does exist', () => {
            it('should return a 200 status and the book', async () => {
                const authorId = new mongoose.Types.ObjectId().toString();
                const book = await Book.create({ author: authorId, title: 'new book 2' });
                const { body, statusCode } = await supertest(app).get(`/books/get/${book._id}`);

                expect(statusCode).toBe(200);
                expect(body.book.title).toBe(book.title);
            });
        });
    });

    describe('create book route', () => {
        describe('given the title is not provided', () => {
            it('should return a 422', async () => {
                await supertest(app).post('/books/create').expect(422);
            });
        });
    });
}); */
