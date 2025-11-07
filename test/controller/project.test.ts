/**
 * @jest-environment node
 */
import { Faker, faker } from "@faker-js/faker"
import Project from "../../app/models/project.model"
import { Projects } from "../../app/controller/project.controller"
import request from "supertest"
import app from "../../app/app"
import { StatusCodes } from "http-status-codes"
import { generateAuthToken } from "../../app/utils/generateHash"
let newProject = {
    id: "",
    title: "",
    desc: "",
    owner: "",
    members: [''],
}
describe('PROJECT API TEST CASES->\n', () => {

    beforeAll(() => {
        newProject = {
            id: '123132',
            title: faker.vehicle.vehicle(),
            desc: faker.lorem.paragraph(2),
            owner: faker.vehicle.manufacturer(),
            members: (faker.lorem.words(3)).split(' '),
        }
        for (let i = 0; i < 5; i++) {
            let obj = new Project({
                id: String(i),
                title: faker.vehicle.vehicle(),
                desc: faker.vehicle.manufacturer(),
                owner: faker.vehicle.manufacturer(),
                members: (faker.lorem.words(3)).split(' '),
                createdOn: new Date(),
                updatedOn: new Date(),
            })
            Projects.push(obj)
        }
    })

    it('GET /project/ <- get all projects', async () => {
        const res = await request(app)
            .get('/api/project')
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('data');
    }, 7000)

    it('POST /project/ <- add new project', async () => {
        let token = await generateAuthToken({ id: '123', email: 'test@email.com' })
        const res = await request(app)
            .post('/api/project')
            .send(newProject)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty('message');
    }, 7000)

    it('PUT /api/project/:id should update project using id', async () => {
        let project = Projects[2]
        let token = await generateAuthToken({ id: '123', email: 'test@email.com' })
        const res = await request(app)
            .put(`/api/project/${project.id}`)
            .send({...project, title: "updated title", desc: "updated desc" })
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 7000);


    it('DELETE /api/project/:id should delete project using id', async () => {
        let project = Projects[1]
        let token = await generateAuthToken({ id: '123', email: 'test@email.com' })
        const res = await request(app)
            .delete(`/api/project/${project.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message')
    }, 7000);

    // negative cases
    it('NEGATIVE DELETE /api/project/:id should not delete project and send not found error', async () => {
        let token = await generateAuthToken({ id: '123', email: 'test@email.com' })
        const res = await request(app)
            .delete(`/api/project/0909090`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty('message')
    }, 7000);


})