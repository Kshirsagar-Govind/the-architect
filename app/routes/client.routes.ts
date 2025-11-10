import express from 'express';
import {
    createNewClient,
    deleteClient,
    getClients,
    updateClient,
    getClientById,
} from '../controller/client.controller';
import VerifyToken from '../middlewares/verifyToken.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityLogs } from '../middlewares/activityLog.middleware';

const route = express.Router();

route.get('/', activityLogs, asyncHandler(getClients));

route.get('/:id', VerifyToken, activityLogs, asyncHandler(getClientById));

route.post('/', activityLogs, asyncHandler(createNewClient));

route.put('/:id', VerifyToken, activityLogs, asyncHandler(updateClient));

route.delete('/:id', VerifyToken, activityLogs, asyncHandler(deleteClient));

export default route;
