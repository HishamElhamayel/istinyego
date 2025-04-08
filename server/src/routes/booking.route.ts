import {
    createBooking,
    deleteBooking,
    getBookingsByUserId,
} from "#/controller/booking.controller";
import { mustAuth } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { CreateBookingSchema } from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post("/book", mustAuth, validate(CreateBookingSchema), createBooking);
router.get("/bookings-by-userId", mustAuth, getBookingsByUserId);
router.delete("/:id", mustAuth, deleteBooking);

export default router;
