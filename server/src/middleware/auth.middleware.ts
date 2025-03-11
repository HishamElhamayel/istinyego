import Token from "#/models/token.model";
import User from "#/models/user.model";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const isValidPassResetToken: RequestHandler = async (
    req,
    res,
    next
): Promise<any> => {
    const { token, userId } = req.body;

    const resetToken = await Token.findOne({ owner: userId });
    if (!resetToken)
        return res
            .status(403)
            .json({ error: "Unauthorized access, invalid token" });

    const matched = await resetToken.compareToken(token);
    if (!matched)
        return res
            .status(403)
            .json({ error: "Unauthorized access, invalid token" });

    next();
};

export const mustAuth: RequestHandler = async (
    req,
    res,
    next
): Promise<any> => {
    const { authorization } = req.headers;
    const token = authorization?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "Unauthorized request" });

    const payload = verify(token, JWT_SECRET) as JwtPayload;

    const id = payload.userId;

    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: "Unauthorized request" });
    req.user = {
        id: user._id,
        studentId: user.studentId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
        favoriteRoutes: user.favoriteRoutes,
        wallet: user.wallet,
    };
    next();
};
