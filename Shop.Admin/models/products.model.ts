import axios from "axios";
import { IProduct, IProductEditData, IProductFilterPayload } from "@Shared/types";

const host = `http://${process.env.LOCAL_HOST}:${process.env.LOCAL_PORT}/${process.env.API_PATH}`;

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

export async function updateProduct(
    productId: string,
    formData: IProductEditData
): Promise<IProduct | null> {
    try {
        // запрашиваем у Products API товар до всех изменений
        const {
            data: currentProduct
        } = await axios.get < IProduct > (`${host}/products/${productId}`);
        
        if (formData.commentsToRemove) {
            if (typeof(formData.commentsToRemove) != "string") {
                for (let index = 0; index < formData.commentsToRemove.length; index++) {
                    const element = formData.commentsToRemove[index];
                    await axios.delete(`${host}/products/${element}`);
                }
            } else {
                await axios.delete(`${host}/comments/${formData.commentsToRemove}`);
            }
        }
        
        if (formData.imagesToRemove) {
            const imagesIdsToRemove = compileIdsToRemove(formData.imagesToRemove);
            await axios.post(`${host}/products/remove-images`, imagesIdsToRemove);
        }

        if (formData.newImages) {
            // превратите строку newImages в массив строк, разделитель это перенос строки или запятая
            // для добавления изображений используйте Products API "add-images" метод
        }

        //if (formData.mainImage && formData.mainImage !== currentProduct?.thumbnail?.id) {
        //    // если при редактировании товара было выбрано другое изображение для обложки,
        //    // то нужно обратиться к Products API "update-thumbnail" методу
        //}

        // обращаемся к Products API методу PATCH для обновления всех полей, которые есть в форме
        // в ответ получаем обновленный товар и возвращаем его из этой функции

        // временно возвращаем неизмененный товар, пока все предыдущие этапы не будут реализованы
        return currentProduct;
    } catch (e) {
        console.log(e); // фиксируем ошибки, которые могли возникнуть в процессе
    }
}