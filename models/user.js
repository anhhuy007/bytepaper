// models/user.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(50), // Phù hợp với schema VARCHAR(50)
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(100),
      },
      pen_name: {
        type: DataTypes.STRING(100),
      },
      dob: {
        type: DataTypes.DATE,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      subscription_expiration: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "users", // Khớp tên bảng trong cơ sở dữ liệu
      timestamps: true, // Đảm bảo `createdAt` và `updatedAt` hoạt động
      underscored: true, // Đảm bảo cột sẽ là snake_case (created_at)
    }
  );

  /**
   * Associations
   *
   * @param {object} models - Sequelize models
   */
  User.associate = (models) => {
    /**
     * User has many articles
     *
     * @type {object}
     */
    User.hasMany(models.article, { foreignKey: "authorId", as: "articles" });

    /**
     * User has many comments
     *
     * @type {object}
     */
    User.hasMany(models.comment, { foreignKey: "userId", as: "comments" });

    /**
     * User has one subscription
     *
     * @type {object}
     */
    User.hasOne(models.subscription, {
      foreignKey: "userId",
      as: "subscription",
    });

    /**
     * (Commented out) User belongs to many categories through EditorAssignment
     *
     * @type {object}
     */
    // User.belongsToMany(models.category, {
    //   through: models.EditorAssignment,
    //   foreignKey: "editorId",
    //   otherKey: "categoryId",
    //   as: "assignedCategories",
    // });
  };

  return User;
};
