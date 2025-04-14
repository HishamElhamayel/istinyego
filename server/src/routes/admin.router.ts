import { getAdminDashboard } from "#/controller/admin.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import Router from "express";

const router = Router();

router.get("/dashboard", mustAuth, mustRoles(["admin"]), getAdminDashboard);

export default router;
