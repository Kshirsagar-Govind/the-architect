import { Request } from "supertest";
import app from '../../server';
import { disconnectDB } from "../../app/config/db";
import User, { IUser } from '../../app/models/user.model';
import { generateUserId } from "../../app/utils/generateID";
import { faker } from "@faker-js/faker";
import request from "supertest";
import httpStatusCodes from "http-status-codes";
import { generateAuthToken } from "../../app/utils/generateHash";
describe('AUTH API TEST CASES->\n', () => {
    let newUser: IUser;
    let token = '';
    let password = 'my_old_password'
    let refresh_token = '';
    beforeAll(async () => {
        newUser = new User({
            id: generateUserId(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: password
        })
        await newUser.hashPassword();
        let use = await newUser.save();
        token = await generateAuthToken({ id: use.id, email: use.email });
        refresh_token = await generateAuthToken({ id: use.id, email: use.email });

    })

    it('POST /api/auth/login USER LOGIN TEST', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: newUser.email, password })
        expect(res.status).toBe(httpStatusCodes.OK);
        expect(res.body).toHaveProperty('token');
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

    // it('POST /api/auth/logout USER LOGOUT TEST', async () => {
    //     const res = await request(app)
    //         .post('/api/auth/logout')
    //         .send({ email: newUser.email, password: newUser.password })
    //         .set('Authorization', `Bearer ${token}`);

    //     expect(res.status).toBe(httpStatusCodes.OK);
    //     expect(res.body).toHaveProperty('message');
    // })
    afterAll(() => {
        disconnectDB()
    })
})