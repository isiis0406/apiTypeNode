import { Express, Request, Response } from "express"
import { createUserHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.schema";
import { requireUser } from "./middleware/requireUser";

function routes(app:Express){
    app.get('/healthCheck', (req:Request, res: Response) => {
        res.sendStatus(200);
    })

    //User
    app.post('/api/users', validate(createUserSchema), createUserHandler);
    //Session
    app.post('/api/sessions', validate(createSessionSchema),  createSessionHandler);
    app.get('/api/sessions', requireUser, getUserSessionsHandler);
    app.delete('/api/sessions', requireUser, deleteSessionHandler);

}

export default routes