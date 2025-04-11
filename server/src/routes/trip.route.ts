import {
    createTrip,
    deleteTrip,
    getTripById,
    getTripsByRouteId,
    getTripsByShuttleId,
    updateTripStateToCompleted,
    updateTripStateToInProgress,
} from "#/controller/trip.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { CreateTripSchema } from "#/utils/validation";
import Router from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    mustRoles("admin"),
    validate(CreateTripSchema),
    createTrip
);
router.get("/trips-by-route", getTripsByRouteId);
router.get("/trips-by-shuttle", getTripsByShuttleId);
router.get("/:id", mustAuth, getTripById);
router.delete("/:id", mustAuth, deleteTrip);
router.patch("/:tripId/inProgress", mustAuth, updateTripStateToInProgress);
router.patch("/:tripId/completed", mustAuth, updateTripStateToCompleted);

export default router;
