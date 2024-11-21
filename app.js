import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

import livereload from "livereload";
import connectLivereload from "connect-livereload";
import { newsData } from "./lib/dummy.js";

// Temporary data, remove later

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// By default hot reload for views isn't supported, so using this instead
if (process.env.NODE_ENV === "dev") {
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, "views"));

    app.use(connectLivereload());

    // Timeout to prevent premature reloads
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
}

app.engine(
    "hbs",
    engine({
        extname: "hbs",
        partialsDir: path.join(__dirname, "views", "partials"),
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home", { news: newsData });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/news/:id", (req, res) => {
    const newsId = parseInt(req.params.id, 10); // Convert id to a number
    const newsItem = newsData.find((item) => item.id === newsId);

    if (newsItem) {
        res.render("news-detail", { news: newsItem });
    } else {
        res.status(404).send("News not found");
    }
});
