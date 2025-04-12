'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.hasMany(models.InvoiceItem, {
        foreignKey: 'product_id',
        as: 'invoice_items'
      });
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      this.hasMany(models.ProductVariant, {
        foreignKey: 'product_id',
        as: 'variants'
      });
      this.hasMany(models.ProductReview, {
        foreignKey: 'product_id',
        as: 'reviews'
      });
      this.belongsToMany(models.Tag, {
        through: models.ProductTag,
        foreignKey: 'product_id',
        otherKey: 'tag_id',
        as: 'tags'
      });
      this.hasMany(models.ProductHistory, {
        foreignKey: 'product_id',
        as: 'history'
      });
      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
      this.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updater'
      });
      this.hasMany(models.InventoryTransaction, {
        foreignKey: 'product_id',
        as: 'inventory_transactions'
      });
    }
  }

  Product.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [0, 50]
      }
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [0, 50]
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    hsn_code: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    stock_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    has_expiry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expiry_alert_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    min_stock_level: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    max_stock_level: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    reorder_point: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
      allowNull: false,
      defaultValue: 'active'
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    specifications: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'cost_price'
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'low_stock_threshold'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['sku']
      },
      {
        unique: true,
        fields: ['barcode']
      },
      {
        fields: ['category_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      }
    ]
  });

  return Product;
}; 