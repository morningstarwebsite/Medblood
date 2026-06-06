'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('blood_types', [
      { bloodGroup: 'A', rhesusFactor: '+', code: 'A+', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'A', rhesusFactor: '-', code: 'A-', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'B', rhesusFactor: '+', code: 'B+', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'B', rhesusFactor: '-', code: 'B-', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'AB', rhesusFactor: '+', code: 'AB+', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'AB', rhesusFactor: '-', code: 'AB-', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'O', rhesusFactor: '+', code: 'O+', createdAt: new Date(), updatedAt: new Date() },
      { bloodGroup: 'O', rhesusFactor: '-', code: 'O-', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('blood_types', {
      code: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    }, {});
  }
};
