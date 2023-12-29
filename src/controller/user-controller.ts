import express, { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../utility/custome-error';
import { validateObjectId } from '../utility';
import { createUser } from '../service/user-service';


export default function userController(app:any) {
    const user_route = express.Router();
    app.use('/users', user_route);
    user_route.use((req:Request, res:Response, next:NextFunction) => {
        next()
        create(user_route)
        getUsers(user_route);
        getUserById(user_route);
    })
}

function create(route:any) {
    route.post('/', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const body = req.body;
            if(
                !Object.keys(!body).length
            )throw new BadRequestException("body missing!");
            const response = await createUser(body);
            res.status(201).send(response);
        } catch (error) {
            next(error)
        }
    })
}

function getUsers(route:any) {
    route.get('/', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            res.send(`user ${id}`);
        } catch (error) {
            next(error)
        }
    });
}

function getUserById(route:any) {
    route.get('/:id', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if(!validateObjectId(id))throw new BadRequestException();
            // write db logic
            res.send(`user ${id}`);
        } catch (error) {
            next(error)
        }
    })
}