import { Request, Response, Router } from "express";
import { client } from "../../index";
import { enhanceProductsComments, getProductsFilterQuery, queryImg } from "../helpers";
import { IProductSearchFilter, ProductCreatePayload } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import { INSERT_IMAGE_QUERY, INSERT_IMAGES_QUERY, INSERT_PRODUCT_QUERY } from "../services/queries";

export const productsRouter = Router();

const throwServerError = (res: Response, e: Error) => {
    console.debug(e.message);
    res.status(500);
    res.send("Something went wrong");
}
productsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const productRows = await client.query(
            "SELECT * FROM products"
        );
    
        const commentRows = await client.query(
            "SELECT * FROM comments"
        );
        const imagesRows = await client.query(
            "SELECT * FROM images"
        );
        
        const result = enhanceProductsComments(productRows.rows, commentRows.rows, imagesRows.rows);
        res.send(result);
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.get('/search', async (req: Request<{}, {}, {}, IProductSearchFilter>, res: Response) => {
    try {
        const [query, values] = getProductsFilterQuery(req.query);
        const rows = await client.query(query);
        
        if (!rows.rows?.length) {
            res.status(404);
            res.send(`Products are not found`);
            return;
        }

        const commentRows = await client.query(
            "SELECT * FROM comments"
        );
        const imagesRows = await client.query(
            "SELECT * FROM images"
        );

        const result = enhanceProductsComments(rows.rows, commentRows.rows, imagesRows.rows);
        res.send(result);
    } catch (e) {
        throwServerError(res, e);
    }
});  
productsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const rows = await client.query(
            "SELECT * FROM products WHERE product_id = $1",
            [req.params.id]
        );
        
        if (!rows.rows?.[0]) {
            res.status(404);
            res.send(`Product with id ${req.params.id} is not found`);
            return;
        }
        let product = rows.rows;
        
        const comments = await client.query(
            "SELECT * FROM comments WHERE product_id = $1",
            [req.params.id]
        );
        const images = await client.query(
            "SELECT * FROM images WHERE product_id = $1",
            [req.params.id]
        );
        
        if (comments.rows.length) {
            product[0].comments = comments.rows;
        }

        if (images.rows.length) {
            product[0].images = images.rows;
        }
        for (let index = 0; index < images.rows.length; index++) {
            const element = images.rows[index];
            if (element.main) {
                product[0].thumbnail = element;
            }
        }
        res.send(product);
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.post('/', async (req: Request<{}, {}, ProductCreatePayload>, res: Response) => {
    try {
        const { title, description, price, images } = req.body;
        const id = uuidv4();
        await client.query(
            INSERT_PRODUCT_QUERY,
            [id, title || null, description || null, price || null]
        );
        if (images.length) {
            let queryIMG = queryImg(INSERT_IMAGES_QUERY, images, id);
            await client.query(queryIMG)
        }

        res.status(201);
        res.send(`Product id:${id} has been added!`);
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.post('/:id', async (req: Request, res: Response) => {
    try {
        const { url, main, images } = req.body;
        
        if (images?.length) {
            for (let index = 0; index < images.length; index++) {
                const element = images[index];
                console.log(element)
                let img = await client.query(
                    "DELETE FROM images WHERE image_id = $1",
                    [element]
                );
            }
        } else {
            const id = uuidv4();
            await client.query(
                INSERT_IMAGE_QUERY,
                [id, url, req.params.id , main || null]
            );
            res.status(201);
            res.send(`Product id:${id} has been added!`);
        }
    } catch (e) {
        throwServerError(res, e);
    }
});
productsRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const comments = await client.query(
            "DELETE FROM comments WHERE product_id = $1",
            [req.params.id]
        );
        const img = await client.query(
            "DELETE FROM images WHERE product_id = $1",
            [req.params.id]
        );
        const product = await client.query(
            "DELETE FROM products WHERE product_id = $1",
            [req.params.id]
        );
        if (product.rowCount === 0) {
            res.status(404);
            res.send(`Product with id ${req.params.id} is not found`);
            return;
        }

        res.status(200);
        res.end();
    } catch (e) {
        throwServerError(res, e);
    }
});