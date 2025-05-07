import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, //in ms
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
