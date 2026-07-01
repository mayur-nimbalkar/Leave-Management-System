import { registerService, loginService } from "../services/authServices.js";
export const registerController = async (req, res) => {
  try {
    const payload = await registerService(req.body);

    return res.status(201).json({
      success: true,
      token: payload.token,
      user: payload.user,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);
    if (error.message === "An account with this email already exists") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const loginData = req.body;
    const result = await loginService(loginData);
    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login Controller Error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};