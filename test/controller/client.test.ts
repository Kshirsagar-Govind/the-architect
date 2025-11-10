/**
 * @jest-environment node
 */
import request from "supertest";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";
import app from "../../server";
import { generateAuthToken } from "../../app/utils/generateHash";
import { disconnectDB } from "../../app/config/db";
import ClientModel, { IClient } from "../../app/models/client.model";
import UserModel, { IUser } from "../../app/models/user.model";

describe("CLIENT API TEST CASES ->\n", () => {
    let adminUser: IUser;
    let adminToken = "";
    let clientToDelete: IClient;
    let clientToUpdate: IClient;

    beforeAll(async () => {
        // create admin user
        adminUser = new UserModel({
            name: "Admin Tester",
            email: "adminclient@gmail.com",
            password: "itsMeAdmin",
            role: "admin",
        });
        await adminUser.hashPassword();
        const admin = await adminUser.save();

        adminToken = await generateAuthToken({
            id: admin.id,
            email: admin.email,
        });

        // create few clients
        for (let i = 0; i < 5; i++) {
            const newClient = new ClientModel({
                name: faker.name.fullName(),
                email: faker.internet.email(),
                company: faker.company.name(),
                contactNumber: faker.phone.number(),
                address: faker.address.streetAddress(),
            });
            await newClient.save();

            if (i === 3) clientToDelete = newClient;
            if (i === 4) clientToUpdate = newClient;
        }
    }, 10000);

    it("GET /api/client/ <- get all clients", async () => {
        const res = await request(app).get("/api/client");
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it("GET /api/client/:id <- get single client", async () => {
        const res = await request(app)
            .get(`/api/client/${clientToUpdate._id}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data._id).toBe(clientToUpdate._id.toString());
    });

    it("POST /api/client/ <- add new client", async () => {
        const newClient = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            company: faker.company.name(),
            contactNumber: faker.phone.number(),
            address: faker.address.streetAddress(),
        };

        const res = await request(app)
            .post("/api/client")
            .send(newClient)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty("message");
    });

    it("PUT /api/client/:id <- update client using id", async () => {
        const res = await request(app)
            .put(`/api/client/${clientToUpdate._id}`)
            .send({ ...clientToUpdate.toObject(), company: "Updated Test Studio" })
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("message");
    });

    it("DELETE /api/client/:id <- delete client using id", async () => {
        const res = await request(app)
            .delete(`/api/client/${clientToDelete._id}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("message");
    });

    // NEGATIVE CASES
    it("NEGATIVE DELETE /api/client/:id <- should fail with invalid id", async () => {
        const res = await request(app)
            .delete("/api/client/xxxxxxxxxx")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("message");
    });

    it("NEGATIVE GET /api/client/:id <- should fail with invalid id", async () => {
        const res = await request(app)
            .get("/api/client/invalidId123")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });

    afterAll(async () => {
        await disconnectDB();
    });
});
