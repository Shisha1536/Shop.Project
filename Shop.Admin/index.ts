import express, { Express } from "express";
import { productsRouter } from "./controllers/products.controller";
import layouts from "express-ejs-layouts";
import bodyParser from "body-parser";

export default function (): Express {
    const app = express();
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.set("view engine", "ejs");
    app.set("views", "Shop.Admin/views");
    app.use(layouts);
    app.use(express.static(__dirname + "/public"));

    app.use("/", productsRouter);

    return app;
} 