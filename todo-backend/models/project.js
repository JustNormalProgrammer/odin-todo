const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  key: {type: String, required: true},
  name: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  todoList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

module.exports = mongoose.model("Project", ProjectSchema);