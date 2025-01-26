const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  key: {type: String, required: false},
  title: { type: String, required: false },
  desc: { type: String },
  dueDate: { type: Date, required: true },
  priority: { type: Number, required: true },
  isComplete: { type: Boolean, default: false },
});

module.exports = mongoose.model("Todo", TodoSchema);
