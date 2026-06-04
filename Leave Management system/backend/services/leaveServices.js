import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";

export const applyLeaveService = async (leaveData) => {
  const { employeeId, leaveType, startDate, endDate, reason } = leaveData;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const balance = await LeaveBalance.findOne({ employeeId });
  if (!balance) {
    throw new Error("Leave balance record not found for this staff member.");
  }

  if (balance[leaveType] < duration) {
    throw new Error(
      `Insufficient leave balance. You requested ${duration} days but only have ${balance[leaveType]} left.`,
    );
  }

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
