import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";
import config  from "config";

export const createSession = async (userId: string, userAgent: string) => {
    const session = await SessionModel.create({
        user: userId,
        userAgent
    });

    return session.toJSON();
}

export const findSessions = async  (query: FilterQuery<SessionDocument>) => {
    return SessionModel.find(query).lean();
}

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
    return SessionModel.updateOne(query);
}

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
    // Decode the refresh token
    const { decoded } = await verifyJwt(refreshToken);

    if (!decoded || !get(decoded, '_id')) return false;

    // Find the session
    const session = await SessionModel.findById(get(decoded, 'session'));

    // Make sure the session is still valid
    if (!session || !session.valid) return false;

    // Find the user
    const user = await findUser({ _id: session.user });
    
    if (!user) return false;

    // Re-issue a new access token
    const accessToken = await signJwt({
        user,
        session: session._id,
    }, {
        expiresIn: config.get('accessTokenTtl') //15 minutes
    })

    return accessToken;
}