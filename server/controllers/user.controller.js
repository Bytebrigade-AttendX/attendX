import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { sendMail } from "../utils/mailer";
import prisma from "../db/db.config.js";
const loginOtpSend = async (req, res) => {
  const email = req.body.email;
  if (!email) throw new ApiError(400, "Email address required.");
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) throw new ApiError(404, "User not found.");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { otp },
  });
  const mailed = await sendMail(email, otp);
  if (!mailed)
    throw new ApiError(500, "Something went wrong. OTP mail not sent.");
  res.status(200).json(new ApiResponse(200, {}, "OTP mail sent successfully."));
};
const loginOtpVerify = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    throw new ApiError(400, "Email address and OTP required.");
  const user = await prisma.user.findFirst({
    where: { email: email },
  });
  if (!user) throw new ApiError(404, "User not found.");
};
export { loginOtpSend };
