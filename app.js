//requiring dependecies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

mongoose.connect("mongodb://localhost/toDoApp");
const task = require("./models/toDoApp.js");

//setting up template engine
app.set("view engine", "ejs");
app.set("views", "public");

app.use(express.json()); //for parsing json data
app.use(bodyParser.text({ type: "text/plain" })); // Parse incoming plain text data
app.use(express.static("public"));

app.listen(3000);

app.get("/", (req, res) => {
  readTask().then((tasks) => {
    res.render("index", { tasks });
  });
});

//delete endpoint
app.get("/deleteTasks", (req, res) => {
  task
    .deleteMany({ taskName: { $exists: true } })
    .then(() => res.send({ status: "OK" }));
});

//Home endpoint for receiving sumbitted tasks
app.post("/", (req, res) => {
  sendTask(req.body);
  res.send({ status: "OK" });
});

//task check endpoint
app.post("/taskCheck", (req, res) => {
  taskCheck(req.body).then(res.send({ status: "OK" }));
});

//submitting tasks into database
async function sendTask(req) {
  await task.create({ taskName: req.taskName, isComplete: req.isComplete });
}

//checking/unchecking tasks from database
async function taskCheck(req) {
  const taskItem = await task.findOne({ taskName: req });
  const complete = taskItem.isComplete;
  if (complete) taskItem.isComplete = false;
  else taskItem.isComplete = true;

  await taskItem.save();
}

//reading tasks from database
async function readTask() {
  const tasks = await task.find();
  if (tasks.length > 0) {
    return tasks;
  }
  return false;
}
