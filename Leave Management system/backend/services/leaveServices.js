import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";
import {
  deductLeaveBalance,
  pendingLeaveCount,
  validateLeaveBalance,
} from "../utils/leaveUtils.js";

export const applyLeaveService = async (leaveData) => {
  const { employeeId, leaveType, startDate, endDate, reason } = leaveData;

  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  if (
    isNaN(start) ||
    isNaN(end) ||
    start < today ||
    end < today ||
    end < start
  ) {
    throw new Error("Invalid start or end date.");
  }
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  await validateLeaveBalance(employeeId, leaveType, duration);

  const newLeave = await Leave.create({
    employeeId,
    leaveType,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    duration,
    reason: reason.trim().substring(0, 200),
    status: "Pending",
  });
  return newLeave;
};

export const getLeaveRecordsService = async (leaveId) => {
  let query = {};

  if (leaveId) {
    const referenceLeave = await Leave.findById(leaveId).select("createdAt");

    if (referenceLeave) {
      query.createdAt = { $lt: referenceLeave.createdAt };
    }
  }
  return await Leave.find(query)
    .populate("employeeId", "first_name last_name department")
    .select("leaveType startDate endDate reason status createdAt")
    .limit(100)
    .sort({ createdAt: -1 });
};

export const updateLeaveStatusService = async (
  leaveData,
  approverId,
  newStatus,
) => {
  const leave = await Leave.findById(leaveData._id);
  if (!leave) {
    throw new Error("Leave application not found.");
  }
  if (leave.status !== "Pending") {
    throw new Error("Only pending leave applications can be updated.");
  }
  if (!["Approved", "Rejected"].includes(newStatus)) {
    throw new Error(
      "Invalid status update. Status must be either 'Approved' or 'Rejected'.",
    );
  }
  if (newStatus === "Rejected" && !leaveData.rejectionReason) {
    throw new Error(
      "Rejection reason is required when rejecting a leave application.",
    );
  }

  if (newStatus === "Approved") {
    const duration =
      Math.ceil(
        (new Date(leave.endDate) - new Date(leave.startDate)) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    await deductLeaveBalance(leave.employeeId, leave.leaveType, duration); 
  }

  leave.status = newStatus;
  leave.approverId = approverId;
  leave.approvalDate = new Date();

  if (leaveData.rejectionReason) {
    leave.rejectionReason = leaveData.rejectionReason;
  }
  return await leave.save();
};
