// models/subscription.js

export default (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "subscription",
    {
      subscription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "subscriptions",
      timestamps: false,
      underscored: true,
    }
  );

  /**
   * Associations
   *
   * @param {object} models - Sequelize models
   */
  Subscription.associate = (models) => {
    /**
     * Subscription belongs to a user
     *
     * @type {object}
     */
    Subscription.belongsTo(models.user, { foreignKey: "user_id" });
  };

  return Subscription;
};
