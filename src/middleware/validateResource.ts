import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        next(); // Pass to the next middleware
    } catch (e:any) {
        return res.status(400).send(e.errors); // Send the errors
    }
}

export default validate;