import User from "#/models/user.model";
import Wallet from "#/models/wallet.model";
import Route from "#/models/route.model";
import { Request } from "express";
import { Document, InferSchemaType } from "mongoose";

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

export type UserDocument = InferSchemaType<typeof User.schema> & Document;
export type WalletDocument = InferSchemaType<typeof Wallet.schema> & Document;
export type RouteDocument = InferSchemaType<typeof Route.schema> & Document;

declare global {
    namespace Express {
        interface Request {
            user: UserDocument;
        }
    }
}
