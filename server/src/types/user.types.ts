import { Request } from "express";
import { ObjectId } from "mongoose";

export interface CreateUser extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        studentId: number;
    };
}

export interface VerifyEmailRequest extends Request {
    body: {
        userId: string;
        token: string;
    };
}

declare global {
    namespace Express {
        interface Request {
            user: {
                id: any;
                studentId: number;
                firstName: string;
                lastName: string;
                role: string;
                verified: boolean;
                favoriteRoutes: ObjectId[];
                wallet: any;
            };
            token: string;
        }
    }
}
