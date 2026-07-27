import { envConfig } from "../config/env.config";
import { HTTP_STATUS } from "../constants/httpStatus.constants";
import { Admin } from "../models/auth.model";
import ApiError from "../utils/ApiError";
import jwt from 'jsonwebtoken'

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if(!token || token.trim()==="") throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authorized");
        const decoded =   jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
        req.user = decoded
        next();
    } catch (error) {
        next(error);
    }
}