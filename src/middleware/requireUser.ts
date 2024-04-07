import { NextFunction, Request, Response } from "express";


export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
    // Get the user from the request
    const { user } = res.locals;
    if (!user) {
        return res.status(403).send({ error: 'Unauthorized' });
    }
    return next();
}