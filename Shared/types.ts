declare interface RowDataPacket {
    constructor: {
      name: 'RowDataPacket';
    };
    [column: string]: any;
    [column: number]: any;
}
export interface IComment {
    id: string;
    name: string;
    email: string;
    body: string;
    productId: string;
}
export type CommentCreatePayload = Omit<IComment, "id">;

export interface ICommentEntity extends RowDataPacket {
    comment_id: string;
    name: string;
    email: string;
    body: string;
    product_id: string;
}
export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number;
	comments?: IComment[];
	images?: [];
    thumbnail?: {};
}
export interface IProductEntity extends IProduct, RowDataPacket {
 	product_id: string;
}
export interface IProductFilterPayload {
	title?: string;
	description?: string;
	priceFrom?: number;
	priceTo?: number;
}
export type ProductCreatePayload = Omit<IProduct, "id" | "comments">;
export interface IProductEditData {
    title: string;
    description: string;
    price: string;
    mainImage: string;
    newImages?: string;
    commentsToRemove: string | string[];
    imagesToRemove: string | string[];
    product_id: string;
}
export interface IProductNewImages {
	image: string | string[];
	product_id: string;
}