import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import createServer from '../utils/server';
import UserModel from '../models/user.model';
import { config } from '../config/config';

const app = createServer();

describe('authentication', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        jest.setTimeout(20000);
    });

    beforeEach(async () => {
        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            await collection.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });
    const credentials = { email: 'user1@mail.com', password: 'P4ssword' };

    const addUser = async () => {
        const { body } = await request(app).post('/api/users').send({ name: 'shahin', email: 'user1@mail.com', password: 'P4ssword' });

        return body;
    };

    const postAuthentication = async (credentials: {}) => {
        return await request(app).post('/api/users/signin').send(credentials);
    };

    describe('given credentials are correct', () => {
        it('returns 200', async () => {
            await addUser();
            const { status } = await postAuthentication(credentials);
            expect(status).toBe(200);
        });
        it('returns only user id and name', async () => {
            await addUser();

            const { body } = await postAuthentication(credentials);

            expect(body.name).toBe('shahin');
            expect(Object.keys(body)).toEqual(['id', 'name']);
        });
    });

    describe('given user does not exist', () => {
        it('returns 401', async () => {
            const { status } = await postAuthentication(credentials);
            expect(status).toBe(401);
        });
    });
    describe('given authentication fails', () => {
        it('returns proper error body', async () => {
            const nowInMillis = new Date().getTime();
            const response = await postAuthentication(credentials);
            const error = response.body;
            expect(error.path).toBe('/api/users/signin');
            expect(error.timestamp).toBeGreaterThan(nowInMillis);
            expect(Object.keys(error)).toEqual(['path', 'timestamp', 'message']);
        });
    });

    describe('given password is not valid', () => {
        it('returns 401', async () => {
            await addUser();
            const response = await postAuthentication({ email: 'user1@mail.com' });
            expect(response.status).toBe(401);
        });
    });

    describe('given email is not valid', () => {
        it('returns 401', async () => {
            const response = await postAuthentication({ password: 'incorrect' });
            expect(response.status).toBe(401);
        });
    });
});
