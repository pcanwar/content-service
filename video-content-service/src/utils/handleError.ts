
import { Response } from 'express';

export const handleError = (res: Response, error: unknown, message: string = "err occurred") => {
    console.error(message, error);
    if (error instanceof Error) {
        res.status(400).send({ error: error.message });
    } else {
        res.status(400).send({ error: message });
    }
}
