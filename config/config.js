import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
    database: process.env.DB_NAME || "paperly_dev",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
    database: process.env.DB_TEST_NAME || "paperly_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
    database: process.env.DB_PROD_NAME || "paperly_prod",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
};
