// app.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import passport from "./config/passport.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import redisClient from "./utils/redisClient.js";
import { RedisStore } from "connect-redis";
import { newsData } from "./lib/dummy.js";

dotenv.config();

// Application Constants
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "dev";

// Initialize Express app
const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
    helmet({
        contentSecurityPolicy: isDev ? false : undefined,
    })
);
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || "your_session_secret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === "production" },
    })
);
app.use(morgan(isDev ? "dev" : "combined"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

/* ---------- Handlebars Setup ---------- */
app.engine(
    "hbs",
    engine({
        extname: "hbs",
        partialsDir: path.join(__dirname, "views", "partials"),
        helpers: {
            eq: (a, b) => a === b,
        },
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

/* ---------- Live Reload for Development ---------- */
if (isDev) {
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, "views"));
    app.use(connectLivereload());
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
}

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
    res.render("home", { news: newsData });
});

app.get("/news/:id", (req, res) => {
    const newsId = parseInt(req.params.id, 10);
    const newsItem = newsData.find((item) => item.id === newsId);

    if (newsItem) {
        res.render("news-detail", { ...newsItem });
    } else {
        res.status(404).send("News not found");
    }
});

app.get("/create-article", (req, res) => {
    res.render("create-article");
});

app.get("/edit-article/:id", (req, res) => {
    const newsId = parseInt(req.params.id, 10);
    const newsItem = newsData.find((item) => item.id === newsId);

    if (newsItem) {
        res.render("edit-article", { ...newsItem });
    } else {
        res.status(404).send("News not found");
    }
});

app.use("/api/v1", routes);
app.use(errorHandler);

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
