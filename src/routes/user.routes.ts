import express from 'express';
import { createUserHandler } from '../controllers/user.controller';
import { validateUser } from '../middleware/validateUser';

const router = express.Router();

router.post('/', validateUser, createUserHandler);
/* router.get('/get/:authorId', controller.readAuthor);
router.get('/get', controller.readAll);
router.patch('/update/:authorId', controller.updateAuthor);
router.delete('/delete/:authorId', controller.deleteAuthor); */

export default router;
