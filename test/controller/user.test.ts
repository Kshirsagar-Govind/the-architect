/**
 * @jest-environment node
 */
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../app/app';
import { Users } from '../../app/controller/user.controller';
import User from '../../app/models/user.model';
import { generateAuthToken } from '../../app/utils/generateHash';

let fakeUser: { name: string; email: string; password: string };
describe('- USER API TESTING ', () => {
    beforeAll(async () => {
        fakeUser = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        for (let i = 0; i < 5; i++) {
            const newUser = new User({
                id: String(i),
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
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty("token");
    }, 7000);

    it('GET /api/user should fetch all users', async () => {
        const res = await request(app).get('/api/user');
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('data');
    }, 7000);

    it('PUT /api/user/:id should update user using id', async () => {
        let user = Users[3]
        let token = await generateAuthToken({ id: user.id, email: user.email })
        const res = await request(app)
            .put(`/api/user/${user.id}`)
            .send({ name: "updated name", email: "test@updated.com", password: "passord@updated" })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 7000);

    it('DELETE /api/user/:id should delete user using id', async () => {
        let user = Users[1]
        let token = await generateAuthToken({ id: user.id, email: user.email })
        const res = await request(app)
            .delete(`/api/user/${user.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 7000);

    it('NEGATIVE POST /api/user sending existed email so should not create new user', async () => {
        const res = await request(app)
            .post('/api/user')
            .send({ ...fakeUser, email: Users[1].email })
        expect(res.status).toBe(StatusCodes.CONFLICT);
    }, 7000);

    it('NEGATIVE DELETE /api/user/:id sending non existed id so should cant delete user', async () => {
        let user = Users[1]
        let token = await generateAuthToken({ id: user.id, email: user.email })
        const res = await request(app)
            .delete(`/api/user/43234234`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
    }, 7000);


    afterAll(() => {
        Users.length = 0;
      });
});

