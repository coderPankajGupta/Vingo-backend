import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendMail } from "../utils/mail.js";

// signup users
export async function signUp(req, res) {
  const { fullName, email, mobile, role, password } = req.body;

  try {
    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exist",
        success: false,
      });
    }

    if (mobile.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be 10 digits.",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password length must be 6 characters.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      mobile,
      role,
      password: hashedPassword,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User created",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to SignUp",
      success: false,
      error: error.message,
    });
  }
}

// Sign in user
export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const userExist = await userModel.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        message: "Email not exist.",
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);

    if (!checkPassword) {
      return res.status(404).json({
        message: "Password doest'n match.",
        success: false,
      });
    }

    const token = await genToken(userExist._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User Logged In",
      success: true,
      data: userExist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during login",
      success: false,
      error: error.message,
    });
  }
}

// Sign out User
export async function signOut(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during logged out user.",
      error: error.message,
      success: false,
    });
  }
}

// send otp
export async function sendOTP(req, res) {
  const { email } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "Email does not exist.",
        success: false,
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    existingUser.resetOtp = hashedOtp;
    existingUser.otpExpires = Date.now() + 5 * 60 * 1000;
    existingUser.isOtpVerified = false;
    await existingUser.save();

    await sendMail(email, otp);
    return res.status(200).json({
      message: "OTP send succesfull",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during sending otp.",
      error: error.message,
      success: false,
    });
  }
}

// comparing otp
export async function verifyOTP(req, res) {
  const { email, otp } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser || existingUser.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "Time Expires.",
        success: false,
      });
    }
    const verify = await bcrypt.compare(otp, existingUser.resetOtp);
    if (!verify) {
      return res.status(400).json({
        message: "OTP not maches",
        success: false,
      });
    }
    existingUser.isOtpVerified = true;
    existingUser.resetOtp = undefined;
    existingUser.otpExpires = undefined;
    await existingUser.save();

    return res.status(200).json({
      message: "OTP verified",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during comparing otp",
      error: error.message,
      success: false,
    });
  }
}

// reseting password
export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({
        message: "OTP verification required",
        success: false,
      });
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({
      message: "Password reset success.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Password not reset succesfull",
      error: error.message,
      success: false,
    });
  }
}

// sing-up/sign-in with google
export async function googleAuth(req, res) {
  const { fullName, email, mobile, role } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        fullName,
        email,
        mobile,
        role,
      });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Success with Google.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during sign-up with Google.",
      error: error.message,
      success: false,
    });
  }
}
