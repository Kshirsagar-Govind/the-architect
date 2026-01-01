/**
 * @jest-environment node
 */
import { faker } from "@faker-js/faker";
import Project from "../../app/models/project.model";
import request from "supertest";
import app from "../../server";
import { StatusCodes } from "http-status-codes";
import { generateAuthToken } from "../../app/utils/generateHash";
import { generateProjectId } from "../../app/utils/generateID";
import { disconnectDB } from "../../app/config/db";
import UserModel, { IUser } from "../../app/models/user.model";
import mongoose from "mongoose";
import { IProject } from "../../app/interface";
import { prisma } from "../../app/lib/prisma";
import { Role, ProjectStatus, ProjectTestingType, ProjectScope, Environment, ProjectType, TestingType } from "@prisma/client";

let newProject: {
  id: string;
  title: string;
  desc: string;
  projectType: string;
  client: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  appFile: {
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
  };
};

describe("PROJECT API TEST CASES ->\n", () => {
  let managerUser: IUser;
  let adminUser: IUser;
  let memberUser: IUser;

  let deleteProject;
  let updatedProjectData;
  let managerToken = "";
  let adminToken = "";

  beforeAll(async () => {
    const clientUser = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: Role.CLIENT,
      }
    });

    const newUser = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: Role.CLIENT,
      }
    });

    /* ---------- Users ---------- */
    const memberUser = await prisma.user.create({
      data: {
        name: "member user",
        email: "member@gmail.com",
        password: "member@123",
        role: Role.TESTER, // enum वापर
      },
    });

    const managerUser = await prisma.user.create({
      data: {
        name: "manager manager",
        email: "manager@gmail.com",
        password: "manager@123",
        role: Role.MANAGER,
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: "admin admin",
        email: "admin@gmail.com",
        password: "itsMeAdmin",
        role: Role.ADMIN,
      },
    });

    const project = await prisma.project.create({
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

        testingTypes: {
          create: [
            { type: TestingType.VAPT },
            { type: TestingType.AUTH_TESTING },
          ],
        },
      },
    });





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
      // if (i === 4) updatedProjectData = proj;
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

  // it("PUT /api/project/:id <- update project using _id", async () => {
  //   const res = await request(app)
  //     .put(`/api/project/${updatedProjectData._id}`)
  //     .send({
  //       ...updatedProjectData,
  //       title: "updated title",
  //       desc: "updated desc",
  //     })
  //     .set("Authorization", `Bearer ${managerToken}`);
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toHaveProperty("message");
  // }, 10000);

  // it("DELETE /api/project/:id <- should fail (non-admin unauthorized)", async () => {
  //   const project = deleteProject;
  //   const res = await request(app)
  //     .delete(`/api/project/${project._id}`)
  //     .set("Authorization", `Bearer ${managerToken}`);
  //   expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  //   expect(res.body).toHaveProperty("message");
  // }, 10000);

  // it("DELETE /api/project/:id <- should delete (admin only)", async () => {
  //   const project = deleteProject;
  //   const res = await request(app)
  //     .delete(`/api/project/${project._id}`)
  //     .set("Authorization", `Bearer ${adminToken}`);
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toHaveProperty("message");
  // }, 10000);

  // it("NEGATIVE DELETE /api/project/:id <- invalid _id should return NOT_FOUND", async () => {
  //   const invalidId = new mongoose.Types.ObjectId();
  //   const res = await request(app)
  //     .delete(`/api/project/${invalidId}`)
  //     .set("Authorization", `Bearer ${adminToken}`);
  //   expect(res.status).toBe(StatusCodes.NOT_FOUND);
  //   expect(res.body).toHaveProperty("message");
  // }, 10000);

  // it("PATCH /api/project/:id/assign-manager <- should assign manager (admin only)", async () => {
  //   const res = await request(app)
  //     .put(`/api/project/${updatedProjectData._id}/assign-manager`)
  //     .send({ manager: managerUser._id?.toString() })
  //     .set("Authorization", `Bearer ${adminToken}`);
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toHaveProperty("message");
  // }, 10000);

  // it("PATCH /api/project/:id/assign-members <- should assign member to project (manager only)", async () => {
  //   const res = await request(app)
  //     .put(`/api/project/${updatedProjectData._id}/assign-members`)
  //     .send({ members: [memberUser._id?.toString()] })
  //     .set("Authorization", `Bearer ${managerToken}`);
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toHaveProperty("message");
  // }, 10000);

  afterAll(async () => {
    await disconnectDB();
  });
});
