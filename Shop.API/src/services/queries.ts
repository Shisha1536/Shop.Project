export const COMMENT_DUPLICATE_QUERY = `
	SELECT * FROM comments c
	WHERE LOWER(c.email) = $1
	AND LOWER(c.name) = $2
	AND LOWER(c.body) = $3
	AND c.product_id = $4
`;

export const INSERT_COMMENT_QUERY = `
    INSERT INTO comments
    (comment_id, email, name, body, product_id)
    VALUES
    ($1, $2, $3, $4, $5)
`;
export const INSERT_PRODUCT_QUERY = `
	INSERT INTO products
	(product_id, title, description, price)
	VALUES
	($1, $2, $3, $4)
`;
export const INSERT_IMAGES_QUERY = `
	INSERT INTO images
	(image_id, url, product_id)
	VALUES
`;
export const INSERT_IMAGE_QUERY = `
	INSERT INTO images
	(image_id, url, product_id, main)
	VALUES
	($1, $2, $3, $4)
`;