import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

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
        return res.status(400).send(e.flatten());
    }
};
