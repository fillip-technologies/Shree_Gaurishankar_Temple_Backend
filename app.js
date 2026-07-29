import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { authRouter } from './src/routes/auth.routes.js';
import { uploadRouter } from './src/routes/upload.routes.js';
import { errorHandler } from './src/middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/data",uploadRouter)
app.get('/', (req, res) => {
    res.status(200).json({msg: "Everthing is working fine"});
})
app.post("/test", (req, res) => {
  console.log(req.headers);
  req.on("data", chunk => console.log(chunk));
  req.on("end", () => res.send("ok"));
});

// Global error handler — must be the LAST middleware registered
app.use(errorHandler);

export {app};