import { generateProjectId } from "../utils/generateID";

interface IProject {
    id: String;
    title: String;
    desc: String;
    owner: String;
    members: String[]; // array of user ids
    createdOn: Date;
    updatedOn: Date;
}

export default class Project implements IProject {
    id: String;
    title: String;
    desc: String;
    owner: String;
    members: String[]; // array of user ids
    createdOn: Date;
    updatedOn: Date;

    constructor(data: IProject) {
        this.id = generateProjectId();
        this.title = data.title;
        this.desc = data.desc;
        this.owner = data.owner;
        this.members = data.members;
        this.createdOn = new Date();
        this.updatedOn = new Date();
    }
}