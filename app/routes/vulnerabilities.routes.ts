import express from 'express';
import {createVulnerability, getVulnerabilities, getVulnerability, updateVulnerability,deleteVulnerability,updateVulnerabilitySeverity,updateVulnerabilityStatus, softDeleteVulnerability, VulnerabilityReviewUpdate} from '../controller/vulnerability.controller';
import { asyncHandler } from '../utils/asyncHandler';
import {vulnerabilitySchema} from '../utils/validateSchema';
import {validateBody} from '../middlewares/validate.middleware';
import VerifyToken from '../middlewares/verifyToken.middleware';
const router = express.Router();

router.get('/:projectId', asyncHandler(getVulnerabilities));
router.get('/:projectId/:report_id', asyncHandler(getVulnerability));
router.post('/:projectId' ,VerifyToken,validateBody(vulnerabilitySchema), asyncHandler(createVulnerability));
router.put('/:id', asyncHandler(updateVulnerability));
router.patch('/:id/update-severity', asyncHandler(updateVulnerabilitySeverity));
router.patch('/:id/update-status', asyncHandler(updateVulnerabilityStatus));
router.patch('/:id/update-review-status', asyncHandler(VulnerabilityReviewUpdate));
router.patch('/:id/delete', asyncHandler(softDeleteVulnerability));
router.delete('/:id', asyncHandler(deleteVulnerability));

export default router;