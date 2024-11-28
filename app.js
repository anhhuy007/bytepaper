import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js"; // Passport setup
import routes from "./routes/index.js"; // API routes
import errorHandler from "./middlewares/errorHandler.js"; // Custom error handler
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

import livereload from "livereload";
import connectLivereload from "connect-livereload";
import { newsData } from "./lib/dummy.js"; // Dummy news data for development

dotenv.config();

// Application Constants
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "dev";

// Initialize Express app
const app = express();

/* ---------- Middleware ---------- */

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Helmet for security (CSP disabled for development)
app.use(
    helmet({
        contentSecurityPolicy: isDev ? false : undefined, // Disable CSP in dev for convenience
    })
);

// Morgan for request logging
app.use(morgan(isDev ? "dev" : "combined"));

// Session setup (if needed for Passport or other strategies)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your_session_secret",
        resave: false,
        saveUninitialized: false,
    })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads")); // Uploaded files

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
    liveReloadServer.watch(path.join(__dirname, "views")); // Watch for changes in views

    app.use(connectLivereload()); // Inject livereload script into responses

    // Timeout to prevent premature reloads
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
}

/* ---------- Routes ---------- */

// Home Route - Render the list of news
app.get("/", (req, res) => {
    res.render("home", { news: newsData });
});

// News Detail Route
app.get("/news/:id", (req, res) => {
    const newsId = parseInt(req.params.id, 10); // Convert id to a number
    const newsItem = newsData.find((item) => item.id === newsId);

    console.log(newsItem);

    if (newsItem) {
        res.render("news-detail", { ...newsItem });
    } else {
        res.status(404).send("News not found");
    }
});

// Create Article Route
app.get("/create-article", (req, res) => {
    res.render("create-article");
});

// Edit Article Route
app.get("/edit-article/:id", (req, res) => {
    const newsId = parseInt(req.params.id, 10); // Convert id to a number
    const newsItem = newsData.find((item) => item.id === newsId);

    if (newsItem) {
        res.render("edit-article", { ...newsItem });
    } else {
        res.status(404).send("News not found");
    }
});

// API Routes
app.use("/api/v1", routes);

// Error Handler Middleware
app.use(errorHandler);

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
