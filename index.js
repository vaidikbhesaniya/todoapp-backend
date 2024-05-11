import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { todoRouter, userRouter } from "./router/router.js";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);
app.get("/health", (req, res) =>
    res.json({ message: "Server is up and running" })
);

// Server
const PORT = Number(process.env.PORT || 8080);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Database connection error:", error);
        process.exit(1);
    });
