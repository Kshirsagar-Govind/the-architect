/**
 * @jest-environment node
 */
import { faker } from "@faker-js/faker";
import Project, { IProject } from "../../app/models/project.model";
import request from "supertest";
import app from "../../server";
import { StatusCodes } from "http-status-codes";
import { generateAuthToken } from "../../app/utils/generateHash";
import { generateProjectId } from "../../app/utils/generateID";
import { disconnectDB } from "../../app/config/db";
import UserModel, { IUser } from "../../app/models/user.model";
import mongoose from "mongoose";

let newProject: {
  id: string;
  title: string;
  desc: string;
  client: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  members: [mongoose.Types.ObjectId];
};

describe("PROJECT API TEST CASES ->\n", () => {
  let managerUser: IUser;
  let adminUser: IUser;

  let deleteProject: IProject;
  let updatedProjectData: IProject = {} as IProject;
  let managerToken = "";
  let adminToken = "";

  beforeAll(async () => {
    newProject = {
      id: generateProjectId(),
      title: faker.vehicle.vehicle(),
      desc: faker.lorem.paragraph(2),
      client: new mongoose.Types.ObjectId(),
      manager: new mongoose.Types.ObjectId(),
      members: [new mongoose.Types.ObjectId()],
    };

    managerUser = new UserModel({
      name: "manager manager",
      email: "manager@gmail.com",
      password: "manager@gmail.com",
      role: "manager",
    });
    await managerUser.hashPassword();
    const manager = await managerUser.save();

    adminUser = new UserModel({
      name: "admin admin",
      email: "admin@gmail.com",
      password: "itsMeAdmin",
      role: "admin",
    });
    await adminUser.hashPassword();
    const admin = await adminUser.save();

    // Create sample projects
    for (let i = 0; i < 5; i++) {
      const newProj = new Project({
        title: faker.vehicle.vehicle(),
        desc: faker.vehicle.manufacturer(),
        client: new mongoose.Types.ObjectId(),
        manager: new mongoose.Types.ObjectId(),
        members: [new mongoose.Types.ObjectId()],
      });
      await newProj.save();

      if (i === 3) deleteProject = newProj;
      if (i === 4) {
        updatedProjectData._id = newProj._id?.toString();
        updatedProjectData.title = newProj.title;
        updatedProjectData.desc = newProj.desc;
        updatedProjectData.client = newProj.client;
        updatedProjectData.manager = newProj.manager;
        updatedProjectData.members = newProj.members;
      }
    }

    managerToken = await generateAuthToken({
      id: manager.id,
      email: manager.email,
    });
    adminToken = await generateAuthToken({
      id: admin.id,
      email: admin.email,
    });
  }, 10000);

  it("GET /project/ <- get all projects", async () => {
    const res = await request(app).get("/api/project");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("data");
  }, 20000);

  it("POST /project/ <- add new project (admin only)", async () => {
    const res = await request(app)
      .post("/api/project")
      .send(newProject)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("PUT /api/project/:id <- update project using _id", async () => {
    const res = await request(app)
      .put(`/api/project/${updatedProjectData._id}`)
      .send({
        ...updatedProjectData,
        title: "updated title",
        desc: "updated desc",
      })
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("DELETE /api/project/:id <- should fail (non-admin unauthorized)", async () => {
    const project = deleteProject;
    const res = await request(app)
      .delete(`/api/project/${project._id}`) // ✅ changed to _id
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("DELETE /api/project/:id <- should delete (admin only)", async () => {
    const project = deleteProject;
    const res = await request(app)
      .delete(`/api/project/${project._id}`) // ✅ changed to _id
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("NEGATIVE DELETE /api/project/:id <- invalid _id should return NOT_FOUND", async () => {
    const invalidId = new mongoose.Types.ObjectId(); // ✅ proper ObjectId format
    const res = await request(app)
      .delete(`/api/project/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("PATCH /api/project/:id/assign-manager <- should assign manager (admin only)", async () => {
    const res = await request(app)
      .put(`/api/project/${updatedProjectData._id}/assign-manager`)
      .send({ manager: managerUser._id?.toString() })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  afterAll(async () => {
    await disconnectDB();
  });
});
