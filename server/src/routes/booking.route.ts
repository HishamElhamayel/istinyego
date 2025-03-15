import { createBooking } from "#/controller/booking.controller";
import { mustAuth } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/create", mustAuth, createBooking);

export default router;
