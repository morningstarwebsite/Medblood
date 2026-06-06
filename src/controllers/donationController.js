import { Op } from 'sequelize';
import { BloodType, Donation, User } from '../models/index.js';
import { getCompatibleDonorsForRecipient } from '../services/compatibilityService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

const getDonationByIdOrFail = async (id) => {
  const donation = await Donation.findByPk(id, {
    include: [
      {
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'email', 'role']
      }
    ]
  });

  if (!donation) {
    throw new ApiError(404, 'Donation not found');
  }

  return donation;
};

const ensureDonorCanAccessDonation = (donation, user) => {
  if (user.role === 'donor' && donation.donorId !== user.id) {
    throw new ApiError(403, 'Donors can only access their own donation records');
  }
};

export const createDonation = asyncHandler(async (req, res) => {
  if (req.user.role !== 'donor' && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only donors and admins can create donation records');
  }

  const donorId = req.user.role === 'admin' && req.body.donorId ? req.body.donorId : req.user.id;

  if (req.user.role === 'admin' && req.body.donorId) {
    const donor = await User.findByPk(req.body.donorId);
    if (!donor || donor.role !== 'donor') {
      throw new ApiError(400, 'donorId must belong to an existing donor user');
    }
  }

  const bloodType = await BloodType.findOne({
    where: {
      bloodGroup: req.body.bloodGroup,
      rhesusFactor: req.body.rhesusFactor
    }
  });

  if (!bloodType) {
    throw new ApiError(400, 'Invalid blood type combination');
  }

  const donation = await Donation.create({
    ...req.body,
    donorId,
    bloodTypeId: bloodType.id
  });

  res.status(201).json({
    success: true,
    message: 'Donation created successfully',
    data: donation
  });
});

export const getDonations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, bloodGroup, rhesusFactor, location } = req.query;
  const pagination = getPagination(page, limit);

  const where = {};

  if (bloodGroup) {
    where.bloodGroup = bloodGroup;
  }

  if (rhesusFactor) {
    where.rhesusFactor = rhesusFactor;
  }

  if (location) {
    where.location = { [Op.iLike]: `%${location}%` };
  }

  if (req.user.role === 'donor') {
    where.donorId = req.user.id;
  }

  const { rows, count } = await Donation.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']],
    offset: pagination.offset,
    limit: pagination.limit
  });

  res.status(200).json({
    success: true,
    data: rows,
    meta: getPaginationMeta(count, pagination.page, pagination.limit)
  });
});

export const getDonationById = asyncHandler(async (req, res) => {
  const donation = await getDonationByIdOrFail(req.params.id);
  ensureDonorCanAccessDonation(donation, req.user);

  res.status(200).json({
    success: true,
    data: donation
  });
});

export const updateDonation = asyncHandler(async (req, res) => {
  const donation = await getDonationByIdOrFail(req.params.id);
  ensureDonorCanAccessDonation(donation, req.user);

  const payload = { ...req.body };

  if (payload.bloodGroup || payload.rhesusFactor) {
    const bloodGroup = payload.bloodGroup || donation.bloodGroup;
    const rhesusFactor = payload.rhesusFactor || donation.rhesusFactor;

    const bloodType = await BloodType.findOne({
      where: { bloodGroup, rhesusFactor }
    });

    if (!bloodType) {
      throw new ApiError(400, 'Invalid blood type combination');
    }

    payload.bloodTypeId = bloodType.id;
    payload.bloodGroup = bloodGroup;
    payload.rhesusFactor = rhesusFactor;
  }

  await donation.update(payload);

  res.status(200).json({
    success: true,
    message: 'Donation updated successfully',
    data: donation
  });
});

export const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await getDonationByIdOrFail(req.params.id);
  ensureDonorCanAccessDonation(donation, req.user);

  await donation.destroy();

  res.status(200).json({
    success: true,
    message: 'Donation deleted successfully'
  });
});

export const findCompatibleDonors = asyncHandler(async (req, res) => {
  const { bloodGroup, rhesusFactor, location } = req.query;

  const compatibleCodes = getCompatibleDonorsForRecipient(bloodGroup, rhesusFactor);
  const compatibleTypes = compatibleCodes.map((code) => {
    const factor = code.endsWith('-') ? '-' : '+';
    const group = code.replace(/[+-]$/, '');
    return { bloodGroup: group, rhesusFactor: factor };
  });

  const where = {
    availabilityStatus: 'available',
    [Op.or]: compatibleTypes
  };

  if (location) {
    where.location = { [Op.iLike]: `%${location}%` };
  }

  const donations = await Donation.findAll({
    where,
    include: [
      {
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    success: true,
    requestedType: `${bloodGroup}${rhesusFactor}`,
    compatibleDonorTypes: compatibleCodes,
    data: donations
  });
});
