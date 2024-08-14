require('dotenv').config();
import { Express } from "express";
import { connectDb } from "./Server/services/db";
import { initServer } from "./Server/services/server";
import { ICommentEntity } from "@Shared/types";
import ShopAPI from "./Shop.API";
import ShopAdmin from "./Shop.Admin";

export let server: Express;
export let client: ICommentEntity | null;

const ROOT_PATH = "/api";

async function launchApplication() {
    server = initServer();
    client = await connectDb(process.env.PGUSER,process.env.PGHOST, process.env.PGDATABASE, process.env.PGPASSWORD, process.env.PGPORT);
    initRouter();
}
function initRouter() {
    const shopApi = ShopAPI(client);
    server.use("/api", shopApi);

    const shopAdmin = ShopAdmin();
    server.use("/admin", shopAdmin);

    server.use("/", (_, res) => {
        res.send("React App");
    });
}


launchApplication();