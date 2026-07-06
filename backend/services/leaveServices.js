import mongoose from "mongoose";
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

export const updateLeaveStatusService = async (
  leaveData,
  approverId,
  approverDept,
) => {
  const leave = await Leave.findById(leaveData._id)
    .populate("employeeId", "department")
    .select("leaveType status duration");
  if (!leave) {
    throw new Error("Leave application not found.");
  }
  if (approverDept !== leave.employeeId.department) {
    throw new Error("You can only manage leaves from your department ");
  }
  if (leave.status !== "Pending") {
    throw new Error("Only pending leave applications can be updated.");
  }

  if (!["Approved", "Rejected"].includes(leaveData.status)) {
    throw new Error(
      "Invalid status update. Status must be either 'Approved' or 'Rejected'.",
    );
  }
  if (leaveData.status === "Rejected" && !leaveData.rejectionReason) {
    throw new Error(
      "Rejection reason is required when rejecting a leave application.",
    );
  }

  if (leaveData.status === "Approved") {
    await deductLeaveBalance(leave.employeeId, leave.leaveType, leave.duration);
  }
  leave.status = leaveData.status;
  leave.approverId = approverId;
  leave.approvalDate = new Date();
  leave.rejectionReason =
    leaveData.status === "Rejected"
      ? leaveData.rejectionReason.trim().substring(0, 200)
      : undefined;

  return await leave.save();
};

export const getLeaveRecordsService = async ({
  status,
  leaveId,
  employeeId,
}) => {
  let query = {};

  if (status) {
    query.status = status;
  }

  if (employeeId) {
    query.employeeId = employeeId;
  }

  const leaveRecordfields = [
    "leaveType",
    "duration",
    "startDate",
    "endDate",
    "reason",
    "status",
    "createdAt",
    "employeeId",
  ];

  if (status === "Approved" || status === "Rejected" || !status) {
    leaveRecordfields.push("approverId", "approvalDate");
  }

  if (status === "Rejected" || !status) {
    leaveRecordfields.push("rejectionReason");
  }

  if (leaveId && mongoose.Types.ObjectId.isValid(leaveId)) {
    const referenceLeave = await Leave.findById(leaveId).select("updatedAt");

    if (referenceLeave) {
      query.updatedAt = { $lt: referenceLeave.updatedAt };
    }
  }

  return await Leave.find(query)
    .populate("employeeId", "firstName lastName department")
    .populate("approverId", "firstName lastName")
    .select(leaveRecordfields.join(" "))
    .limit(50)
    .sort({ updatedAt: -1 })
    .lean();
};
