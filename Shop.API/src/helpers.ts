import { CommentCreatePayload, IProductSearchFilter } from "../types";
import { IComment } from "@Shared/types";
import { v4 as uuidv4 } from 'uuid';

type CommentValidator = (comment: CommentCreatePayload) => string | null;

export const validateComment: CommentValidator = (comment) => {
	if (!comment || !Object.keys(comment).length) {
		return "Comment is absent or empty";
	}

	const requiredFields = new Set<keyof CommentCreatePayload>([
		"name",
		"email",
		"body",
		"productId"
	]);

	let wrongFieldName;

	requiredFields.forEach((fieldName) => {
		if (!comment[fieldName]) {
		wrongFieldName = fieldName;
		return;
		}
	});

	if (wrongFieldName) {
		return `Field '${wrongFieldName}' is absent`;
	}

	return null;
}
const compareValues = (target: string, compare: string): boolean => {
  return target.toLowerCase() === compare.toLowerCase();
}
export const checkCommentUniq = (payload: CommentCreatePayload, comments: IComment[]): boolean => {
	const byEmail = comments.find(({ email }) => compareValues(payload.email, email));

	if (!byEmail) {
		return true;
	}

	const { body, name, productId } = byEmail;
	return !(
		compareValues(payload.body, body) &&
		compareValues(payload.name, name) &&
		compareValues(payload.productId.toString(), productId.toString())
	);
}
export const enhanceProductsComments = (products, commentRows, imagesRows) => {
	
	for (let index = 0; index < products.length; index++) {
		const product = products[index];
		let new_arr_com = [];
		let new_arr_img = [];
		let thumbnail  = [];
		
		for (let index = 0; index < commentRows.length; index++) {
			const comment = commentRows[index];
			if (product.product_id == comment.product_id) {
				new_arr_com.push(comment);
			}
		}
		for (let index = 0; index < imagesRows.length; index++) {
			const img = imagesRows[index];
			if (product.product_id == img.product_id) {
				new_arr_img.push(img);
				if (img.main) {
					thumbnail.push(img);
				}
			}
		}
		if (new_arr_com.length > 0) {
			product.comments = new_arr_com;
			new_arr_com = [];
		}
		if (new_arr_img.length > 0) {
			product.images = new_arr_img;
			new_arr_img = [];
		}
		if (thumbnail.length > 0) {
			product.thumbnail = thumbnail;
			thumbnail = [];
		}
	}
	return products;
}
export const getProductsFilterQuery = (
	filter: IProductSearchFilter
): [string, string[]] => {
	const { title, description, priceFrom, priceTo } = filter;

	let query = "SELECT * FROM products WHERE ";
	const values = []

	if (title) {
		query += `title LIKE '%${title}%' ` ;
		values.push(`%${title}%`);
	}

	if (description) {
		if (values.length) {
			query += " OR ";
		}

		query += `description LIKE '%${description}%'` ;
		values.push(`%${description}%`);
	}

	if (priceFrom || priceTo) {
		if (values.length) {
			query += " OR ";
		}

		query += `(price > ${priceFrom || 0} AND price < ${priceTo || 999999})`;
		values.push(priceFrom || 0);
		values.push(priceTo || 999999);
	}
	return [query, values];
}
export const queryImg = (imagReq, img, product_id) =>{
	const val = []
	for (let index = 0; index < img.length; index++) {
		const element = img[index];
		let id = uuidv4();
		
		if (val.length) {
			imagReq += `,`;
		}

		imagReq += `(
		'${id}',
		'${element}',
		'${product_id}'
		)`;
		val.push(id);
	}
	return imagReq
}