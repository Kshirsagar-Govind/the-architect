import express from 'express';
import {createVulnerability,getVulnerabilities, updateVulnerability,deleteVulnerability,updateVulnerabilitySeverity,updateVulnerabilityStatus} from '../controller/vulnerability.controller';
import { asyncHandler } from '../utils/asyncHandler';
import {vulnerabilitySchema} from '../utils/validateSchema';
import {validateBody} from '../middlewares/validate.middleware';
const router = express.Router();

router.get('/:projectId', asyncHandler(getVulnerabilities));
router.post('/:projectId', validateBody(vulnerabilitySchema), asyncHandler(createVulnerability));
router.put('/:id', asyncHandler(updateVulnerability));
router.put('/:id/update-severity', asyncHandler(updateVulnerabilitySeverity));
router.put('/:id/update-status', asyncHandler(updateVulnerabilityStatus));
router.delete('/:id', asyncHandler(deleteVulnerability));

export default router;