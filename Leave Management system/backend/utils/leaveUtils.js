import LeaveBalance from "../models/LeaveBalance.js";

export const validateLeaveBalance = async (employeeId, leaveType, duration) => {
  const balance = await LeaveBalance.findOne({ employeeId });
  if (!balance) {
    throw new Error("Leave balance record not found for this staff member.");
  }

  if (balance[leaveType] < duration) {
    throw new Error(
      `Insufficient leave balance. You requested ${duration} days but only have ${balance[leaveType]} left.`,
    );
  }
};
