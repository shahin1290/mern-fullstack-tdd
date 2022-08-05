import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose, { Collection } from 'mongoose';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import createServer from '../utils/server';
import UserModel from '../models/user.model';

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
            it('hashes the password in database', async () => {
                await postUser({
                    name: 'user1',
                    email: 'user1@mail.com',
                    password: 'P4ssword'
                });
                const userList = await UserModel.find();
                const savedUser = userList[0];
                console.log(savedUser);

                expect(savedUser.password).not.toBe('P4ssword');
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
            it('should return 400', async () => {
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
                ${'name'}     | ${null}            | ${'Name is required'}
                ${'email'}    | ${null}            | ${'Email is required'}
                ${'email'}    | ${'mail.com'}      | ${'Not a valid email'}
                ${'email'}    | ${'user.mail.com'} | ${'Not a valid email'}
                ${'email'}    | ${'user@mail'}     | ${'Not a valid email'}
                ${'password'} | ${null}            | ${'Password is required'}
                ${'password'} | ${'pass'}          | ${'password must be at least 5 characters long'}
            `('returns $expectedMessage when $field is $value', async ({ field, expectedMessage, value }) => {
                const user: any = {};
                user[field] = value;
                const response = await postUser(user);
                const body = response.body;
                expect(body.validationErrors[field]).toBe(expectedMessage);
            });
        });

        describe('given the email exists', () => {
            it('should return error message: Email is already in use', async () => {
                await UserService.createUser({ name: 'shahin', email: 'user1@mail.com', password: 'P4ssword' });

                const response = await postUser({ name: 'new', email: 'user1@mail.com', password: 'ssssss' });

                expect(response.body.validationErrors.email).toBe('Email is already in use');
            });
        });
    });
});
