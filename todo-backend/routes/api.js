const express = require("express");
const Project = require("../models/project");
const Todo = require("../models/todo");


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
    console.log("body:", JSON.stringify(projectList, null, 2));
    
    // Clear existing data (optional)
    await Project.deleteMany({});
    await Todo.deleteMany({});
    
    // Save new data
    for (let projectData of projectList) {
      const todoList = [];
      for (let todoData of projectData.todoList) { // Poprawka: użycie projectData.todoList
        const todo = new Todo({
          key: todoData.key,
          title: todoData.title,
          desc: todoData.desc,
          dueDate: todoData.dueDate,
          priority: todoData.priority,
          isComplete: todoData.isComplete,
        });
        await todo.save(); // Zapisanie każdego zadania
        todoList.push(todo); // Dodanie do listy
      }

      const project = new Project({
        key: projectData.key,
        name: projectData.name,
        isDone: projectData.isDone,
        todoList: todoList, // Dodanie zadań do projektu
      });

      await project.save(); // Zapisanie projektu
    }

    res.status(200).json({ message: "Projects saved successfully" });
  } catch (error) {
    console.error("Error saving projects:", error);
    res.status(500).json({ error: "Error saving projects" });
  }
});

module.exports = router;