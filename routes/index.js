// routes/index.js

import express from "express";
import authRoutes from "./authRoutes.js";
import articleRoutes from "./articleRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import tagRoutes from "./tagRoutes.js";
import commentRoutes from "./commentRoutes.js";
import userRoutes from "./userRoutes.js";
import writerRoutes from "./writerRoutes.js";
import editorRoutes from "./editorRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

// Public Routes
router.use("/auth", authRoutes);
router.use("/articles", articleRoutes);
router.use("/categories", categoryRoutes);
router.use("/tags", tagRoutes);
router.use("/comments", commentRoutes);

// Protected Routes
router.use("/user", userRoutes);
router.use("/writer", writerRoutes);
router.use("/editor", editorRoutes);
router.use("/admin", adminRoutes);

export default router;
