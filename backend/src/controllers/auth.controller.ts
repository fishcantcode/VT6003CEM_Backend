import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { User } from "../models/user.model";
import {
  passwordHash,
  passwordCompare,
  TokenGenerator,
} from "../services/auth.service";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Please enter a valid password"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  operatorCode: z.string().optional(), // Optional: only for operator registration
}).strip();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.password) {
      res.status(401).json({ message: "email or password is invalid, please try again" });
      return;
    }
    const isPasswordValid = await passwordCompare(password, user.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: "email or password is invalid, please try again" });
      return;
    }
    user.lastLoginAt = new Date();
    await user.save();
    const token = TokenGenerator(user);
    res
      .status(200)
      .json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ 
        message: 'Invalid input.', 
        errors: validation.error.errors 
      });
      return;
    }

    const { username, email, password, operatorCode, firstname, lastname } = validation.data;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(409)
        .json({
          message: "Account associated with this email already exists",
        });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let role: "user" | "operator" = "user";
    if (operatorCode) {
      if (operatorCode === process.env.OPERATOR_SECRET_CODE) {
        role = "operator";
      } else {
        res.status(403).json({ message: "Invalid operator code" });
        return;
      }
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      isEmployee: role === "operator",
      profile: {
        firstName: firstname,
        lastName: lastname,
      },
    });
    const token = TokenGenerator(newUser);
    res
      .status(201)
      .json({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {

  res.status(200).json({ message: "Logged out successfully" });
}
