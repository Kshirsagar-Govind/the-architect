import mongoose from 'mongoose';
import { disconnectDB } from '../../app/config/db';
import app from '../../server';
import request from 'supertest';
import httpStatusCode from 'http-status-codes';
import { generateAuthToken } from '../../app/utils/generateHash';
import { faker } from '@faker-js/faker';
import UserModel, { IUser } from '../../app/models/user.model';

describe('SUBSCRIPTION API TEST CASES -> ', () => {
    let subscriptionId = '';
    let clientId = (new mongoose.Types.ObjectId()).toString();
    let token = '';
    let managerUser: IUser;
    beforeAll(async () => {
        managerUser = new UserModel({
            name: "manager manager",
            email: "manager@gmail.com",
            password: "manager@gmail.com",
            role: "manager",
        });
        managerUser.hashPassword();
        await managerUser.save();
        token = await generateAuthToken({ id: managerUser.id, email: managerUser.email })

    })
    it('/api/plan/subscription/:clientId GET CLIENT SUBSCRIPTION DATA ', async () => {
        const res = await request(app)
            .get(`/api/plan/subscription/${clientId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(httpStatusCode.OK);
        expect(res.body).toHaveProperty('message', 'Fetched!');
    });

    it('/api/plan/subscription/:clientId ADD CLIENT SUBSCRIPTION', async () => {
        const res = await request(app)
            .post(`/api/plan/subscription/${clientId}`)
            .send({ plan: 'basic', paymentStatus: 'in-progress' })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(httpStatusCode.CREATED);
        expect(res.body).toHaveProperty('message');
        subscriptionId = res.body.data._id;
    });

    it('/api/plan/subscription/:subscriptionId PATCH CLIENT SUBSCRIPTION DATA',async()=>{
            const res = await request(app)
        .patch(`/api/plan/subscription/${subscriptionId}`)
        .send({paymentStatus:'paid'})
        .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(httpStatusCode.OK);
        expect(res.body).toHaveProperty('message');
    });

    afterAll(async () => {
        disconnectDB();
    })
})