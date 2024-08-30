import axios from "axios";
import { IProduct, IProductEditData, IProductFilterPayload } from "@Shared/types";
import { API_HOST as host } from "./const";

export async function getProducts() {
    const { data } = await axios.get < IProduct[] > (`${host}/products`);
    return data || [];
}
export async function searchProducts(
    filter: IProductFilterPayload
): Promise<IProduct[]> {
    const { data } = await axios.get < IProduct[] > (
        `${host}/products/search`,
        { params: filter }
    );
    return data || [];
} 
export async function addProduct(
    filter: IProductFilterPayload
): Promise<IProduct[]> {
    const { data } = await axios.get < IProduct[] > (
        `${host}/products/search`,
        { params: filter }
    );
    return data || [];
} 
export async function getProduct(
    id: string
): Promise<IProduct | null> {
    try {
        const { data } = await axios.get < IProduct > (
            `${host}/products/${id}`
        );
        return data;
    } catch (e) {
        return null;
    }
}
export async function removeProduct(id: string): Promise<void> {
    await axios.delete(`${host}/products/${id}`);
}
function compileIdsToRemove(data: string | string[]): string[] {
    if (typeof data === "string") return [data];
    return data;
}
function ingNew(data: string | string[]): string[] {
    if (typeof data === "string" && data.indexOf('\r\n') > 0) {
        return data = data.split('\r\n');
    } else if (typeof data === "string") {
        return data = data.split(',');
    };
}
export async function updateProduct(
    productId: string,
    formData: IProductEditData
): Promise<IProduct | null> {
    try {
        let {
            data: currentProduct
        } = await axios.get < IProduct > (`${host}/products/${productId}`);
        
        if (formData.commentsToRemove) {
            if (typeof(formData.commentsToRemove) != "string") {
                formData.commentsToRemove.forEach(element => {
                    axios.delete(`${host}/comments/${element}`);
                });
            } else {
                await axios.delete(`${host}/comments/${formData.commentsToRemove}`);
            }
        }
        
        if (formData.imagesToRemove) {
            const imRemove = compileIdsToRemove(formData.imagesToRemove);
            await axios.post(`${host}/products/remove-images`, imRemove);
        }

        if (formData.newImages) {
            const imgNew = ingNew(formData.newImages);
            await axios.post(`${host}/products/new-image`, [imgNew, productId]);
        }
        
        if (formData.mainImage !== currentProduct[0]?.thumbnail?.image_id) {
            const old_man = currentProduct[0]?.thumbnail?.image_id;
            const new_main = formData.mainImage;
            await axios.post(`${host}/products/update-thumbnail/${productId}`, [new_main, old_man, new_main, old_man]);
        }
        
        await axios.patch(`${host}/products/${productId}`, {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price)
        });
        return currentProduct;
    } catch (e) {
        console.log(e);
    }
}
export async function newProduct(
    title: string,
    description: string,
    price: number
){
    try {
        await axios.post(`${host}/products`, [title, description, price]);
    } catch (e) {
        console.log(e);
    }
}