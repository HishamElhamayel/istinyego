import { createRoute } from "#/controller/route.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { CreateRouteSchema } from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    mustRoles(["admin"]),
    validate(CreateRouteSchema),
    createRoute
);

export default router;
