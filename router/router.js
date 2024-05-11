import express from "express";
import * as todoController from "../controller/Todo.js";
import * as userController from "../controller/User.js";
import allowAuthenticated from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

export const todoRouter = express.Router();
todoRouter.get("/", allowAuthenticated, todoController.getTodos);
//   .post("/create", allowAuthenticated, todoController.createTodo)
//   .put("/update", allowAuthenticated, todoController.updateTodo)
//   .delete("/delete", allowAuthenticated, todoController.deleteTodo);

export const userRouter = express.Router();
userRouter
    .get("/", allowAuthenticated, userController.getUser)
    .post("/login", userController.loginUser)
    .post(
        "/register",

        userController.registerUser
    );
// .post("/logout", userController.logoutUser)
// .put("/update", allowAuthenticated, userController.updateUser)
// .delete("/delete", allowAuthenticated, userController.deleteUser);
