import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { sendVerificationRequest, verifyCode } from "../vonage";
import { VONAGE_API_KEY, VONAGE_API_SECRET } from "../config";
import { createJwtToken } from "../utils/token.util";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const { phone } = req.body;
        const user = await User.findOne({ phone });

        if (user) {
            const resp_data = await sendVerificationRequest(VONAGE_API_KEY, VONAGE_API_SECRET, phone, 'PantryPal');

            if (resp_data.status !== '0') {
                next({ status: 400, message: resp_data.error_text });
                return;
            }

            res.status(201).json({
                type: "success",
                message: "OTP Sent",
                data: {
                    status: false,
                    request_id: resp_data.request_id,
                    userId: user._id
                }
            });
        } else {
            // user don't exist, register them
            const createUser = new User({ phone });
            const newUser = await createUser.save();

            const resp_data = await sendVerificationRequest(VONAGE_API_KEY, VONAGE_API_SECRET, phone, 'PantryPal');

            if (resp_data.status !== '0') {
                next({ status: 400, message: "Can't complete Auth with VONAGE" });
                return;
            }

            res.status(200).json({
                type: "success",
                message: "New account has been created and OTP sent",
                data: {
                    status: true,
                    request_id: resp_data.request_id,
                    userId: newUser._id
                }
            });
        }
    } catch (error) {
        next(error);
    }
};


export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { request_id, code, name, userId } = req.body;

        const resp_data = await verifyCode(VONAGE_API_KEY, VONAGE_API_SECRET, request_id, code);
        console.log(req.body);
        console.log(resp_data);
        if (resp_data.status !== '0') {
            next({ status: 400, message: resp_data.error_text });
            return;
        }

        // Save name in the database
        const user = await User.findById(userId);

        if (!user) {
            next({ status: 404, message: "User not found" });
            return;
        }

        user.name = name;
        await user.save();

        // Generate JWT and Send
        const token = createJwtToken({ userId: resp_data.user_id });
        res.status(200).json({
            type: "success",
            message: "OTP Verified",
            data: {
                token
            }
        });
    } catch (error) {
        next(error);
    }
}