import { Router } from "express";
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  updateVehicle
} from "../controllers/vehicle.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listVehicles);
router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
