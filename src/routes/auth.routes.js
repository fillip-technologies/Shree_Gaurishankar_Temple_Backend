import express from 'express'
import { login, updatePassword } from '../controllers/auth.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.patch("/update_password", verifyJWT, updatePassword);

export {authRouter}