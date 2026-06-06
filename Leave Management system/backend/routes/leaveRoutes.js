import express from "express";
import {
  applyLeaveController,
  getLeaveRecordsController,
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
export default router;
