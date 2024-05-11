import TodoSchema from "../model/Todo.js";

export const getTodos = async (req, res) => {
    const todos = await TodoSchema.find({ user: req.user._id });
};
