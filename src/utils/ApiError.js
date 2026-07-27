class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        data = null
    ) {
        super(message);

        this.name = this.constructor.name;

        this.statusCode = statusCode;
        this.success = false;
        this.isOperational = true;

        this.errors = errors;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;