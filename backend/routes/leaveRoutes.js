import express from "express";
import {
  applyLeaveController,
  getLeaveRecordsServiceController,
  getStats,
  updateLeaveStatusController,
} from "../controllers/leaveController.js";
import { authGuard, roleGuard } from "../middlewares/authGuard.js";
import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";
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

router.get("/balance", authGuard, async (req, res) => {
  try {
    const balance = await LeaveBalance.findOne({ employeeId: req.user.userId });
    if (!balance) {
      return res.status(404).json({
        success: false,
        message: "Leave balance not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        CL: balance.CL,
        SL: balance.SL,
        EL: balance.EL,
        CompOff: balance.compOff,
      },
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching leave balance",
    });
  }
});

router.get("/statistics", authGuard, getStats);
export default router;
