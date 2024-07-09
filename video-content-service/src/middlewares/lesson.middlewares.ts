import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //  authentication
    // if () {
    //     next();
    // } else {
    //     res.status(401).send({ error: 'Not authenticated' });
    // }
};
