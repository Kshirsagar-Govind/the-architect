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
  vulnerabilityType: Joi.string().default("General"),
  desc: Joi.string().required().error(errorThrow("Description is required")),
  severity: Joi.string().required().error(errorThrow("Severity is required")),
  status: Joi.string().required().error(errorThrow("Status is required")),
  stepToReproduce: Joi.string().required().error(errorThrow("Steps to reproduce required")),
  proofOfConcept: Joi.string().required().error(errorThrow("Proof of concept required")),
  impact: Joi.string().required().error(errorThrow("Impact required")),
  affectedEndpoint: Joi.string().required().error(errorThrow("Effected Endpoint required")),
  recommendation: Joi.string().required().error(errorThrow("Recommendation required")),
  cvss: Joi.number().optional().default(1),
  tags: Joi.array().optional().default(""),
});
