/**
 * @jest-environment node
 */
// const app = require('../../app/app');
// const request = require('supertest');
// const { faker } = require('@faker-js/faker');
import app from '../../app/app';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { Users } from '../../app/controller/user.controller';
import User from '../../app/models/user.model';
import { generateUserId } from '../../app/utils/generateID';
import { generateAuthToken } from '../../app/utils/generateHash';

let fakeUser: { name: string; email: string; password: string };
describe('- USER API TESTING ', () => {
    beforeAll(async () => {
        fakeUser = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        // Actually create a user before GET test runs
        // await request(app).post('/api/user').send(fakeUser);
        for (let i = 0; i < 5; i++) {
            const newUser = new User({
                id: await generateUserId(),
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            Users.push(newUser);
        }
    });

    it('POST /api/user should create new user', async () => {
        const res = await request(app)
            .post('/api/user')
            .send(fakeUser)
        // .set('Accept', 'application/json');
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it('GET /api/user should fetch all users', async () => {
        const res = await request(app).get('/api/user');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    it('PUT /api/user/:id should update user using id', async () => {
        let user = Users[3]
        let token = await generateAuthToken({ id: user.id, email: user.email })
        const res = await request(app)
            .put(`/api/user/${user.id}`)
            .send({ name: "updated name", email: "test@updated.com", password: "passord@updated" })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message')
    });
    // it('DELETE /api/user/:id should delete user using id', async () => { });
    afterAll(() => {
        Users.length = 0; // clear memory between test runs
    });
});
