import { Router, Request, Response } from "express";
import { getProduct, getProducts, newProduct, removeProduct, searchProducts, updateProduct } from "../models/products.model";
import { IProductEditData, IProductFilterPayload, ProductCreatePayload } from "@Shared/types";
import { throwServerError } from "../helper";

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.render("products", {
            items: products,
            queryParams: {}
        });
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.get('/search', async (req: Request<{}, {}, {}, IProductFilterPayload>,res: Response) => {
    try {
        const products = await searchProducts(req.query);
        res.render("products", {
            items: products,
            queryParams: req.query
        });
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.get("/add-product", async (req: Request, res: Response) => {
    try {
        res.render("product/add-product");
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.get('/:id', async (req: Request<{ id: string }>,res: Response) => {
    try {
        const product = await getProduct(req.params.id);
          
        if (product) {
            res.render("product/product", {
                item: product[0]
            });
        } else {
            res.render("product/empty-product", {
                id: req.params.id
            });
        }
    } catch (e) {
        
        throwServerError(res, e);
    }
});
productsRouter.get('/remove-product/:id', async (req: Request<{ id: string }>,res: Response) => {
    try {
        if (req.session.username !== "admin") {
            res.status(403);
            res.send("Forbidden");
            return;
        }

        await removeProduct(req.params.id);
        res.redirect(`/${process.env.ADMIN_PATH}`);
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.post('/save/:id', async (req: Request<{ id: string }, {}, IProductEditData>,res: Response) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        res.redirect(`/${process.env.ADMIN_PATH}/${req.params.id}`);
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.post('/new-product', async (req: Request<ProductCreatePayload>,res: Response) => {
    try {
        
        const { title, discription, price } = req.body

        const new_Product = await newProduct(title, discription, Number(price));
        res.redirect(`/${process.env.ADMIN_PATH}`);
    } catch (e) {
        throwServerError(res, e);
    }
});