import express from 'express'
import cookieParser from 'cookie-parser';
import { authRouter } from './src/routes/auth.routes.js';
import { mailRouter } from './src/routes/mail.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/mail", mailRouter);


export {app};