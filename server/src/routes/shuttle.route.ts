import {
    createShuttle,
    deleteShuttle,
    getAllShuttles,
    getShuttleByDriverId,
    getShuttleById,
    updateShuttle,
    updateShuttleLocation,
} from "#/controller/shuttle.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import {
    CreateShuttleSchema,
    UpdateShuttleLocationSchema,
} from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    mustRoles("admin"),
    validate(CreateShuttleSchema),
    createShuttle
);
router.patch(
    "/update-shuttle-location",
    mustAuth,
    mustRoles("driver"),
    validate(UpdateShuttleLocationSchema),
    updateShuttleLocation
);
router.get("/", mustAuth, mustRoles("admin"), getAllShuttles);
router.get("/get-shuttle-by-driver", mustAuth, getShuttleByDriverId);

router.patch(
    "/:id",
    mustAuth,
    mustRoles("admin"),
    validate(CreateShuttleSchema),
    updateShuttle
);
router.get("/:id", mustAuth, getShuttleById);
router.delete("/:id", mustAuth, deleteShuttle);

export default router;
