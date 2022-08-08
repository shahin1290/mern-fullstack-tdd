import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import createServer from '../utils/server';
import UserModel from '../models/user.model';
import { config } from '../config/config';

const app = createServer();

describe('User Update', () => {
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

    const putUser = async (id = 5, body: any, options = {}) => {
        let agent = request(app).put('/api/users/' + id);

        /*  if (options.token) {
            agent.set('Authorization', `Bearer ${options.token}`);
        } */
        return agent.send(body);
    };

    const postAuthentication = async (credentials: {}) => {
        return await request(app).post('/api/users/signin').send(credentials);
    };

    describe('given request sent without basic authorization', () => {
        it('returns forbidden', async () => {
            const nowInMillis = new Date().getTime();
            const { status, body } = await putUser(5, null);
            expect(status).toBe(403);
            expect(body.path).toBe('/api/users/5');
            expect(body.timestamp).toBeGreaterThan(nowInMillis);
            expect(body.message).toBe('not authorized');
        });
    });

    describe('given request sent with incorrect email in basic authorization', () => {
        it('returns forbidden', async () => {
            await addUser();
            const response = await putUser(5, null, { auth: { email: 'user1000@mail.com', password: 'P4ssword' } });
            expect(response.status).toBe(403);
        });
    });
    describe('given request sent with incorrect password in basic authorization', () => {
        it('returns forbidden', async () => {
            await addUser();
            const response = await putUser(5, null, { auth: { email: 'user1@mail.com', password: 'password' } });
            expect(response.status).toBe(403);
        });
    });
    describe('given update request is sent with correct credentials but for different user', () => {
        it('returns forbidden', async () => {
            await addUser();
            const userToBeUpdated = await addUser({ username: 'user2', email: 'user2@mail.com', password: 'P4ssword' });
            const response = await putUser(userToBeUpdated.id, null, {
                auth: credentials
            });
            expect(response.status).toBe(403);
        });
    });
});
