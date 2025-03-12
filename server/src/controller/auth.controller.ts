import Token from "#/models/token.model";
import User from "#/models/user.model";
import Wallet from "#/models/wallet.model";
import { CreateUser, VerifyEmailRequest } from "#/types/user.types";
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

        const wallet = await Wallet.create({});

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            studentId,
            wallet: wallet._id,
        });

        const token = generateToken(6);

        await Token.create({
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
) => {
    try {
        const { token, userId } = req.body;

        const verificationToken = await Token.findOne({
            owner: userId,
        });

        if (!verificationToken) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }

        const matched = await verificationToken.compareToken(token);

        if (!matched) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }

        await User.findByIdAndUpdate(userId, { verified: true });

        await Token.findByIdAndDelete(verificationToken._id);

        res.status(200).json({ message: "Email verified" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// RESEND VERIFICATION TOKEN
export const sendReVerificationToken: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!isValidObjectId(userId)) {
            res.status(403).json({ error: "Invalid request!" });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(403).json({ error: "Invalid request!" });
            return;
        }

        await Token.findOneAndDelete({ owner: userId });

        const token = generateToken(6);

        await Token.create({
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
export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: "Account not found" });
            return;
        }

        // User exists
        // Generate link to reset the password

        const token = crypto.randomBytes(36).toString("hex");
        await Token.findOneAndDelete({ owner: user._id });
        await Token.create({
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
export const grantValid: RequestHandler = async (req, res) => {
    res.json({ valid: true });
};

// UPDATE PASSWORD
export const updatePassword: RequestHandler = async (req, res) => {
    try {
        const { password, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(403).json({ error: "Unauthorized access!" });
            return;
        }

        const matched = await user.comparePassword(password);
        if (matched) {
            res.status(422).json({ error: "Can't use the same password!" });
            return;
        }

        user.password = password;
        await user.save();

        await Token.findOneAndDelete({ owner: user._id });

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

export const signIn: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(403).json({ error: "Email or password is incorrect" });
            return;
        }

        const matched = await user.comparePassword(password);
        if (!matched) {
            res.status(403).json({ error: "Email or password is incorrect" });
            return;
        }

        // Generate Token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        user.tokens.push(token);

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

export const sendProfile: RequestHandler = (req, res) => {
    res.json({ profile: req.user });
};

export const logout: RequestHandler = async (req, res) => {
    //Logout and Logout from all
    try {
        const { fromAll } = req.query;

        const token = req.token;
        const user = await User.findById(req.user.id);
        if (!user) throw new Error("Something went wrong, user not found!");

        if (fromAll === "yes") user.tokens = [];
        else user.tokens = user.tokens.filter((t) => t !== token);

        await user.save();

        res.json({ message: "Successfully logged out" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
