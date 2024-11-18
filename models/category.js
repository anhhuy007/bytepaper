// models/category.js

export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pcategory_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "categories",
      timestamps: false,
      underscored: true,
    }
  );

  /**
   * Associations
   *
   * @param {object} models - Sequelize models
   */
  Category.associate = (models) => {
    /**
     * Category has many articles
     *
     * @type {object}
     */
    Category.hasMany(models.article, { foreignKey: "category_id" });

    /**
     * Category belongs to another category (parent)
     *
     * @type {object}
     */
    Category.belongsTo(models.category, {
      foreignKey: "pcategory_id",
      as: "parentCategory",
    });
  };

  return Category;
};
