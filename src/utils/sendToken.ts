import { Response } from "express";
import { IUser } from "../models/User.model";
import generateToken from "./generateToken";

const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  const token = generateToken(user._id.toString());

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export default sendTokenResponse;
