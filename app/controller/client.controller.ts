import { Request, Response } from 'express';
import ClientModel from '../models/client.model';
import ErrorHandler from '../utils/errorHandler';
import httpStatusCode from 'http-status-codes';
import mongoose from 'mongoose';
import Session from '../models/session.model';
import { generateAuthToken, verifyPassword } from '../utils/generateHash';

export const loginClient = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const client = await ClientModel.findOne({ email });
    if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const passwordCorrect = await verifyPassword(password, client.password);
    if (!passwordCorrect) throw new ErrorHandler({ errorMessage: "Invalid Credentials", statusCode: httpStatusCode.BAD_REQUEST })
    let token = await generateAuthToken({ id: client.id, email: client.email });
    let refresh_token = await generateAuthToken({ id: client.id, email: client.email });
    let newSession = new Session({ refresh_token, user_id: client.id });
    await newSession.save();
    return res.status(httpStatusCode.OK).json({ message: 'Loggin Successful', token, refresh_token })
}

export const getClients = async (req: Request, res: Response) => {
    const email = String(req.query.email || '');
    const name = String(req.query.name || '');
    const company = String(req.query.company || '');
    let data = [];
    if (email) {
        data = await ClientModel.find({
            email: { $regex: email, $options: 'i' } // 'i' → case-insensitive
        });
    }
    else if (company) {
        data = await ClientModel.find({
            company: { $regex: company, $options: 'i' } // 'i' → case-insensitive
        });
    }
    else if (name) {
        data = await ClientModel.find({
            name: { $regex: name, $options: 'i' } // 'i' → case-insensitive
        });
    } else data = await ClientModel.find();
    res.status(200).json({ success: true, data });
};

export const getClientById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const client = await ClientModel.findById(id);
    if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
};

export const createNewClient = async (req: Request, res: Response) => {
    const {
        name,
        email,
        password,
        company,
        contactNumber,
        address,
    } = req.body;

    const addNewClient = new ClientModel({
        name,
        email,
        password,
        company,
        contactNumber,
        address,
    });
    await addNewClient.hashPassword();
    let client = await addNewClient.save();

    res.status(201).json({ success: true, message: 'Client created successfully', data: client });
};

export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await ClientModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
        throw new ErrorHandler({ statusCode: httpStatusCode.NOT_FOUND, errorMessage: 'Client not found' })
    }
    res.status(200).json({ success: true, message: 'Client updated successfully', data: updated });
};

export const deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ErrorHandler({ statusCode: httpStatusCode.BAD_REQUEST, errorMessage: 'Invalid client ID' })
    }
    const deleted = await ClientModel.findByIdAndDelete(id);
    if (!deleted) {
        throw new ErrorHandler({ statusCode: httpStatusCode.NOT_FOUND, errorMessage: 'Client not found' })
    }
    res.status(200).json({ success: true, message: 'Client deleted successfully' });
};
