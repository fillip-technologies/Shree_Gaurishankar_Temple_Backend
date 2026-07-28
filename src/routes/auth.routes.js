import express from "express";
import {
  createAdmin,
  listAdmin,
  login,
  removeAdmin,
  updatePassword,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/create_admin", verifyJWT, createAdmin);
authRouter.post("/remove_admin", verifyJWT, removeAdmin);
authRouter.patch("/update_password", verifyJWT, updatePassword);
authRouter.get("/admins", verifyJWT, listAdmin);

export { authRouter };
