import { getAllProfiles } from "#/controller/profile.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", mustAuth, mustRoles("admin"), getAllProfiles);

export default router;
