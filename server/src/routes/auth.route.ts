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
import {
    CreateUserSchema,
    SignInValidationSchema,
    TokenAndIdValidationSchema,
    UpdatePasswordSchema,
} from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post("/register", validate(CreateUserSchema), createUser);
router.post("/verify-email", validate(TokenAndIdValidationSchema), verifyEmail);
router.post("/reverify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
    "/verify-pass-reset-token",
    validate(TokenAndIdValidationSchema),
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
