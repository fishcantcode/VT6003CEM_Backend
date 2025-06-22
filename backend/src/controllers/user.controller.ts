import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';
import { User } from "../models/user.model";

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;
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
};

const updateUserProfileSchema = z.object({
  profile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.avatar = req.file.buffer;
    await user.save();

    res.status(200).json({ message: 'Avatar uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication error.' });
      return;
    }

    const validation = updateUserProfileSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Invalid input.', errors: validation.error.errors });
      return;
    }

    const { profile } = validation.data;

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    if (profile) {
      user.profile.firstName = profile.firstName ?? user.profile.firstName;
      user.profile.lastName = profile.lastName ?? user.profile.lastName;
      user.profile.bio = profile.bio ?? user.profile.bio;
      
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        role: user.role,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: 'Server error.', error: errorMessage });
  }

}