import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] }, // Exclude password from the response
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: errorMessage });
    }
}