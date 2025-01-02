const express = require("express");
const Project = require("../models/project");
const Todo = require("../models/todo");
const todo = require("../models/todo");

const router = express.Router();

// Get all projects
router.get("/todos", async (req, res) => {
  try {
    const projects = await Project.find().populate("todoList");
    console.log(projects)
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// Create or update projects
router.post("/todos", async (req, res) => {
  try {
    const projectList = req.body;
    console.log(projectList)
    // Clear existing data (optional)
    await Project.deleteMany({});
    await Todo.deleteMany({});
    // Save new data
    for (let projectData of projectList) {
      const todoList = [];
      for(let todoData of projectList.list){
        const todo  = new Todo({
          title: todoData.title,
          desc: todoData.desc,
          dueDate: todoData.dueDate,
          priority: todoData.priority,
          isComplete: todoData.isComplete
        });
      }
      await todo.save();
      todoList.push(todo);

      const project = new Project({
        name: projectData.name,
        isDone: projectData.isDone,
        todoList: todoList,
      });

      await project.save();
      todoList=[];
    }
    
    res.status(200).json({ message: "Projects saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving projects" });
  }
});

module.exports = router;