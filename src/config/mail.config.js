import nodemailer from "nodemailer";
import { envConfig } from "./configenv.js";

export const transporter = nodemailer.createTransport({
    host: envConfig,
    port:envConfig,
    secure: false,
    auth: {
        user:envConfig,
        pass: envConfig
    }
})