import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";
import { validateLeaveBalance } from "../utils/leaveUtils.js";

export const applyLeaveService = async (leaveData) => {
  const { employeeId, leaveType, startDate, endDate, reason } = leaveData;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  await validateLeaveBalance(employeeId, leaveType, duration);

  const newLeave = await Leave.create({
    employeeId,
    leaveType,  
    startDate,
    endDate,
    reason,
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

export const updateLeaveStatusService = async (leaveData, newStatus) => {
  const leave = await Leave.findById(leaveData._id);
  if (!leave) {
    throw new Error("Leave application not found.");
  }

  leave.status = newStatus;
  return await leave.save();
};
