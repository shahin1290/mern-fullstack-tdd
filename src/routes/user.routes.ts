import express from 'express';
import { check } from 'express-validator';
import { createUserHandler, signinHandler, updateUserHandler } from '../controllers/user.controller';
import { registerSchema, loginSchema } from '../middleware/validateUser';
//import { validateUser } from '../middleware/validateUser';

const router = express.Router();

router.post('/', registerSchema, createUserHandler);
router.post('/signin', loginSchema, signinHandler);
router.put('/:id', updateUserHandler);

/* router.get('/get/:authorId', controller.readAuthor);
router.get('/get', controller.readAll);
router.patch('/update/:authorId', controller.updateAuthor);
router.delete('/delete/:authorId', controller.deleteAuthor); */

export default router;
