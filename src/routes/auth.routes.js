import express from "express";
const authRouter = express.Router();

import {
  createAdmin,
  listAdmin,
  login,
  removeAdmin,
  renewRefreshToken,
  updatePassword,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

authRouter.post("/login", login);
authRouter.post("/create_admin", verifyJWT, createAdmin);
authRouter.post("/remove_admin", verifyJWT, removeAdmin);
authRouter.post("/refresh_token", verifyJWT, renewRefreshToken);
authRouter.patch("/update_password", verifyJWT, updatePassword);
authRouter.get("/admins", verifyJWT, listAdmin);

export { authRouter };
