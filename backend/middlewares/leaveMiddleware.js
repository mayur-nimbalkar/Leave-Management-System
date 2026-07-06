export const validateLeaveInputs = (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({
      success: false,
      message:
        "Validation Error: All fields (leaveType, startDate, endDate, reason) are required.",
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return res.status(400).json({
      success: false,
      message:
        "Validation Error: End date cannot be earlier than the start date.",
    });
  }
  if (reason.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "Validation Error: Please enter a reason for the leave application.",
    });
  }
  next();
};

export const hodGuard = (req, res, next) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. You do not have permission to perform this action.",
    });
  }
  next();
};
