import {
    createUser,
    generateForgetPasswordLink,
    grantValid,
    sendReVerificationToken,
    signIn,
    updatePassword,
    verifyEmail,
} from "#/controller/user.controller";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import User from "#/models/user.model";
import {
    CreateUserSchema,
    SignInValidationSchema,
    TokenAndIdValidation,
    UpdatePasswordSchema,
} from "#/utils/validation";
import { JWT_SECRET } from "#/utils/variables";
import { Router } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const router = Router();

router.post("/register", validate(CreateUserSchema), createUser);
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/reverify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
    "/verify-pass-reset-token",
    validate(TokenAndIdValidation),
    isValidPassResetToken,
    grantValid
);
router.post(
    "/update-password",
    validate(UpdatePasswordSchema),
    isValidPassResetToken,
    updatePassword
);

router.post("/sign-in", validate(SignInValidationSchema), signIn);

router.get("/is-auth", mustAuth, (req, res) => {
    res.json({
        profile: req.user,
    });
});

export default router;
