require('dotenv').config();
import { Express } from "express";
import { connectDb } from "./Server/services/db";
import { initServer } from "./Server/services/server";
import { ICommentEntity } from "@Shared/types";
import API from "./Shop.API";
import ADMIN from "./Shop.Admin";

export let server: Express;
export let client: ICommentEntity | null;

const ROOT_PATH = "/api";

async function launchApplication() {
    server = initServer();
    client = await connectDb(process.env.PGUSER,process.env.PGHOST, process.env.PGDATABASE, process.env.PGPASSWORD, process.env.PGPORT);
    initRouter();
}
function initRouter() {
    const Api = API(client);
    server.use("/api", Api);

    const Admin = ADMIN();
    server.use("/admin", Admin);

    server.use("/", (_, res) => {
        res.send("React App");
    });
}


launchApplication();