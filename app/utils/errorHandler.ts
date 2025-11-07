import { StatusCodes } from 'http-status-codes';

interface IError {
  statusCode?: number;
  errorMessage: string;
}

export default class ErrorHandler extends Error {
  statusCode: number;
  errorMessage: string;

  constructor(data: IError) {
    super(data.errorMessage);
    this.statusCode = data.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.errorMessage = data.errorMessage || 'Something went wrong';

    // Required for extending built-ins like Error in TS
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }

  // ✅ Static factory helpers
  static badRequest(msg: string): ErrorHandler {
    return new ErrorHandler({
      statusCode: StatusCodes.BAD_REQUEST,
      errorMessage: msg,
    });
  }

  static notFound(msg: string): ErrorHandler {
    return new ErrorHandler({
      statusCode: StatusCodes.NOT_FOUND,
      errorMessage: msg,
    });
  }

  static unauthorized(msg: string): ErrorHandler {
    return new ErrorHandler({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorMessage: msg,
    });
  }

  static serverError(msg: string="INTERNAL SERVER ERROR CCURED"): ErrorHandler {
    return new ErrorHandler({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage: msg,
    });
  }
}
