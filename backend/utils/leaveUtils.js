import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";

export const validateLeaveBalance = async (employeeId, leaveType, duration) => {
  const balance = await LeaveBalance.findOne({ employeeId });
  if (!balance) {
    throw new Error("Leave balance record not found for this staff member.");
  }
  let pendingCount = await pendingLeaveCount(employeeId, leaveType);

  if (balance[leaveType] < duration + pendingCount) {
    throw new Error(
      `Insufficient leave balance. You have ${balance[leaveType]} days left and ${pendingCount} pending ${leaveType} day(s). You cannot apply for ${duration} more days.`,
    );
  }
  return true;
};

export const deductLeaveBalance = async (employeeId, leaveType, duration) => {
  const balance = await LeaveBalance.findOne({ employeeId });
  if (!balance) throw new Error("Leave balance record not found.");
  if (balance[leaveType] < duration) {
    throw new Error(
      `Insufficient balance. Only ${balance[leaveType]} days left.`,
    );
  }
  balance[leaveType] -= duration;
  await balance.save();
};

export const pendingLeaveCount = async (employeeId, leaveType) => {
  const pendingLeave = await Leave.find({
    employeeId,
    leaveType: leaveType,
    status: "Pending",
  })
    .select("duration")
    .lean();
  return pendingLeave.reduce((total, leave) => total + leave.duration, 0);
};
