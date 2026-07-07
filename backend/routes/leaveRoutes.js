import express from "express";
import {
  applyLeaveController,
  getLeaveRecordsServiceController,
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

// New endpoints for balance and statistics
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

router.get("/statistics", authGuard, async (req, res) => {
  try {
    const stats = await Leave.aggregate([
      { $match: { employeeId: req.user.userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats[0] || { total: 0, pending: 0, approved: 0, rejected: 0 };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
});

export default router;
