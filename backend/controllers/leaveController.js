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

export const getLeaveRecordsServiceController = async (req, res) => {
  try {
    let { status, leaveId, employeeId } = req.query;

    const loggedInUser = req.user;

    if (loggedInUser.role !== "hod") {
      employeeId = loggedInUser.userId;
    }

    const leaveRecords = await getLeaveRecordsService({
      status,
      leaveId,
      employeeId,
      department: loggedInUser.department,
      isHod: loggedInUser.role === "hod",
    });

    return res.status(200).json({
      success: true,
      message: "Leave records fetched Successfully",
      data: leaveRecords,
    });
  } catch (error) {
    console.error("Get Leave Record Error: ", error);
    return res.status(500).json({
      success: false,
      message: "server Error while fetching Data",
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await getLeaveStatistics(userId);

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
};
