import express from "express";
import {
  applyLeaveController,
  getLeaveRecordsServiceController,
  updateLeaveStatusController,
} from "../controllers/leaveController.js";
import { authGuard, roleGuard } from "../middlewares/authGuard.js";
import Leave from "../models/Leave.js";
import { validateLeaveInputs } from "../middlewares/leaveMiddleware.js";

const router = express.Router();

router.post("/apply", authGuard, validateLeaveInputs, applyLeaveController);

router.patch(
  "/update",
  authGuard,
  roleGuard(["hod"]),
  updateLeaveStatusController,
);

router.get(
  "/records/",
  authGuard,
  roleGuard(["hod", "staff"]),
  getLeaveRecordsServiceController,
);
export default router;
