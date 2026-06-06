import { Router } from 'express';
import { deleteUser, getUsers, updateUserRole } from '../controllers/userController.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { updateUserRoleValidation } from '../validators/userValidator.js';

const router = Router();

router.use(authorizeRoles('admin'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRoleValidation, validateRequest, updateUserRole);
router.delete('/:id', deleteUser);

export default router;
