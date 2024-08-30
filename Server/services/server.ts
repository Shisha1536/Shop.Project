import express, { Express } from "express";

const host = process.env.LOCAL_PATH;
const port = Number(process.env.LOCAL_PORT);

export function initServer(): Express {
    const app = express();

    const jsonMiddleware = express.json();
    app.use(jsonMiddleware);

    app.listen(port, host);

    return app;
}