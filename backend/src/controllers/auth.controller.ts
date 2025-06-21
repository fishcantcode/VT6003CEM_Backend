import { Request, Response } from "express";
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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  operatorCode: z.string().optional(),
});

/**
 * Logs a user in with the given email and password.
 * If the user is found and the password is valid, a JWT token is returned
 * with the user's id, username, email, and role in the response body.
 * @param req Express request object
 * @param res Express response object
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordValid = await passwordCompare(password, user.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: "email or password is invalid, please try again" });
      return;
    }
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
/**
 * Registers a new user with the given details. If the email address is already associated with an account, a 409 Conflict status code is returned.
 * If the operatorCode matches the OPERATOR_CODE environment variable, the role is set to "operator", otherwise it is set to "user".
 * On success, a 201 Created status code is returned with the user's JWT and a JSON object containing their id, username, email, and role.
 * @param req Express request object
 * @param res Express response object
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, firstname, lastname, operatorCode } =
      registerSchema.parse(req.body);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(409)
        .json({
          message: "Account assiociated with this email already exists",
        });
      return;
    }

    let role: "user" | "operator" = "user";
    if (operatorCode && operatorCode === process.env.OPERATOR_CODE) {
      role = "operator";
    }

    const hashedPassword = await passwordHash(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role,
      isEmployee: role === "operator",
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
  // Invalidate the token on the client side
  res.status(200).json({ message: "Logged out successfully" });
}
