import express from "express";
import {
  galleryUpload,
  shringarUpload,
} from "../controllers/upload.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const uploadRouter = express.Router();

uploadRouter.post(
  "/shringar",
  verifyJWT,
  upload.single("file"),
  shringarUpload,
);

uploadRouter.post("/gallery", verifyJWT, upload.single("file"), galleryUpload);

export { uploadRouter };
