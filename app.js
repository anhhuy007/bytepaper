import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import passport from "./config/passport.js";
import session from "express-session";

import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import livereload from "livereload";
import connectLivereload from "connect-livereload";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Session setup (if needed for strategies like OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Static files (if needed)
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Use routes
app.use("/api/v1", routes);

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(process.env.NODE_ENV);

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

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
