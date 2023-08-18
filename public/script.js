document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.querySelector("input");
  const emptyTask = document.querySelector(".empty-task");
  const list = document.querySelector("#list");
  const moon = document.querySelector("#moon");
  const coffee = document.querySelector("#coffee");

  moon.addEventListener("click", () => {
    const body = document.body;
    body.classList.toggle("dark");
    taskInput.classList.toggle("light");
    taskInput.classList.toggle("dark");
    emptyTask.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      moon.src = "images/moon-white.svg";
      coffee.src = "images/coffe-white.svg";
    } else {
      moon.src = "images/moon-black.svg";
      coffee.src = "images/coffe-black.svg";
    }
  });

  coffee.addEventListener("click", () => {
    deleteTask();
  });

  //listening for enter key in input
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const task = taskInput.value;
      if (task === "") emptyTask.classList.remove("empty-task");
      else {
        emptyTask.classList.add("empty-task");
        addTask(task);
        taskInput.value = "";
        sendTask(task);
      }
    }
  });

  //adding tasks in list in browser
  const addTask = (task) => {
    const listElement = document.createElement("li");
    listElement.innerText = task;
    list.appendChild(listElement);
  };
  //To cehck/uncheck tasks in browser
  list.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const task = e.target;
      task.classList.toggle("complete");
      taskCheck(task.innerText);
    }
  });

  //sending tasks as json to server
  async function sendTask(task) {
    await fetch("http://localhost:3000", {
      method: "post",
      body: JSON.stringify({ taskName: task, isComplete: false }),
      headers: { "Content-Type": "application/json" },
    });
  }

  //sending request to check/unccheck tasks
  async function taskCheck(task) {
    await fetch("http://localhost:3000/taskCheck", {
      method: "post",
      body: task,
      headers: { "Content-Type": "text/plain" },
    });
  }

  //sending request to delete tasks
  async function deleteTask() {
    coffee.classList.add("animate");

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    await fetch("http://localhost:3000/deleteTasks");
    setTimeout(() => {
      coffee.classList.remove("animate");
    }, 300);
  }
});
