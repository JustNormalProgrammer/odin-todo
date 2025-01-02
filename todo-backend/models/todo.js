const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  key: {type: String, required: true},
  title: { type: String, required: true },
  desc: { type: String },
  dueDate: { type: Date, required: true },
  priority: { type: Number, required: true },
  isComplete: { type: Boolean, default: false },
});

module.exports = mongoose.model("Todo", TodoSchema);
