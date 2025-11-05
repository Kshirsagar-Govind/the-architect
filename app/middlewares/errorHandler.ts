import { StatusCodes } from 'http-status-codes';

interface IError {
  statusCode?: number;
  errorMessage: string;
}

export default class GlobalErrorManager extends Error {
  statusCode: number;
  errorMessage: string;

  constructor(data: IError) {
    super(data.errorMessage);
    this.statusCode = data.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.errorMessage = data.errorMessage || 'Something went wrong';

    // Required for extending built-ins like Error in TS
    Object.setPrototypeOf(this, GlobalErrorManager.prototype);
  }

  // ✅ Static factory helpers
  static badRequest(msg: string): GlobalErrorManager {
    return new GlobalErrorManager({
      statusCode: StatusCodes.BAD_REQUEST,
      errorMessage: msg,
    });
  }

  static notFound(msg: string): GlobalErrorManager {
    return new GlobalErrorManager({
      statusCode: StatusCodes.NOT_FOUND,
      errorMessage: msg,
    });
  }

  static unauthorized(msg: string): GlobalErrorManager {
    return new GlobalErrorManager({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorMessage: msg,
    });
  }
}
