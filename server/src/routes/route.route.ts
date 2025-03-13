import { createRoute } from "#/controller/route.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

// router.post("/create", mustAuth, mustRoles(["admin"]), createRoute);

export default router;
