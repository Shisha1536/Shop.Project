import { Request, Response, Router  } from 'express';
import { CommentCreatePayload, ICommentEntity } from "../../types";
import { IComment } from '@Shared/types';
import { readFile, writeFile } from "fs/promises";
import { validateComment } from "../../helpers";
import { v4 as uuidv4 } from 'uuid';
import { client } from "../../index";
import { mapCommentEntity } from '../services/mapping';
import { COMMENT_DUPLICATE_QUERY, INSERT_COMMENT_QUERY } from "../services/queries";

const loadComments = async (): Promise<IComment[]> => {
  const rawData = await readFile("mock-comments.json", "binary");
  return JSON.parse(rawData.toString());
}
const saveComments = async (data: IComment[]): Promise<boolean> => {
  try {
    await writeFile("mock-comments.json", JSON.stringify(data));
    return false;
  } catch (e) {
    return false;
  }
}
export const commentsRouter = Router();

commentsRouter.get('/', async (req: Request, res: Response) => {
    try {
		const comments = await client.query('SELECT * FROM comments');

		res.setHeader('Content-Type', 'application/json');
		res.send(mapCommentEntity(comments.rows));
	} catch (e) {
		console.debug(e.message);
        res.status(500);
        res.send("Something went wrong");
	}
});

commentsRouter.get('/:id', async (req: Request<{id: string}>, res: Response) => {
	try {
		const rows = await client.query(
		  "SELECT * FROM comments WHERE comment_id = $1",
		  [req.params.id]
		);
		console.log(rows)
		if (!rows.rows?.[0]) {
		  res.status(404);
		  res.send(`Comment with id ${req.params.id} is not found`);
		  return;
		}
	
		res.setHeader('Content-Type', 'application/json');
		res.send(mapCommentEntity(rows.rows)[0]);
	  } catch (e) {
		console.debug(e.message);
		res.status(500);
		res.send("Something went wrong");
	  }
});

commentsRouter.post('/', async (req: Request<{}, {}, CommentCreatePayload>, res: Response) => {
    const validationResult = validateComment(req.body);
    if (validationResult) {
      res.status(400);
      res.send(validationResult);
      return;
    }
	try {
		const { name, email, body, productId } = req.body;
	
		const sameResult = await client.query(COMMENT_DUPLICATE_QUERY,
			[email.toLowerCase(), name.toLowerCase(), body.toLowerCase(),productId]
		);
	
		if (sameResult.rows.length) {
		  res.status(422);
		  res.send("Comment with the same fields already exists");
		  return;
		}
	
		const id = uuidv4();
		const info = await client.query(INSERT_COMMENT_QUERY, [id, email, name, body, productId,]);
		
		res.status(201);
		res.send(`Comment id:${id} has been added!`);
	} catch (e) {
		console.debug(e.message);
		res.status(500);
		res.send("Server error. Comment has not been created");
	}
});

commentsRouter.patch('/', async (req: Request<{}, {}, Partial<IComment>>, res: Response) => {
    
	try {
		let updateQuery = "UPDATE comments SET ";
		let a = 1;
		const valuesToUpdate = [];
		["name", "body", "email"].forEach(fieldName => {
			if (req.body.hasOwnProperty(fieldName)) {
				if (valuesToUpdate.length) {
					updateQuery += ", ";
				}
				
				updateQuery += `${fieldName} = $${a}`;
				a++
				valuesToUpdate.push(req.body[fieldName]);
			}
		});
	
		updateQuery += ` WHERE comment_id = $${a}`;
		valuesToUpdate.push(req.body.id);
		
		const info = await client.query(updateQuery, valuesToUpdate);
		console.log(info)
		if (info.rowCount === 1) {
			res.status(200);
			res.end();
			return;
		}

		const newComment = req.body as CommentCreatePayload;
		const validationResult = validateComment(newComment);
		if (validationResult) {
			res.status(400);
			res.send(validationResult);
			return;
		}

		const id = uuidv4();
		await client.query(
			INSERT_COMMENT_QUERY,
			[id, newComment.email, newComment.name, newComment.body, newComment.productId]
		);
		res.status(201);
		res.send({ ...newComment, id })
	} catch (e) {
		console.log(e.message);
		res.status(500);
		res.send("Server error");
	}
});

commentsRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
	try {
		const info = await client.query(
		  "DELETE FROM comments WHERE comment_id = $1",
		  [req.params.id]
		);
		console.log(info);

		if (info.rowCount === 0) {
		  res.status(404);
		  res.send(`Comment with id ${req.params.id} is not found`);
		  return;
		}
		res.setHeader('Content-Type', 'application/json');
		res.status(200);
		res.end();
	  } catch (e) {
		console.log(e.message);
		res.status(500);
		res.send("Server error. Comment has not been deleted");
	  }
});