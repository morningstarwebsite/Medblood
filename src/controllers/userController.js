import { Donation, User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt']
  });

  res.status(200).json({
    success: true,
    data: users
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await user.update({ role });

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    include: [{ model: Donation, as: 'donations' }]
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await user.destroy();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});
