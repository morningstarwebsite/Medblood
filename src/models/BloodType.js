import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class BloodType extends Model {}

BloodType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bloodGroup: {
      type: DataTypes.ENUM('A', 'B', 'AB', 'O'),
      allowNull: false
    },
    rhesusFactor: {
      type: DataTypes.ENUM('+', '-'),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'BloodType',
    tableName: 'blood_types',
    indexes: [
      {
        unique: true,
        fields: ['bloodGroup', 'rhesusFactor']
      }
    ]
  }
);
