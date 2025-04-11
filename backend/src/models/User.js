'use strict';
const { Model, DataTypes } = require('sequelize');
// const { sequelize } = require('./index');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Product, {
        foreignKey: 'user_id',
        as: 'products'
      });
      User.hasMany(models.Invoice, {
        foreignKey: 'user_id',
        as: 'invoices'
      });
      User.hasMany(models.Customer, {
        foreignKey: 'user_id',
        as: 'customers'
      });
    }

    static async hashPassword(password) {
      return bcrypt.hash(password, 10);
    }

    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'user','customer'),
      allowNull: false,
      defaultValue: 'user'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reset_password_token'
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_password_expires'
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessType: {
      type: DataTypes.ENUM('kirana', 'retail', 'service', 'vendor'),
      allowNull: true
    },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['status']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await User.hashPassword(user.password);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await User.hashPassword(user.password);
        }
      }
    }
  });

  return User;
}; 