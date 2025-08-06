import { Request, Response } from "express";
import User, { IUser } from "../models/User.model";
import generateToken from "../utils/generateToken";
import sendTokenResponse from "../utils/sendToken";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = (await User.findOne({ email })) as IUser | null;
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createdUser = (await User.create({
      name,
      email,
      password,
      role,
    })) as IUser;

    sendTokenResponse(createdUser, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//================================================================================================================================//


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUser | null;
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


//================================================================================================================================//


export const getMe = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const { _id, name, email, role } = req.user;
  res.status(200).json({ _id, name, email, role });
};

//================================================================================================================================//


// LOGIN CREDENTIALS

// {
//     "name":"admin",
//     "email":"admin@123.com",
//     "password":"admin123",
//     "role":"admin"
// }

// {
//     "name":"customer1",
//     "email":"customer@123.com",
//     "password":"customer123",
//     "role":"customer"
// }

// {
//     "name":"agent",
//     "email":"agent@123.com",
//     "password":"agent123",
//     "role":"agent"
// }
