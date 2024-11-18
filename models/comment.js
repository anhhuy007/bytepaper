// models/comment.js

export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "comments",
      timestamps: false,
      underscored: true,
    }
  );

  /**
   * Associations
   *
   * @param {object} models - Sequelize models
   */
  Comment.associate = (models) => {
    /**
     * Comment belongs to an article
     *
     * @type {object}
     */
    Comment.belongsTo(models.article, { foreignKey: "article_id" });

    /**
     * Comment belongs to a user
     *
     * @type {object}
     */
    Comment.belongsTo(models.user, { foreignKey: "user_id" });
  };

  return Comment;
};
