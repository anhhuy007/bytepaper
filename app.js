import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import categories from "./data/categories.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join("views"));

app.use(express.static("public"));
app.use(express.static("views/partials"));

app.get("/", (req, res) => {
  res.render("home", { categories });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
