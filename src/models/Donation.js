import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class Donation extends Model {}

Donation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bloodGroup: {
      type: DataTypes.ENUM('A', 'B', 'AB', 'O'),
      allowNull: false
    },
    rhesusFactor: {
      type: DataTypes.ENUM('+', '-'),
      allowNull: false
    },
    quantityInBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    healthStatus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastTestDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    availabilityStatus: {
      type: DataTypes.ENUM('available', 'reserved', 'used', 'unavailable'),
      allowNull: false,
      defaultValue: 'available'
    },
    donorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    bloodTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Donation',
    tableName: 'donations'
  }
);
