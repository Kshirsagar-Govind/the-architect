import request from "supertest"
import app from "../../server"
import TaskModel, { ITask } from "../../app/models/tasks.model";
import { generateRowId, generateUserId } from "../../app/utils/generateID";
import mongoose from "mongoose";
import httpStatusCode from "http-status-codes";
import { generateAuthToken } from "../../app/utils/generateHash";
import { faker } from "@faker-js/faker";

describe('PROJECT TASK API TESTING', () => {
    let token = '';
    let projectId = new mongoose.Types.ObjectId();
    let newTask: ITask;
    let createdTask: ITask | null = null;
    beforeAll(async () => {
        newTask = new TaskModel({
            id: generateRowId(),
            projectId: projectId,
            owner: new mongoose.Types.ObjectId(),
            title: 'Testing',
            desc: 'test',
            type: 'type 1',
            priority: "high",
            versions: [],
            dueDate: new Date(),
            status: 'assigned'
        });
        createdTask = await newTask.save();
        token = await generateAuthToken({ id: generateUserId(), email: faker.internet.email })
    }, 10000)

    it('GET /api/project/task fetch all tasks using project id', async () => {
        const res = await request(app)
            .get(`/api/project/${projectId}/tasks`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(httpStatusCode.OK);
    })

    it('POST /api/project/:id/task create new project task', async () => {
        const res = await request(app)
            .get(`/api/project/${projectId}/task`)
            .send({
                projectId: newTask.projectId,
                owner: newTask.owner,
                title: newTask.title,
                dueDate: newTask.dueDate
            })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(httpStatusCode.CREATED);
    })

    it('PUT /api/project/:id/task/:id update project task', async () => {
        const res = await request(app)
            .get(`/api/project/${projectId}/task`)
            .send({
                projectId: newTask.projectId,
                owner: newTask.owner,
                title: 'Updated test',
                dueDate: new Date('01/01/2027')
            })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(httpStatusCode.OK);
    })

    it('PUT /api/project/:id/assign-task assign task to a member', async () => {
        const res = await request(app)
            .get(`/api/project/${projectId}/assign-task`)
            .send({
                owner: new mongoose.Types.ObjectId()
            })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(httpStatusCode.OK);
    })

    afterAll(() => { })
})