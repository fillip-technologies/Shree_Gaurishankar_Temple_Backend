import express from "express";
import {
  deleteImageFromGallery,
  fetchGallery,
  fetchShringar,
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

uploadRouter.get("/shringar", fetchShringar);
uploadRouter.get("/gallery", fetchGallery);
uploadRouter.delete("/gallery/:id", verifyJWT, deleteImageFromGallery);


export { uploadRouter };
