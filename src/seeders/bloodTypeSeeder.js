import { BloodType } from '../models/index.js';

const BLOOD_TYPES = [
  { bloodGroup: 'A', rhesusFactor: '+', code: 'A+' },
  { bloodGroup: 'A', rhesusFactor: '-', code: 'A-' },
  { bloodGroup: 'B', rhesusFactor: '+', code: 'B+' },
  { bloodGroup: 'B', rhesusFactor: '-', code: 'B-' },
  { bloodGroup: 'AB', rhesusFactor: '+', code: 'AB+' },
  { bloodGroup: 'AB', rhesusFactor: '-', code: 'AB-' },
  { bloodGroup: 'O', rhesusFactor: '+', code: 'O+' },
  { bloodGroup: 'O', rhesusFactor: '-', code: 'O-' }
];

export const seedBloodTypes = async () => {
  for (const bloodType of BLOOD_TYPES) {
    await BloodType.findOrCreate({
      where: { code: bloodType.code },
      defaults: bloodType
    });
  }
};
