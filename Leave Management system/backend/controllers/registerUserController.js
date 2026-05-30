import registerService from "../services/registerUserService.js";

const registerController = async (req, res) => {
  try {
    const userData = req.body;
    const savedUser = await registerService(userData);
    
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default registerController;
