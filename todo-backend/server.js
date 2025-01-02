const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Project = require("./models/project");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());

async function initializeDatabase() {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("Dodawanie initial project do bazy danych...");
      const initialProject = new Project({
        name: "Initial Project",
      });
      await initialProject.save();
      console.log("Initial project dodany!");
    } else {
      console.log("Projekty już istnieją w bazie danych.");
    }
  }

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    initializeDatabase();
    })
  .catch((err) => console.error("MongoDB connection error:", err));

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});