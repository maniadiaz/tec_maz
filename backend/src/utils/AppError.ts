export class AppError extends Error {
    constructor(
        message: string,
        public status = 500,
        public details?: unknown
    ) {
        super(message);
    }
}