/* import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().nonempty('Name is required'),
        password: z.string().nonempty('Password is required').min(6, 'Password too short - should be 6 chars minimum'),

        email: z.string().nonempty('Email is required').email('Not a valid email')
    })
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        createUserSchema.parse({
            body: req.body
        });
        next();
    } catch (e: any) {
        if (e instanceof ZodError) {
            const validationErrors:any = {};

            return res.status(400).json(e.issues.forEach((issue) => (validationErrors[issue.path] = issue.message)));
        }
        return res.status(400).send({ message: 'internal server error' });
    }
};
 */

import { NextFunction, Request, Response } from 'express';
import { validationResult, check } from 'express-validator';
import UserModel from '../models/user.model';

export const registerSchema = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Not a valid email')
        .bail()
        .custom(async (email) => {
            const user = await UserModel.findOne({ email });

            if (user) {
                throw new Error('Email is already in use');
            }
        }),
    check('password').notEmpty().withMessage('Password is required').bail().isLength({ min: 5 }).withMessage('password must be at least 5 characters long')
];

export const loginSchema = [
    check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Not a valid email'),

    check('password').notEmpty().withMessage('Password is required')
];
