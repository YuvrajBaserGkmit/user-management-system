'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  UserPreference.init(
    {
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'users',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserPreference',
      tableName: 'user_preferences',
      paranoid: true,
    },
  );
  return UserPreference;
};
