import { BloodType } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getBloodTypes = asyncHandler(async (req, res) => {
  const bloodTypes = await BloodType.findAll({
    order: [
      ['bloodGroup', 'ASC'],
      ['rhesusFactor', 'ASC']
    ]
  });

  res.status(200).json({
    success: true,
    data: bloodTypes
  });
});
