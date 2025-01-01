const { Client } = require("pg");
const fs = require("fs");

const client = new Client({
  connectionString:
    "postgresql://neondb_owner:N5YlDr7aZbWC@ep-misty-haze-a7lbypiu.ap-southeast-2.aws.neon.tech/neondb?sslmode=require",
});

/*
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 */
async function uploadCategories() {
  await client.connect();

  const data = JSON.parse(fs.readFileSync("./categories.json", "utf8"));

  await client.query("ALTER SEQUENCE categories_id_seq RESTART WITH 1");
  // await client.query("TRUNCATE TABLE categories RESTART IDENTITY");
  for (const category of data) {
    const query1 = `
        INSERT INTO categories (name)
        VALUES ($1) RETURNING id
      `;

    const query2 = `
        INSERT INTO categories (name, parent_id)
        VALUES ($1, $2)
      `;

    const mainCategory = category.category;
    const subCategories = category.subcategories;

    // insert main category
    let result;
    try {
      result = await client.query(query1, [mainCategory]);
      console.log(`Inserted category: ${result.rows[0].id}`);
    } catch (err) {
      console.error(`Failed to insert category: ${mainCategory}`, err);
    }

    const id = result.rows[0].id;

    for (const subCategory of subCategories) {
      try {
        await client.query(query2, [subCategory, id]);
        console.log(`Inserted subcategory: ${subCategory}`);
      } catch (err) {
        console.error(`Failed to insert subcategory: ${subCategory}`, err);
      }
    }
    // insert subcategories
  }

  await client.end();
}

