import express, { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../utility/custome-error';
import { validateObjectId } from '../utility';
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../service/user-service';


export default function userController(app:any) {
    const user_route = express.Router();
    app.use('/users', user_route);
    user_route.use((req:Request, res:Response, next:NextFunction) => {
        create(user_route)
        getAll(user_route);
        getById(user_route);
        updateById(user_route);
        deletById(user_route);
        next()
    })
}

function create(route:any) {
    route.post('/', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const body = req.body;
            if(
                !Object.keys(body).length
            )throw new BadRequestException("body missing!");
            const response = await createUser(body);
            res.status(201).send(response);
        } catch (error) {
            next(error)
        }
    })
}

function getAll(route:any) {
    route.get('/', async (req: Request, res:Response, next: NextFunction) => {
        try {
            let users = await getAllUsers();
            res.send(users);
        } catch (error) {
            next(error)
        }
    });
}

function getById(route:any) {
    route.get('/:id', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if(!validateObjectId(id))throw new BadRequestException("Id is not valid");
            const _user = await getUserById(id)
            res.send(_user);
        } catch (error) {
            next(error)
        }
    })
}

function updateById(route:any) {
    route.put('/:id', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const body = req.body;
            if(!validateObjectId(id))throw new BadRequestException("Id is not valid");
            if(!Object.keys(body).length)throw new BadRequestException("body missing!");
            const _user = await updateUserById(id, body);
            res.send(_user);
        } catch (error) {
            next(error)
        }
    })
}

function deletById(route:any) {
    route.delete('/:id', async (req: Request, res:Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if(!validateObjectId(id))throw new BadRequestException("Id is not valid");
            await deleteUserById(id);
            res.status(204).send();
        } catch (error) {
            next(error)
        }
    })
}