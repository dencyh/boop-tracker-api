export class ApiError extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors = []) {
    super(<string>message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "User is not authorized");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}
