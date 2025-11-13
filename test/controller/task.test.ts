// import request from "supertest"
// import app from "../../server"
// import TaskModel, { ITask } from "../../app/models/tasks.model";
// import { generateRowId, generateUserId } from "../../app/utils/generateID";
// import mongoose from "mongoose";
// import httpStatusCode from "http-status-codes";
// import { generateAuthToken } from "../../app/utils/generateHash";
// import { faker } from "@faker-js/faker";
// import ProjectModel, { IProject } from "../../app/models/project.model";
// import UserModel from "../../app/models/user.model";
// import { disconnectDB } from "../../app/config/db";

// describe('PROJECT TASK API TESTING', () => {
//     let token = '';
//     let projectId = '';
//     let taskId = '';
//     let newTask: ITask;
//     let createdTask: ITask | null = null;
//     let newProject: IProject
//     beforeAll(async () => {
//         newProject = new ProjectModel({
//             title: faker.vehicle.vehicle(),
//             desc: faker.vehicle.manufacturer(),
//             client: new mongoose.Types.ObjectId(),
//             manager: new mongoose.Types.ObjectId(),
//             members: [new mongoose.Types.ObjectId()],
//         })
//         await newProject.save();
//         projectId = newProject._id?.toString() || '';
//         newTask = new TaskModel({
//             id: generateRowId(),
//             projectId: projectId,
//             owner: new mongoose.Types.ObjectId(),
//             title: 'Testing',
//             desc: 'test',
//             type: 'type 1',
//             priority: "high",
//             versions: [],
//             dueDate: new Date(),
//             status: 'assigned'
//         });
//         //
//         createdTask = await newTask.save();
//         taskId = createdTask._id?.toString() || '';
//         let testUser = new UserModel({
//             name: faker.name.fullName(),
//             email: faker.internet.email(),
//             password: faker.internet.password(),
//             role: 'member',
//         });
//         await testUser.hashPassword();
//         let fakeUser = await testUser.save();
//         token = await generateAuthToken({ id: fakeUser.id, email: fakeUser.email })
//     }, 10000)

//     it('GET /api/task/:projectId fetch all tasks using project id', async () => {
//         let url = `/api/task/${projectId}`
//         const res = await request(app)
//             .get(url)
//             .set('Authorization', `Bearer ${token}`)
//         expect(res.status).toBe(httpStatusCode.OK);
//     })

//     it('POST /api/task/:projectId create new project task', async () => {
//         const res = await request(app)
//             .post(`/api/task/${projectId}`)
//             .send({
//                 owner: newTask.owner,
//                 title: newTask.title,
//                 dueDate: newTask.dueDate
//             })
//             .set('Authorization', `Bearer ${token}`)
//         expect(res.status).toBe(httpStatusCode.CREATED);
//     })

//     it('PUT /api/task/:taskId update project task', async () => {
//         const res = await request(app)
//             .put(`/api/task/${taskId}`)
//             .send({
//                 owner: newTask.owner,
//                 title: 'Updated test',
//                 dueDate: new Date('01/01/2027')
//             })
//             .set('Authorization', `Bearer ${token}`)
//         expect(res.status).toBe(httpStatusCode.OK);
//     })

//     it('PUT /api/task/:taskId/assign assign task to a member', async () => {
//         const res = await request(app)
//             .put(`/api/task/assign/${taskId}`)
//             .send({
//                 owner: new mongoose.Types.ObjectId()?.toString() || ''
//             })
//             .set('Authorization', `Bearer ${token}`)
//         expect(res.status).toBe(httpStatusCode.OK);
//     })

//     afterAll(async () => {
//         await disconnectDB()
//     })
// })