async function uploadUsers() {
  await client.connect();

  const data = JSON.parse(fs.readFileSync("./users.json", "utf8"));

  // await client.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
  // await client.query("TRUNCATE TABLE users RESTART IDENTITY");

  for (const user of data) {
    const query = `
      INSERT INTO users (
        username, 
        password_hash, 
        email, 
        full_name, 
        pen_name, 
        date_of_birth, 
        role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    user.password_hash =
      "$2b$10$GMfhreBL1tJQwbQR6UOwsObe4fWEcH8RfKjNcMcSTXPsF2Epw6J8."; // password: 123456

    try {
      await client.query(query, [
        user.username,
        user.password_hash,
        user.email,
        user.full_name,
        user.pen_name,
        user.date_of_birth,
        user.role,
      ]);
      console.log(`Inserted user: ${user.username}`);
    } catch (err) {
      console.error(`Failed to insert user: ${user.username}`, err);
    }
  }

  await client.end();
}

async function uploadTags() {
  await client.connect();

  const data = JSON.parse(fs.readFileSync("./tags.json", "utf8"));

  await client.query("ALTER SEQUENCE tags_id_seq RESTART WITH 1");
  // await client.query("TRUNCATE TABLE tags RESTART IDENTITY");

  for (const tag of data) {
    const query = `
      INSERT INTO tags (name) 
      VALUES ($1)
    `;

    try {
      await client.query(query, [tag.name]);
      console.log(`Inserted tag: ${tag.name}`);
    } catch (err) {
      console.error(`Failed to insert tag: ${tag.name}`, err);
    }
  }

  await client.end();
}

async function uploadArticles() {
  await client.connect();

  const data = JSON.parse(fs.readFileSync("./articles.json", "utf8"));

  await client.query("ALTER SEQUENCE articles_id_seq RESTART WITH 1");
  // await client.query("TRUNCATE TABLE articles RESTART IDENTITY");

  // get all writers
  const writers = await client.query(
    "SELECT id FROM users WHERE role = 'writer'"
  );
  const writerIds = writers.rows.map((writer) => writer.id);

  // get all categories => create [subcategory_id, name] map
  const subcategories = await client.query(
    "SELECT id, name FROM categories WHERE parent_id IS NOT NULL"
  );
  const subcategoryIds = subcategories.rows.map((subcategory) => [
    subcategory.id,
    subcategory.name,
  ]);

  console.log(subcategoryIds);

  for (const article of data) {
    const query = `
      INSERT INTO articles (
        title, 
        abstract,
        content,
        thumbnail, 
        author_id, 
        category_id,
        status, 
        published_at,
        views, 
        is_premium, 
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    article.author_id = writerIds[Math.floor(Math.random() * writerIds.length)];

    const articleCategory =
      article.categories.length > 1
        ? article.categories[1]
        : article.categories[0];
    if (articleCategory === "Thế giới") {
      articleCategory = "Tin tức quốc tế";
    }
    const subcategory = subcategoryIds.find(
      (subcategory) => subcategory[1] === articleCategory
    );

    if (!subcategory) {
      // console.log("Subcategory not found: ", articleCategory);
      continue;
    }

    article.category_id = subcategory[0];
    article.status = "published";
    article.views = Math.floor(Math.random() * 1000) + 1;
    article.created_at = new Date();
    article.updated_at = new Date();

    console.log(
      `Article: ${article.title}, Category: ${subcategory}, Author: ${article.author_id}`
    );

    try {
      await client.query(query, [
        article.title,
        article.abstract,
        article.content,
        article.top_image,
        article.author_id,
        article.category_id,
        article.status,
        article.published_at,
        article.views,
        article.is_premium,
        article.created_at,
        article.updated_at,
      ]);
      console.log(`Inserted article: ${article.title}`);
    } catch (err) {
      console.error(`Failed to insert article: ${article.title}`, err);
    }
  }

  await client.end();
}

async function uploadArticleTags() {
  // article_id, tag_id
  await client.connect();

  // get all articles
  const articles = await client.query("SELECT id FROM articles");
  const articleIds = articles.rows.map((article) => article.id);

  // get all tags
  const tags = await client.query("SELECT id, name FROM tags");
  const tagIds = tags.rows.map((tag) => tag.id);

  // shuffle tags id and article id
  tagIds.sort(() => Math.random() - 0.5);
  articleIds.sort(() => Math.random() - 0.5);

  for (let i = 0; i < articleIds.length; i++) {
    const articleId = articleIds[i];
    const tagId = tagIds[i % tagIds.length];

    const query = `
      INSERT INTO article_tags (article_id, tag_id)
      VALUES ($1, $2)
    `;

    try {
      await client.query(query, [articleId, tagId]);
      console.log(`Inserted article_tag: ${articleId} - ${tagId}`);
    } catch (err) {
      console.error(
        `Failed to insert article_tag: ${articleId} - ${tagId}`,
        err
      );
    }
  }
}

async function uploadComments() {
  await client.connect();

  const data = JSON.parse(fs.readFileSync("./comments.json", "utf8"));

  await client.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1");
  // await client.query("TRUNCATE TABLE comments RESTART IDENTITY");

  // get all articles
  const articles = await client.query("SELECT id FROM articles");
  const articleIds = articles.rows.map((article) => article.id);

  // get all users
  const users = await client.query("SELECT id FROM users");
  const userIds = users.rows.map((user) => user.id);

  for (const comment of data) {
    const query = `
      INSERT INTO comments (
        content,
        article_id,
        user_id,
        created_at
      ) VALUES ($1, $2, $3, $4)
    `;

    comment.article_id =
      articleIds[Math.floor(Math.random() * articleIds.length)];
    comment.user_id = userIds[Math.floor(Math.random() * userIds.length)];
    comment.created_at = new Date();

    try {
      await client.query(query, [
        comment.content,
        comment.article_id,
        comment.user_id,
        comment.created_at,
      ]);
      console.log(`Inserted comment: ${comment.content}`);
    } catch (err) {
      console.error(`Failed to insert comment: ${comment.content}`, err);
    }
  }

  await client.end();
}

async function uploadEditorCategories() {
  await client.connect();

  // get all editors
  const editors = await client.query(
    "SELECT id FROM users WHERE role = 'editor'"
  );
  const editorIds = editors.rows.map((editor) => editor.id);

  // get all categories
  const categories = await client.query("SELECT id FROM categories");
  const categoryIds = categories.rows.map((category) => category.id);

  for (const editorId of editorIds) {
    const query = `
      INSERT INTO editor_categories (editor_id, category_id)
      VALUES ($1, $2)
    `;

    for (let i = 0; i < 3; i++) {
      const categoryId = categoryIds[Math.floor
        (Math.random() * categoryIds.length)];

      try {
        await client.query(query, [editorId, categoryId]);
        console.log(`Inserted editor_category: ${editorId} - ${categoryId}`);
      }
      catch (err) {
        console.error(`Failed to insert editor_category: ${editorId} - ${categoryId}`, err);
      }
    }
  }

  await client.end();
}

uploadEditorCategories();
