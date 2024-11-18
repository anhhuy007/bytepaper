// models/index.js

"use strict";

/**
 * This module sets up the Sequelize connection and loads all models.
 * It exports an object containing the Sequelize instance and all loaded models.
 */

import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import process from "process";
import { fileURLToPath, pathToFileURL } from "url";

// Get __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
import config from "../config/config.js";
const db = {};

let sequelize;
if (config[env].use_env_variable) {
  sequelize = new Sequelize(
    process.env[config[env].use_env_variable],
    config[env]
  );
} else {
  sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    config[env]
  );
}

/**
 * Loads all models from the current directory and their subdirectories.
 * @returns {Promise<void>}
 */
const loadModels = async () => {
  try {
    // Get all files in the current directory and its subdirectories
    const files = fs.readdirSync(__dirname).filter((file) => {
      return (
        // Ignore hidden files and directories
        file.indexOf(".") !== 0 &&
        // Ignore the current file
        file !== basename &&
        // Ignore non-JS files
        file.slice(-3) === ".js" &&
        // Ignore test files
        file.indexOf(".test.js") === -1
      );
    });

    // Load all models
    for (const file of files) {
      const modulePath = pathToFileURL(path.join(__dirname, file)).href;
      const modelModule = await import(modulePath);
      const model = modelModule.default(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
    // Associate models with each other
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (error) {
    console.error("Error loading models:", error);
  }
};

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
