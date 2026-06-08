import express from "express";
import {
  applyLeaveController,
  getLeaveRecordsController,
  updateLeaveStatusController,
} from "../controllers/leaveController.js";
import { authGuard, roleGuard } from "../middlewares/authGuard.js";
import Leave from "../models/Leave.js";
import { validateLeaveInputs } from "../middlewares/leaveMiddleware.js";

const router = express.Router();

router.post("/apply", authGuard, validateLeaveInputs, applyLeaveController);
router.get(
  "/records",
  authGuard,
  roleGuard(["HOD"]),
  getLeaveRecordsController,
);
router.patch(
  "/update",
  authGuard,
  roleGuard(["HOD"]),
  updateLeaveStatusController,
);

export default router;
