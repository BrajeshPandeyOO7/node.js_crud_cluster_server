import { NextFunction, Request, Response, Router } from "express";
import userController from "../controller/user-controller";

export default function GloblApiRouting(app:any) { // We are handling all route from here we can add any middleware if need!
    LoggerMiddleware(app);
    const api_route = Router()
    app.use('/api',api_route);
    api_route.use((req:Request, res:Response, next:NextFunction) => {
        next()
        userController(api_route);
    })
    ErrorMiddlewareHandler(app)
}

function LoggerMiddleware(app:any) {
    app.use((req:Request, res:Response, next:NextFunction) => {
        next();
    })
}

function ErrorMiddlewareHandler(app:any) {
    app.use((err:any, req:Request, res:Response, next:NextFunction) => {
        if(err){
            const { statusCode=500, message = "Internal server error"} = err;
            res.status(statusCode).send(message);
        }
    });
}