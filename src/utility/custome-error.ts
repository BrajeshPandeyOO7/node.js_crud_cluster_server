export class BadRequestException extends Error {
    statusCode;
    constructor(message:string = "Bad Request", statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundException extends Error {
    statusCode;
    constructor(message:string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}