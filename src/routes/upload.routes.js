import express from 'express';
import { shringarUpload } from '../controllers/upload.controllers.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';
const uploadRouter = express.Router();


uploadRouter.post("/shringar", verifyJWT, upload.single("file"), shringarUpload)

export {uploadRouter}
