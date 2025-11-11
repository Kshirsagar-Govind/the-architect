import { Request, Response } from 'express';
import ClientModel from '../models/client.model';
import ErrorHandler from '../utils/errorHandler';
import httpStatusCode from 'http-status-codes';
import mongoose from 'mongoose';

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
    const client = await ClientModel.create(req.body);
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
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ErrorHandler({ statusCode: httpStatusCode.BAD_REQUEST, errorMessage: 'Invalid client ID' })
    }
    const deleted = await ClientModel.findByIdAndDelete(id);
    if (!deleted) {
        throw new ErrorHandler({ statusCode: httpStatusCode.NOT_FOUND, errorMessage: 'Client not found' })
    }
    res.status(200).json({ success: true, message: 'Client deleted successfully' });
};
