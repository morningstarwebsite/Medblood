import { User } from './User.js';
import { BloodType } from './BloodType.js';
import { Donation } from './Donation.js';

export const initializeModels = () => {
  User.hasMany(Donation, { foreignKey: 'donorId', as: 'donations', onDelete: 'CASCADE' });
  Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor', onDelete: 'CASCADE' });

  BloodType.hasMany(Donation, { foreignKey: 'bloodTypeId', as: 'donations' });
  Donation.belongsTo(BloodType, { foreignKey: 'bloodTypeId', as: 'bloodType' });
};

export { User, BloodType, Donation };
