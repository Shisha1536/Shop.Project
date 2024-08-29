import express, { Express } from "express";
import { commentsRouter } from "./src/api/comments-api"
import { productsRouter } from "./src/api/products-api";
import { ICommentEntity } from "@Shared/types";
import { authRouter } from "../Shop.Admin/controllers/auth.controller";

export let client: ICommentEntity | null;

export default function (dbConnection): Express {
    const app = express();
    app.use(express.json());

    client = dbConnection;

    app.use("/comments", commentsRouter);
    app.use("/products", productsRouter);
    app.use("/auth", authRouter);

    return app;
}