const bcrypt = require('bcrypt');
//import { CreateUserInput } from './../middleware/validateUser';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticationException } from '../error/AuthenticationException';
import { ForbiddenException } from '../error/ForbiddenException';
import { ValidationException } from '../error/ValidationException';
import UserModel from '../models/user.model';
import { createUser } from '../service/user.service';

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new (ValidationException as any)(errors.array()));
    }
    try {
        await createUser(req.body);
        return res.send({ message: 'User created Successfully' });
    } catch (err: any) {
        next(err);
    }
}
export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
    return next(new (ForbiddenException as any)('not authorized'));
}

export async function signinHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new (AuthenticationException as any)(errors.array()));
    }
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return next(new (AuthenticationException as any)());
        }

        const match = await bcrypt.compare(password, user.password);

        console.log(match);

        if (!match) {
            return next(new (AuthenticationException as any)());
        }

        return res.send({ id: user._id, name: user.name });
    } catch (error) {}
}
