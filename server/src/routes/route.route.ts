import {
    createRoute,
    deleteRoute,
    getAllRoutes,
    getDestination,
    getFavRoutes,
    getRouteById,
    toggleFavRoute,
    updateRoute,
} from "#/controller/route.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { CreateRouteSchema } from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    mustRoles("admin"),
    validate(CreateRouteSchema),
    createRoute
);
router.get("/", getAllRoutes);
router.get("/get-fav-routes", mustAuth, getFavRoutes);
router.get("/:id", getRouteById);
router.get("/destination/:id", getDestination);
router.post("/toggle-fav-route/:id", mustAuth, toggleFavRoute);
router.patch("/:id", mustAuth, mustRoles("admin"), updateRoute);
router.delete("/:id", mustAuth, mustRoles("admin"), deleteRoute);

export default router;
