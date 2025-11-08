/**
 * @jest-environment node
 */
import { Faker, faker } from "@faker-js/faker"
import Project, { IProject } from "../../app/models/project.model"
import request from "supertest"
import app from "../../server"
import { StatusCodes } from "http-status-codes"
import { generateAuthToken } from "../../app/utils/generateHash"
import { generateProjectId } from "../../app/utils/generateID"
import { disconnectDB } from "../../app/config/db"
let newProject: {
    id: string,
    title: string,
    desc: string,
    owner: string,
    members: Array<string>
};

describe('PROJECT API TEST CASES->\n', () => {
    let deleteProject: IProject;
    let updatedProjectData: IProject;
    let token='';
    beforeAll(async () => {
        newProject = {
            id: generateProjectId(),
            title: faker.vehicle.vehicle(),
            desc: faker.lorem.paragraph(2),
            owner: faker.vehicle.manufacturer(),
            members: (faker.lorem.words(3)).split(' '),
        }
        for (let i = 0; i < 5; i++) {
            let newProject = new Project({
                title: faker.vehicle.vehicle(),
                desc: faker.vehicle.manufacturer(),
                owner: faker.vehicle.manufacturer(),
                members: (faker.lorem.words(3)).split(' '),
            })
            await newProject.save();
            if (i == 3) deleteProject = newProject;
            if (i == 4) updatedProjectData = newProject;
        }        
        token = await generateAuthToken({ id: '123', email: 'test@email.com' });
    }, 5000);

    it('GET /project/ <- get all projects', async () => {
        const res = await request(app)
            .get('/api/project')
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('data');
    }, 20000)

    it('POST /project/ <- add new project', async () => {
        const res = await request(app)
            .post('/api/project')
            .send(newProject)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty('message');
    }, 20000)

    it('PUT /api/project/:id should update project using id', async () => {
        let project = updatedProjectData
        const res = await request(app)
            .put(`/api/project/${project.id}`)
            .send({ ...project, title: "updated title", desc: "updated desc" })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 5000);


    it('DELETE /api/project/:id should delete project using id', async () => {
        let project = deleteProject;
        const res = await request(app)
            .delete(`/api/project/${project.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 5000);

    // negative cases
    it('NEGATIVE DELETE /api/project/:id should not delete project and send not found error', async () => {
        const res = await request(app)
            .delete(`/api/project/xxxxxxxxxx`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty('message')
    }, 5000);
    afterAll(()=>{
        disconnectDB()
    })
})