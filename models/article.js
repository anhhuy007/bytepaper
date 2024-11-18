// models/article.js

export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "article",
    {
      article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      abstract: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      featured_image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
      },
      author_id: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      is_premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      published_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "articles",
      timestamps: true,
      underscored: true,
    }
  );

  /**
   * Associations
   *
   * @param {object} models - Sequelize models
   */
  Article.associate = (models) => {
    /**
     * Article belongs to a category
     *
     * @type {object}
     */
    Article.belongsTo(models.category, { foreignKey: "category_id" });

    /**
     * Article belongs to a user (author)
     *
     * @type {object}
     */
    Article.belongsTo(models.user, { foreignKey: "author_id" });

    /**
     * Article has many comments
     *
     * @type {object}
     */
    Article.hasMany(models.comment, { foreignKey: "article_id" });

    /**
     * Article belongs to many tags
     *
     * @type {object}
     */
    Article.belongsToMany(models.tag, {
      through: models.article_tag,
      foreignKey: "article_id",
    });
  };

  return Article;
};
