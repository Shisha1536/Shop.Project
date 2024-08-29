import { IAuthRequisites } from "@Shared/types";
import { Request, Response, Router } from "express";
import { IUserRequisitesEntity } from "../../types";
import { client } from "../..";

export const authRouter = Router();

authRouter.post('/', async (
    req: Request<{}, {}, IAuthRequisites>,
    res: Response
) => {
    const { username, password } = req.body;
    const data = await client.query (
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [username, password]
    );

    if (!data.rows?.length) {
        res.status(404);
    }

    res.send();
});