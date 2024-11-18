// models/article_tag.js

export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define(
    "article_tag",
    {
      article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "article_tags",
      timestamps: false,
      underscored: true,
    }
  );

  return ArticleTag;
};
