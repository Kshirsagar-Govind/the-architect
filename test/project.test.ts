/**
 * @jest-environment node
 */
import { faker } from "@faker-js/faker";
import Project from "../app/models/project.model";
import request from "supertest";
import app from "../server";
import { StatusCodes } from "http-status-codes";
import { generateAuthToken } from "../app/utils/generateHash";
import { generateProjectId } from "../app/utils/generateID";
import { disconnectDB } from "../app/config/db";
import UserModel, { IUser } from "../app/models/user.model";
import mongoose from "mongoose";
import { IProject } from "../app/interface";
import { prisma } from "../app/lib/prisma";
import { Role, ProjectStatus, ProjectTestingType, ProjectScope, Environment, ProjectType, TestingType } from "@prisma/client";
import { execSync } from "child_process";

describe("🧪 PROJECT API TEST CASES ->\n", () => {
  let managerUser;
  let adminUser;
  let memberUser;
  let newProject;
  let deleteProject;
  let updatedProjectData;
  let managerToken = "";
  let adminToken = "";
  let clientToken = "";

  beforeAll(async () => {
    // execSync("npx prisma migrate reset --force --skip-seed");
    /* ---------- Users ---------- */
    const clientUser = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: Role.CLIENT,
      }
    });

    let password = faker.internet.password();

    let member = {
      name: "member user",
      email: faker.internet.email(),
      password: password,
      role: Role.TESTER,
    };

    let manager = {
      name: "manager manager",
      email: faker.internet.email(),
      password: password,
      role: Role.MANAGER,
    }

    let admin = {
      name: "admin admin",
      email: faker.internet.email(),
      password: password,
      role: Role.ADMIN,
    }


    memberUser = await prisma.user.create({
      data: member,
    });

    managerUser = await prisma.user.create({
      data: manager,
    });

    adminUser = await prisma.user.create({
      data: admin,
    });

    newProject = {
      title: faker.company.name(),
      desc: faker.company.catchPhrase(),
      projectType: ProjectType.WEBSITE,

      clientId: clientUser.id,
      managerId: managerUser.id,

      members: [memberUser.id],

      scope: {
        websiteUrl: faker.internet.url(),
        environment: Environment.PROD,
        authRequired: true,
        allowedDomains: ["example.com"],
        blockedUrls: [],
        testAccounts: {},
      },

      endpoints: [{
        method: "GET",
        path: "",
        description: ""
      }],
      appFile: {
        name: "",
        url: "",
        size: 0,
      },
      testingTypes: [
        { type: TestingType.VAPT },
        { type: TestingType.AUTH_TESTING },
      ],
    };


    for (let i = 0; i < 5; i++) {
      const proj = await prisma.project.create({
        data: {
          title: faker.company.name(),
          desc: faker.company.catchPhrase(),
          projectType: ProjectType.WEBSITE,

          clientId: clientUser.id,
          managerId: managerUser.id,

          members: {
            create: {
              userId: memberUser.id,
            },
          },

          scope: {
            create: {
              websiteUrl: faker.internet.url(),
              environment: Environment.PROD,
              authRequired: true,
              allowedDomains: ["example.com"],
              blockedUrls: [],
              testAccounts: {},
            },
          },

          endpoints: {
            create: [{
              method: "GET",
              path: "",
              description: ""
            }]
          },

          testingTypes: {
            create: [
              { type: TestingType.VAPT },
              { type: TestingType.AUTH_TESTING },
            ],
          },
        },
      });
      if (i === 3) deleteProject = proj;
      if (i === 4) updatedProjectData = proj;
    }


    managerToken = await generateAuthToken({
      id: managerUser.id,
      email: managerUser.email,
      role: managerUser.role
    });

    adminToken = await generateAuthToken({
      id: adminUser.id,
      email: adminUser.email,
      role: managerUser.role
    });
    clientToken = await generateAuthToken({
      id: clientUser.id,
      email: clientUser.email,
      role: clientUser.role
    });
  }, 10000);


  it("GET /project/ <- get all projects", async () => {
    const res = await request(app).get("/api/project");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("data");
  }, 20000);

  it("POST /api/project/ <- add new project (admin only)", async () => {
    const res = await request(app)
      .post("/api/project")
      .send(newProject)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("PUT /api/project/:id <- update project using _id", async () => {
    const res = await request(app)
      .put(`/api/project/${updatedProjectData.id}`)
      .send({
        title: "updated title",
        desc: "updated desc",
      })
      .set("Authorization", `Bearer ${clientToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("PATCH /api/project/:id/delete-project <- should delete (soft delete)", async () => {
    const project = deleteProject;
    const res = await request(app)
      .patch(`/api/project/${project.id}/delete-project`)
      .set("Authorization", `Bearer ${clientToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("DELETE /api/project/:id <- should fail (hard delete non-admin unauthorized)", async () => {
    const project = deleteProject;
    const res = await request(app)
      .delete(`/api/project/${project.id}`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("DELETE /api/project/:id <- should delete (hard delete admin only)", async () => {
    const project = deleteProject;
    const res = await request(app)
      .delete(`/api/project/${project.id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("NEGATIVE DELETE /api/project/:id <- invalid _id should return NOT_FOUND", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/project/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("PATCH /api/project/:id/assign-manager <- should assign manager (admin only)", async () => {
    const res = await request(app)
      .put(`/api/project/${updatedProjectData.id}/assign-manager`)
      .send({ manager: managerUser.id })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("PATCH /api/project/:id/assign-members <- should assign member to project (manager only)", async () => {
    const res = await request(app)
      .put(`/api/project/${updatedProjectData.id}/assign-members`)
      .send({ members: [memberUser.id] })
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("message");
  }, 10000);

  afterAll(async () => {
    await disconnectDB();
    // await prisma.user.deleteMany();
  });
});
