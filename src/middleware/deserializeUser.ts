import { Request, Response, NextFunction } from 'express';
import {get} from 'lodash';
import { verifyJwt } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    
    // Get the access token from the request headers
    const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');
    
    // Get the refresh token from the request headers
    const refreshToken = get(req, 'headers.x-refresh');

    if (!accessToken) {
        return next();
    }

    // Decode the access token
    const { decoded, expired } = await verifyJwt(accessToken);
    
    const user = get(decoded, 'user', null);
    
    
    if(decoded){
        res.locals.user = user;
        return next();
    }
    if(expired  && refreshToken){
        const newAccessToken = await reIssueAccessToken({ refreshToken: refreshToken[0] });
        if(newAccessToken){
            res.setHeader('x-access-token', newAccessToken);
            const { decoded } = await verifyJwt(newAccessToken);
            const user = get(decoded, 'user', null);
            res.locals.user = user;
        }
    }
    return next();
}