/**
 * @jest-environment node
 */
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../server';
// import User, { IUser } from '../../app/models/user.model';
import { generateAuthToken, generateHash } from '../app/utils/generateHash';
import { disconnectDB } from '../app/config/db';
import { execSync } from 'child_process';
import {prisma} from '../app/lib/prisma';
import{Role,} from '@prisma/client'
import { IUser } from '../app/interface';

describe('🧪 USER API TEST CASES ', () => {
    let testUser;
    let existedUser:IUser;
    let updatedUserData:IUser;
    let deleteUserData:IUser;
    let token = '';
    beforeAll(async () => {
        let password =faker.internet.password();

        let new_user = {
            name: "",
            email: faker.internet.email(),
            password: password,
            role: Role.TESTER,
        }

        testUser = await prisma.user.create({data:new_user});
        
        for (let i = 0; i < 5; i++) {
            let password =faker.internet.password();
            const newUser = await prisma.user.create({data:{
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: password,
                role: Role.TESTER,
            }
            });
            if (i == 2) existedUser = newUser;
            if (i == 3) updatedUserData = newUser;
            if (i == 4) deleteUserData = newUser;
        }
        token = await generateAuthToken({ id: testUser.id, email: testUser.email })

    }, 10000);

    it('POST /api/user should create new user', async () => {
        const res = await request(app)
            .post('/api/user')
            .send({
                name: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'TESTER',
            })
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty("token");
    }, 7000);

    it('GET /api/user should fetch all users', async () => {
        const res = await request(app).get('/api/user');
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('data');
    }, 7000);

    it('PUT /api/user/:id should update user using id', async () => {
        let user = updatedUserData;
        const res = await request(app)
            .put(`/api/user/${user.id}`)
            .send({ name: "updated name", email: "updated_"+faker.internet.email(), password: "passord@updated" })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 7000);

    it('DELETE /api/user/:id should delete user using id', async () => {
        let user = deleteUserData;
        const res = await request(app)
            .delete(`/api/user/${user.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 7000);

    it('NEGATIVE POST /api/user sending existed email so should not create new user', async () => {
        const existingUser = existedUser;
        const res = await request(app)
            .post('/api/user')
            .send({
                name: existingUser.name,
                email: existingUser.email, // keep existing email to trigger conflict
                password: existingUser.password,
            });
        expect(res.status).toBe(StatusCodes.CONFLICT);
    }, 7000);

    it('NEGATIVE DELETE /api/user/:id sending non existed id so should cant delete user', async () => {
        const res = await request(app)
            .delete(`/api/user/43234234`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
    }, 7000);

    afterAll(async () => {
        // testUser = await prisma.user.deleteMany();
        await disconnectDB()
    });
});

