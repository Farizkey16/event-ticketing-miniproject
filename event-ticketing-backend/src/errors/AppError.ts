class AppError {
    public statusCode: number;
    public readonly success: boolean;
    public message: string;

    constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
        this.success = false;
    }

}

export default AppError;