import {
    createTrip,
    deleteTrip,
    getNextFiveTrips,
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
router.get("/trips-by-shuttle", mustAuth, getTripsByShuttleId);
router.get("/trips-by-route", mustAuth, getTripsByRouteId);
router.get("/next-5-trips", mustAuth, getNextFiveTrips);
router.get("/:id", mustAuth, getTripById);
router.delete("/:id", mustAuth, mustRoles("admin"), deleteTrip);
router.patch(
    "/:tripId/inProgress",
    mustAuth,
    mustRoles("driver"),
    updateTripStateToInProgress
);
router.patch(
    "/:tripId/completed",
    mustAuth,
    mustRoles("driver"),
    updateTripStateToCompleted
);

export default router;
