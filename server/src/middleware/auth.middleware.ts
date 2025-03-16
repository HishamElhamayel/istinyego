import Token from "#/models/token.model";
import User from "#/models/user.model";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
    const { token, userId } = req.body;

    const resetToken = await Token.findOne({ owner: userId });
    if (!resetToken) {
        res.status(403).json({ error: "Unauthorized access, invalid token" });
        return;
    }

    const matched = await resetToken.compareToken(token);
    if (!matched) {
        res.status(403).json({ error: "Unauthorized access, invalid token" });
        return;
    }

    next();
};

export const mustAuth: RequestHandler = (req, res, next) => {
    try {
        // get header
        const header = req.header("Authorization");
        if (!header) {
            next();
            return;
        }

        // get token
        const [bearer, token] = header.split(" ");
        if (!token || !bearer || bearer !== "Bearer") {
            next();
            return;
        }

        // verify token
        verify(token, JWT_SECRET!, async (err, decoded) => {
            if (!err && decoded) {
                const userId = (decoded as JwtPayload).userId;
                const user = await User.findOne({
                    _id: userId,
                    tokens: token,
                }).select("-email -phoneNumber");

                if (!user) {
                    res.status(403).json({ error: "Unauthorized request" });
                    return;
                }

                req.user = user;
            }

            next();
        });
    } catch (err: any) {
        console.error(err);
        res.status(401).json({
            error: err.message,
        });
        return;
    }
};

export const mustRoles = (roles: string | string[]): RequestHandler => {
    return (req, res, next) => {
        roles = Array.isArray(roles) ? roles : [roles];

        if (!roles.includes(req.user?.role)) {
            res.status(403).json({ error: "Unauthorized access!" });
            return;
        }

        next();
    };
};
