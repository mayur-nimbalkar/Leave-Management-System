import { applyLeaveService } from "../services/leaveServices.js";

export const applyLeaveController = async (req, res) => {
  try {
    const leaveData = {
      ...req.body,
      employeeId: req.user.userId,
    };

    const newLeave = await applyLeaveService(leaveData);

    return res.status(201).json({
      success: true,
      message: "Leave application submitted successfully.",
      data: newLeave,
    });
  } catch (error) {
    console.error("Apply Leave Error:", error.message);

    if (
      error.message.includes("Insufficient") ||
      error.message.includes("not found")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while processing leave application.",
    });
  }
};
