import express, { Express } from "express";
import { commentsRouter } from "./src/api/comments-api"
import { productsRouter } from "./src/api/products-api";
import { ICommentEntity } from "@Shared/types";

export let client: ICommentEntity | null;

export default function (dbConnection): Express {
    const app = express();
    app.use(express.json());

    client = dbConnection;

    app.use("/comments", commentsRouter);
    app.use("/products", productsRouter);

    return app;
}