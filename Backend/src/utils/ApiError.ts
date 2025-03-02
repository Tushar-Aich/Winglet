class ApiError extends Error {
    statusCode: number
    data: null
    success: boolean
    error: any[]

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        error: any[] = [],
        stack: string = ""
    ) {

        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.success = false;
        this.error = error;

        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

        Object.setPrototypeOf(this, ApiError.prototype)
    }
}

export { ApiError }