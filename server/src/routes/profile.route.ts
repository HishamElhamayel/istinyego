import {
    getAllDrivers,
    getAllProfileData,
    getAllProfiles,
    updateProfile,
} from "#/controller/profile.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { UpdateUserSchema } from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.get("/", mustAuth, mustRoles("admin"), getAllProfiles);
router.get("/drivers", mustAuth, mustRoles("admin"), getAllDrivers);
router.get("/:id", mustAuth, mustRoles("admin"), getAllProfileData);
router.patch(
    "/update-profile",
    mustAuth,
    validate(UpdateUserSchema),
    updateProfile
);

export default router;
