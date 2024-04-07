import { Request, Response } from "express";
import logger from "../utils/logger";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";


export const createSessionHandler = async (req: Request, res: Response) => {
    try {

        // Validate user password
        const user = await validatePassword(req.body);

        if (!user) {
            return res.status(401).send("Invalid email or password")
        }

        // Create a new session
        const session = await createSession(user._id, req.get("user-agent") || "")

        //create an access token
        const accessToken = await signJwt({
            user,
            session: session._id,
        }, {
            expiresIn: config.get('accessTokenTtl') //15 minutes
        })
        //create a refresh token
        const refreshToken = await signJwt({
            user,
            session: session._id,
        }, {
            expiresIn: config.get('refreshTokenTtl') // 1 year
        })
        console.log(accessToken, refreshToken);
        
        // Return access token and refresh token
        res.send({ accessToken, refreshToken });

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}


export const getUserSessionsHandler = async (req: Request, res: Response) => {

    try {

        const userId = res.locals.user._id;
        
        const sessions = await findSessions({ user: userId, valid: true });
        
        return res.send(sessions);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
    const session = res.locals.user.session;

    await updateSession({ _id: session }, { valid: false });
    
    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}