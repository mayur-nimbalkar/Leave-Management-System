import {
  applyLeaveService,
  getAllLeaveRecordsByStatusService,
  getAllLeaveRecordsService,
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
    const leaveRecords = await getAllLeaveRecordsService(leaveId);
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
    const approverDept = req.user.department;

    const updatedLeave = await updateLeaveStatusService(
      leaveData,
      approverId,
      approverDept,
    );
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

export const getAllLeaveRecordsByStatusController = async (req, res) => {
  try {
    const { status } = req.params;
    const { leaveId } = req.query;
    const leaveRecords = await getAllLeaveRecordsByStatusService(
      status,
      leaveId,
    );
    return res.status(200).json({
      success: true,
      message: "Leave records fetched Successfully",
      data: leaveRecords,
    });
  } catch (error) {
    console.error("Get Leave Record By Status Error: ", error);
    return res.status(500).json({
      success: false,
      message: "server Error while fetching Data",
    });
  }
};
