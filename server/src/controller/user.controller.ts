import { CreateUser, VerifyEmailRequest } from "#/types/user.types";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import User from "#/models/user.model";
import { generateToken } from "#/utils/helper";
import {
    sendForgetPasswordLink,
    sendPassResetSuccessEmail,
    sendVerificationMail,
} from "#/utils/mail";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import crypto from "crypto";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

// CREATE USER
export const createUser: RequestHandler = async (req: CreateUser, res) => {
    try {
        const { firstName, lastName, email, password, studentId } = req.body;

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            studentId,
        });

        const token = generateToken(6);

        await EmailVerificationToken.create({
            owner: user._id,
            token,
        });

        sendVerificationMail(token, {
            firstName,
            lastName,
            email,
            userId: user._id.toString(),
        });

        res.status(201).json({
            user: { id: user._id, firstName, lastName, email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// VERIFY EMAIL
export const verifyEmail: RequestHandler = async (
    req: VerifyEmailRequest,
    res
): Promise<any> => {
    try {
        const { token, userId } = req.body;

        const verificationToken = await EmailVerificationToken.findOne({
            owner: userId,
        });

        if (!verificationToken)
            return res.status(403).json({ error: "Invalid token" });

        const matched = await verificationToken.compareToken(token);

        if (!matched) return res.status(403).json({ error: "Invalid token" });

        await User.findByIdAndUpdate(userId, { verified: true });

        await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

        res.status(200).json({ message: "Email verified" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// RESEND VERIFICATION TOKEN
export const sendReVerificationToken: RequestHandler = async (
    req,
    res
): Promise<any> => {
    try {
        const { userId } = req.body;

        if (!isValidObjectId(userId))
            return res.status(403).json({ error: "Invalid request!" });

        const user = await User.findById(userId);
        if (!user) return res.status(403).json({ error: "Invalid request!" });

        await EmailVerificationToken.findOneAndDelete({ owner: userId });

        const token = generateToken(6);

        await EmailVerificationToken.create({
            owner: userId,
            token,
        });

        sendVerificationMail(token, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userId: user._id.toString(),
        });

        res.json({ message: "OTP Sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// GENERATE PASSWORD LINK
export const generateForgetPasswordLink: RequestHandler = async (
    req,
    res
): Promise<any> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "Account not found" });

        // User exists
        // Generate link to reset the password

        const token = crypto.randomBytes(36).toString("hex");
        await PasswordResetToken.findOneAndDelete({ owner: user._id });
        await PasswordResetToken.create({
            owner: user._id,
            token,
        });

        const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

        sendForgetPasswordLink({ email, link: resetLink });

        res.json({ message: "Please check your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// DON'T KNOW
export const grantValid: RequestHandler = async (req, res): Promise<any> => {
    res.json({ valid: true });
};

// UPDATE PASSWORD
export const updatePassword: RequestHandler = async (
    req,
    res
): Promise<any> => {
    try {
        const { password, userId } = req.body;

        const user = await User.findById(userId);
        if (!user)
            return res.status(403).json({ error: "Unauthorized access!" });

        const matched = await user.comparePassword(password);
        if (matched)
            return res
                .status(422)
                .json({ error: "Can't use the same password!" });

        user.password = password;
        await user.save();

        await PasswordResetToken.findOneAndDelete({ owner: user._id });

        // Send Success Email
        sendPassResetSuccessEmail(user.firstName, user.lastName, user.email);

        res.status(200).json({
            message: "Your password has been successfully changed",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const signIn: RequestHandler = async (req, res): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(403)
                .json({ error: "Email or password is incorrect" });

        const matched = await user.comparePassword(password);
        if (!matched)
            return res
                .status(403)
                .json({ error: "Email or password is incorrect" });

        // Generate Token
        console.log(JWT_SECRET);
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        user.tokens = [token];

        await user.save();

        res.json({
            profile: {
                id: user._id,
                studentId: user.studentId,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                verified: user.verified,
                favoriteRoutes: user.favoriteRoutes,
                wallet: user.wallet,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
