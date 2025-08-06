import { Request, Response } from 'express';
import User from '../models/User.model';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /api/users?role=agent | Admin only
export const getUsersByRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.query;

    if (!role || typeof role !== 'string') {
      return res.status(400).json({ message: 'Role query is required' });
    }

    const users = await User.find({ role }).select('_id name email role');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
