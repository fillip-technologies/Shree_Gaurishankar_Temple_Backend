import { envConfig } from "../config/env.config.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { Admin } from "../models/auth.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if(!token || token.trim()==="") throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authorized");
        const decoded =   jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
        req.user = decoded
        next();
    } catch (error) {
        next(error);
    }
}