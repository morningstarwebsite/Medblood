'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('donations', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      bloodGroup: {
        type: Sequelize.ENUM('A', 'B', 'AB', 'O'),
        allowNull: false
      },
      rhesusFactor: {
        type: Sequelize.ENUM('+', '-'),
        allowNull: false
      },
      quantityInBags: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      healthStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastTestDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      availabilityStatus: {
        type: Sequelize.ENUM('available', 'reserved', 'used', 'unavailable'),
        allowNull: false,
        defaultValue: 'available'
      },
      donorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      bloodTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'blood_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('donations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_donations_bloodGroup";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_donations_rhesusFactor";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_donations_availabilityStatus";');
  }
};
