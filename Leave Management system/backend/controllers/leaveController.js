import {
  applyLeaveService,
  getLeaveRecordsService,
  updateLeaveStatusService,
} from "../services/leaveServices.js";

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

export const getLeaveRecordsController = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const leaveRecords = await getLeaveRecordsService(leaveId);
    return res.status(200).json({
      success: true,
      message: "Leave records fetched successfully.",
      data: leaveRecords,
    });
  } catch (error) {
    console.error("Get Leave Records Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching leave records.",
    });
  }
};

export const updateLeaveStatusController = async (req, res) => {
  try {
    const leaveData = req.body;
    const approverId = req.user.userId;
    const updatedLeave = await updateLeaveStatusService(leaveData, approverId);
    return res.status(200).json({
      success: true,
      message: "Leave status updated successfully.",
      data: updatedLeave,
    });
  } catch (error) {
    console.error("Update Leave Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating leave status.",
    });
  }
};
