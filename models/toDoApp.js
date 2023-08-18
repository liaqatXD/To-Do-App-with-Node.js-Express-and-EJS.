const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  taskName: String,
  isComplete: Boolean,
});

module.exports = mongoose.model("tasks", taskSchema);
