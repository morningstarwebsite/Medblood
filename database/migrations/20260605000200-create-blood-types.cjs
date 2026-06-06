'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blood_types', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bloodGroup: {
        type: Sequelize.ENUM('A', 'B', 'AB', 'O'),
        allowNull: false
      },
      rhesusFactor: {
        type: Sequelize.ENUM('+', '-'),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await queryInterface.addConstraint('blood_types', {
      fields: ['bloodGroup', 'rhesusFactor'],
      type: 'unique',
      name: 'blood_types_group_factor_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('blood_types', 'blood_types_group_factor_unique');
    await queryInterface.dropTable('blood_types');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_blood_types_bloodGroup";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_blood_types_rhesusFactor";');
  }
};
