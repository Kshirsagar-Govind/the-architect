import Joi from "joi";
import ErrorHandler from "./errorHandler";
import httpStatusCode from 'http-status-codes';

function errorThrow(message:string) {
  return () => {
    throw new ErrorHandler({
      statusCode: httpStatusCode.BAD_REQUEST,
      errorMessage: message,
    });
  };
}

export const vulnerabilitySchema = Joi.object({
  title: Joi.string().required().error(errorThrow("Title is required")),
  desc: Joi.string().required().error(errorThrow("Description is required")),
  severity: Joi.string().required().error(errorThrow("Severity is required")),
  status: Joi.string().required().error(errorThrow("Status is required")),
  stepToReproduce: Joi.string().required().error(errorThrow("Steps to reproduce required")),
  proofOfConcept: Joi.array().required().error(errorThrow("Proof of concept required")),
  reportedBy: Joi.string().required().error(errorThrow("ReportedBy is required")),
  projectId: Joi.string().required().error(errorThrow("ProjectId is required")),
});
