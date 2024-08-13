import axios from "axios";
import { IProduct } from "@Shared/types";

const host = `http://${process.env.LOCAL_HOST}:${process.env.LOCAL_PORT}/${process.env.API_PATH}`;

export async function getProducts() {
    const { data } = await axios.get < IProduct[] > (`${host}/products`);
    console.log(data.length);
}