import { Request, Response, Router } from "express";
import { IAuthRequisites } from "@Shared/types";
import { client } from "../../index";
import { IUserRequisitesEntity } from "../../types";
import { body, validationResult } from "express-validator";

export const authRouter = Router();

authRouter.post(
    '/',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (
        req: Request<{}, {}, IAuthRequisites>,
        res: Response
    ) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            res.json({ errors: errors.array() });
            return;
        }

        const { username, password } = req.body;
        const [data] = await client.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (!data?.length) {
            res.status(404);
        }

        res.send();
    });