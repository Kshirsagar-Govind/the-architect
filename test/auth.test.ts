import { Request } from "supertest";
import app from '../server';
import { disconnectDB } from "../app/config/db";
import User from '../app/models/user.model';
import { generateUserId } from "../app/utils/generateID";
import { faker } from "@faker-js/faker";
import request from "supertest";
import httpStatusCodes from "http-status-codes";
import { generateAuthToken } from "../app/utils/generateHash";
import { IUser } from "../app/interface";
import { prisma } from "../app/lib/prisma";
import { Role } from "@prisma/client";
import { generateHash } from "../app/utils/generateHash";

describe('🧪 AUTH API TEST CASES->\n', () => {
    let newUser: IUser;
    let token = '';
    let password = 'my_old_password'
    let refresh_token = '';
    beforeAll(async () => {
        let hashed = await generateHash.call({ round: 10 }, password);
        newUser = await prisma.user.create({
            data: {
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: hashed,
                role: Role.TESTER
            }
        })
        token = await generateAuthToken({ id: newUser.id, email: newUser.email });
        // refresh_token = await generateAuthToken({ id: newUser.id, email: newUser.email });

    })

    it('POST /api/auth/login USER LOGIN TEST', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: newUser.email, password })
        expect(res.status).toBe(httpStatusCodes.OK);
        expect(res.body).toHaveProperty('token');
        // console.log(res.body.refresh_token,'=======');
        refresh_token=res.body.refresh_token;
    })

    it('POST /api/auth/reset-password PASSWORD RESET TEST', async () => {
        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({ oldPassword: password, newPassword: 'my_new_password' })
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(httpStatusCodes.OK)
        expect(res.body).toHaveProperty("message", "Password updated successfully!")
    })

    it('POST /api/auth/refresh-token TOKEN REFRESH TEST', async () => {
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .send({ refresh_token: refresh_token });
        expect(res.status).toBe(httpStatusCodes.OK);
        expect(res.body).toHaveProperty('message');
    })

    it('POST /api/auth/forget-password FORGET PASSWORD TEST', async () => {
        const res = await request(app)
            .post('/api/auth/forget-password')
            .send({ email: newUser.email });
        expect(res.status).toBe(httpStatusCodes.OK);
        expect(res.body).toHaveProperty('message');
    })

    it('POST /api/auth/logout USER LOGOUT TEST', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .send({ email: newUser.email })
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(httpStatusCodes.OK);
        expect(res.body).toHaveProperty('message');
    })

    afterAll(async () => {
        await disconnectDB()
    })
})