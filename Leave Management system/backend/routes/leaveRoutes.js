import express from "express";
import {
  applyLeaveController,
  getAllLeaveRecordsByStatusController,
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
  roleGuard(["hod"]),
  getLeaveRecordsController,
);
router.patch(
  "/update",
  authGuard,
  roleGuard(["hod"]),
  updateLeaveStatusController,
);

router.get(
  "/records/:status/",
  authGuard,
  roleGuard(["hod"]),
  getAllLeaveRecordsByStatusController,
);
export default router;
