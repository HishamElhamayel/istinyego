import { UserDocument } from "#/models/user.model";
import { Request } from "express";

// request types
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

// global types
declare global {
    namespace Express {
        interface Request {
            user: UserDocument;
        }
    }
}
