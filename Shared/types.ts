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
	images?: []
}
export interface IProductEntity extends IProduct, RowDataPacket {
 	product_id: string;
}
export interface IProductSearchFilter {
	title?: string;
	description?: string;
	priceFrom?: number;
	priceTo?: number;
}
export type ProductCreatePayload = Omit<IProduct, "id" | "comments">;