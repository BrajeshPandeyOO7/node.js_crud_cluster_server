export class BadRequestException extends Error {
    statusCode;
    constructor(message:string = "Bad Request") {
        super(message);
        this.statusCode = 400;
    }
}

export class NotFoundException extends Error {
    statusCode;
    constructor(message:string) {
        super(message);
        this.statusCode = 404;
    }
}