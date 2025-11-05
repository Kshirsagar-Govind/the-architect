import { generateHash } from '../utils/generateHash';
import { generateUserId } from '../utils/generateID';

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class User implements IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUser) {
    this.id = generateUserId();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  hashPassowrd() {
    this.password = generateHash.call({ round: 10 }, this.password);
  }
}
