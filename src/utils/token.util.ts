import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { IPayload } from '../interfaces/jwt.interface';
import { NextFunction } from 'express';


export const createJwtToken = (payload: IPayload) => {
    const token: String = jwt.sign(payload, JWT_SECRET ?? "", { expiresIn: "1h" })
    return token;
}

export const verifyJwtToken = (token: string, next:NextFunction) => {
    try {
        const payload = jwt.verify(token, JWT_SECRET ?? "") as unknown as IPayload;
        const { userId } = payload;

        return userId;
    } catch (err) {
        next(err);
    }
}
