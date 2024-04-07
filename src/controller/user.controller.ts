
import { Request, Response } from "express"
import logger from '../utils/logger';
import { createUser, UserInput } from "../service/user.service";
import { omit } from "lodash";
export const createUserHandler = async (req: Request<{}, {}, UserInput>, res: Response) => {
    try {
        const user = await createUser(req.body);
        return res.status(201).send(omit(user.toJSON(), "password"));
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}
