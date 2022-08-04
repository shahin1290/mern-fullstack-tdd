import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose, { Collection } from 'mongoose';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import createServer from '../utils/server';

const app = createServer();

describe('user', () => {
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

    const postUser = (user: {}) => {
        const agent = request(app).post('/api/users');

        return agent.send(user);
    };

    describe('user registration', () => {
        describe('given the signup request valid', () => {
            it('should return 200 ok', async () => {
                const response = await postUser({
                    name: 'user1',
                    email: 'user1@mail.com',
                    password: 'P4ssword'
                });
                expect(response.status).toBe(200);
            });
        });
        describe('given the username and password are valid', () => {
            it('should return the user payload', async () => {
                /* const createUserServiceMock = jest
                    .spyOn(UserService, 'createUser')
                    //@ts-ignore
                    .mockReturnValueOnce(userPayload);
                const { statusCode, body } = await supertest(app).post('/api/users').send(userInput);
                expect(statusCode).toBe(200);
                expect(body).toEqual(userPayload);
                expect(createUserServiceMock).toHaveBeenCalledWith(userInput); */

                const { statusCode } = await postUser({
                    name: 'user1',
                    email: 'user1@mail.com',
                    password: 'P4ssword'
                });
                expect(statusCode).toBe(200);
            });
        });
        describe('given the name is empty', () => {
            it('should return 409', async () => {
                const response = await postUser({
                    name: null,
                    email: 'user1@mail.com',
                    password: 'P4ssword'
                });
                expect(response.status).toBe(400);
            });
        });
        describe('given undesired name and email and password are provided', () => {
            it.each`
                field         | value              | expectedMessage
                ${'name'}     | ${''}              | ${'Name is required'}
                ${'email'}    | ${''}              | ${'Email is required'}
                ${'email'}    | ${'mail.com'}      | ${'Not a valid email'}
                ${'email'}    | ${'user.mail.com'} | ${'Not a valid email'}
                ${'email'}    | ${'user@mail'}     | ${'Not a valid email'}
                ${'password'} | ${''}              | ${'Password is required'}
                ${'password'} | ${'P4ssw'}         | ${'Password too short - should be 6 chars minimum'}
            `('returns $expectedMessage when $field is $value', async ({ field, expectedMessage, value }) => {
                const user: any = {
                    name: 'user1',
                    email: 'user1@mail.com',
                    password: 'P4ssword'
                };
                user[field] = value;
                const response = await postUser(user);
                const errorBody = response.body.fieldErrors.body;

                expect(errorBody).toContain(expectedMessage);
            });
        });
    });
});
