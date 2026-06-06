import { Router } from 'express';
import {
  createDonation,
  deleteDonation,
  findCompatibleDonors,
  getDonationById,
  getDonations,
  updateDonation
} from '../controllers/donationController.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  compatibilityValidation,
  createDonationValidation,
  donationListValidation,
  updateDonationValidation
} from '../validators/donationValidator.js';

const router = Router();

router.get('/', donationListValidation, validateRequest, getDonations);
router.get('/compatible', compatibilityValidation, validateRequest, authorizeRoles('hospital', 'admin'), findCompatibleDonors);
router.get('/:id', getDonationById);

router.post('/', createDonationValidation, validateRequest, authorizeRoles('donor', 'admin'), createDonation);
router.patch('/:id', updateDonationValidation, validateRequest, authorizeRoles('donor', 'admin'), updateDonation);
router.delete('/:id', authorizeRoles('donor', 'admin'), deleteDonation);

export default router;
