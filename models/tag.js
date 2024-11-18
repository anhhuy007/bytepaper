// models/tag.js

export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "tag",
    {
      tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tag_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "tags",
      timestamps: false,
      underscored: true,
    }
  );

  /**
   * Associations
   *
   * @param {object} models - Sequelize models
   */
  Tag.associate = (models) => {
    /**
     * Tag belongs to many articles
     *
     * @type {object}
     */
    Tag.belongsToMany(models.article, {
      through: models.article_tag,
      foreignKey: "tag_id",
    });
  };

  return Tag;
};
