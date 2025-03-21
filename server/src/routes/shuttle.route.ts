import {
    createShuttle,
    getAllShuttles,
    getShuttleById,
} from "#/controller/shuttle.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { CreateShuttleSchema } from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    mustRoles("admin"),
    validate(CreateShuttleSchema),
    createShuttle
);
router.get("/", mustAuth, mustRoles("admin"), getAllShuttles);
router.get("/:id", mustAuth, getShuttleById);

export default router;
