import { createTrip } from "#/controller/trip.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { CreateTripSchema } from "#/utils/validation";
import Router from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    mustRoles(["admin"]),
    validate(CreateTripSchema),
    createTrip
);

export default router;
