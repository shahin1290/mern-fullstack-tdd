import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: { status: number; message: string; errors: [] }, req: Request, res: Response, next: NextFunction) => {
    const { status, message, errors } = err;
    let validationErrors: any;
    if (errors) {
        validationErrors = {};
        errors.forEach((error: { param: string; msg: string }) => (validationErrors[error.param] = error.msg));
    }
    res.status(status).send({
        path: req.originalUrl,
        timestamp: new Date().getTime(),
        message,
        validationErrors
    });
};

export default errorHandler;
