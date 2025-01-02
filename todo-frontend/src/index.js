import "./style.css";
import { format } from "date-fns";
import addBtnImg from "./assets/add-ellipse-svgrepo-com.svg";
import greenCircle from "./assets/priority/green-circle-svgrepo-com.svg";
import yellowCircle from "./assets/priority/yellow-circle-svgrepo-com.svg";
import redCircle from "./assets/priority/red-circle-svgrepo-com.svg";
import deleteBtnImg from "./assets/delete-3-svgrepo-com.svg";
import editBtnImg from "./assets/edit-svgrepo-com.svg";

class TodoItem {
  static id = 0;
  isComplete = false;
  constructor(title, desc, dueDate, priority, id, isComplete) {
    this.id = TodoItem.id++;
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    if (id !== undefined) {
      this.id = id;
      this.isComplete = isComplete;
    }
  }
  switchStatus() {
    this.isComplete = !this.isComplete;
  }
  edit(title, desc, dueDate, priority) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}
class Project {
  static id = 0;
  isDone = false;
  constructor(name, id, isDone, list) {
    this.name = name;
    this.todoList = [];
    this.id = Project.id++;
    if (id !== undefined) {
      this.todoList = list;
      this.id = id;
      this.isDone = isDone;
    }
  }
  addTodo(todoItem) {
    if ((!todoItem) instanceof TodoItem) {
      console.log("Unexpected item.");
      return -1;
    }
    this.todoList.push(todoItem);
    return 1;
  }
  removeTodo(todoItem) {
    this.todoList.splice(this.todoList.indexOf(todoItem), 1);
  }
  getStatus() {
    for (let todo of this.todoList) {
      if (todo.isComplete !== true) {
        return false;
      }
    }
    this.isDone = true;
    return true;
  }
}
class ProjectList {
  constructor() {
    this.projectList = [];
  }
  addProject(project) {
    if ((!project) instanceof Project) {
      throw new Error("Unexpected item.");
    }
    this.projectList.push(project);
  }
  remove(project) {
    this.projectList.splice(this.projectList.indexOf(project), 1);
  }
  async fetchFromBackend() {
    try {
      const response = await fetch("http://localhost:3000/api/todos");
      const projectArr = await response.json();

      for (let projectFromBackend of projectArr) {
        let project = new Project(
          projectFromBackend.name,
          projectFromBackend.id,
          projectFromBackend.isDone,
          projectFromBackend.list?.map(
            (todo) =>
              new TodoItem(
                todo.title,
                todo.desc,
                todo.dueDate,
                todo.priority,
                todo.id,
                todo.isComplete
              )
          )
        );
        this.projectList.push(project);
      }
    } catch (error) {
      console.error("Error fetching projects from backend:", error);
    }
  }

  async saveToBackend() {
    try {
      const content = JSON.stringify(
        this.projectList.map((project) => ({
          key: project.id,
          name: project.name,
          isDone: project.isDone,
          list: project.todoList.map((todo) => ({
            key: todo.id,
            isComplete: todo.isComplete,
            title: todo.title,
            desc: todo.desc,
            dueDate: todo.dueDate,
            priority: todo.priority,
          })),
        }))
      )
      await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: content,
      });
      console.log(content);
    } catch (error) {
      console.error("Error saving projects to backend:", error);
    }
  }
}

function seedHelper(projects) {
  for (let i = 0; i < 5; i++) {
    let project = new Project(`Project ${i}`);
    for (let j = 0; j < 5; j++) {
      let todo = new TodoItem(
        `Title:${i}`,
        `Description:${i}`,
        Date.now(),
        Math.floor(Math.random() * 3 + 1),
      );
      project.addTodo(todo);
    }
    projects.addProject(project);
  }
}

const ScreenController = (function () {
  const formTodo = document.querySelector("#todo-form");
  const dialogTodo = document.querySelector("#todo-dialog");
  const main = document.querySelector("main");
  const addBtn = document.querySelector("#add-btn");
  const dialog = document.querySelector("#project-dialog");
  const formProject = document.querySelector("#project-form");
  const dialogEdit = document.querySelector("#edit-dialog");
  const formEdit = document.querySelector("#edit-form");
  const ul = document.querySelector(".project-list");
  const projectHeader = document.querySelector(".project-header");
  const todoDisplayed = document.querySelector(".todo-list");

  let activeProject = null;
  let activeTodo = null;
  const projects = new ProjectList();

  window.addEventListener("beforeunload", () => {
    projects.saveToBackend();
  });
  window.addEventListener("DOMContentLoaded", async () => {
    await projects.fetchFromBackend();
    displayProjects();
  });
  addBtn.addEventListener("click", () => {
    dialog.showModal();
  });
  formProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.querySelector("#prj-name");
    let prjName = input.value;
    const project = new Project(prjName);
    projects.addProject(project);
    createProjectCard(project);
    formProject.reset();
    dialog.close();
  });;

  formTodo.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#todo-title").value;
    const desc = document.querySelector("#todo-desc").value;
    const date = document.querySelector("#todo-dueDate").valueAsDate;
    const priority = document.querySelector(
      'input[name="todo-priority"]:checked',
    ).value;
    const todo = new TodoItem(title, desc, date, priority);
    formTodo.reset();
    activeProject.addTodo(todo);
    displayActiveProject();
    displayProjectStatus(activeProject);
    dialogTodo.close();
  });
  formEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#edit-title").value;
    const desc = document.querySelector("#edit-desc").value;
    const date = document.querySelector("#edit-dueDate").valueAsDate;
    const priority = document.querySelector(
      'input[name="edit-priority"]:checked',
    ).value;
    activeTodo.edit(title, desc, date, priority);
    formEdit.reset();
    displayActiveProject();
    dialogEdit.close();
  });

  function createTodoCard(todo) {
    const card = document.createElement("div");
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card-wrapper");
    card.classList.add("todo-item");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "isDone";
    checkbox.id = "isDone";
    if (todo.isComplete) {
      card.classList.toggle("todo-item-darken");
      checkbox.checked = true;
    }
    checkbox.addEventListener("click", () => {
      todo.switchStatus();
      card.classList.toggle("todo-item-darken");
      displayProjectStatus(activeProject);
    });
    const divInfo = document.createElement("div");
    divInfo.classList.add("todo-info");
    const divHeader = document.createElement("div");
    divHeader.textContent = todo.title;
    divHeader.classList.add("todo-header");
    const divDesc = document.createElement("div");
    divDesc.textContent = todo.desc;
    divDesc.classList.add("todo-desc");
    divInfo.appendChild(divHeader);
    divInfo.appendChild(divDesc);
    const divDate = document.createElement("div");
    const priority = document.createElement("img");
    divDate.textContent = `Due date: ${format(todo.dueDate, "MM/dd/yyyy")}`;
    divDate.classList.add("todo-info-last");
    let priorityImgArr = [greenCircle, yellowCircle, redCircle];
    priority.src = priorityImgArr[todo.priority - 1];
    priority.classList.add("todo-priority");
    card.appendChild(checkbox);
    card.appendChild(divInfo);
    card.appendChild(divDate);
    card.appendChild(priority);
    const btnGroup = document.createElement("div");
    const delBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    delBtn.addEventListener("click", () => {
      activeProject.removeTodo(todo);
      displayActiveProject();
    });
    editBtn.addEventListener("click", () => {
      activeTodo = todo;
      dialogEdit.showModal();
    });
    const delBtnInner = document.createElement("img");
    const editBtnInner = document.createElement("img");
    delBtnInner.src = deleteBtnImg;
    editBtnInner.src = editBtnImg;
    delBtn.appendChild(delBtnInner);
    editBtn.appendChild(editBtnInner);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);
    btnGroup.classList.add("card-btn-group");
    cardWrapper.appendChild(card);
    cardWrapper.appendChild(btnGroup);
    return cardWrapper;
  }

  function createAddTodoAndDeleteProjectButton() {
    if (document.querySelector(".add-todo-btn")) return;
    const addButton = document.createElement("button");
    const delButton = document.createElement("button");
    addButton.classList.add("add-todo-btn");
    delButton.classList.add("del-btn");
    const imgDel = document.createElement("img");
    const imgAdd = document.createElement("img");
    imgDel.src = deleteBtnImg;
    imgAdd.src = addBtnImg;
    addButton.appendChild(imgAdd);
    delButton.appendChild(imgDel);
    addButton.addEventListener("click", () => {
      dialogTodo.showModal();
    });
    delButton.addEventListener("click", () => {
      projects.remove(activeProject);
      displayProjects();
    });
    main.appendChild(addButton);
    main.appendChild(delButton);
  }
  function displayProjectStatus(project) {
    const projectButton = document.querySelector(`[data-id = "${project.key}"]`);
    let isDone = project.getStatus();
    projectButton.classList.remove("list-btn-done", "list-btn-todo");
    isDone
      ? projectButton.classList.add("list-btn-done")
      : projectButton.classList.add("list-btn-todo");
  }
  function createProjectCard(project) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.dataset.id = project.key;

    button.addEventListener("click", () => {
      let activeProjectNode = document.querySelector(`[data-id = "${activeProject.key}"]`);
      if(activeProjectNode){
        activeProjectNode.classList.remove("active-project");
      }
      activeProject = project;
      displayActiveProject();
      button.classList.add("active-project");
    });
    button.classList.add("list-btn");
    button.textContent = project.name;
    li.appendChild(button);
    ul.appendChild(li);
    displayProjectStatus(project);
  }
  function displayActiveProject() {
    resetTodo();
    projectHeader.textContent = activeProject.name;
    for (let todo of activeProject.todoList) {
      todoDisplayed.appendChild(createTodoCard(todo));
    }
    createAddTodoAndDeleteProjectButton();
  }
  function resetTodo() {
    while (todoDisplayed.firstChild) {
      todoDisplayed.removeChild(todoDisplayed.firstChild);
    }
    projectHeader.textContent = "";
  }
  function hideButtons() {
    const delBtn = document.querySelector(".del-btn");
    const addButton = document.querySelector(".add-todo-btn");
    addButton ? main.removeChild(addButton) : null;
    delBtn ? main.removeChild(delBtn) : null;
  }

  function displayProjects() {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    if (projects.projectList[0]) {
      activeProject = projects.projectList[0];
      displayActiveProject();
    }
    if (projects.projectList.length === 0) {
      hideButtons();
      resetTodo();
      return;
    }
    for (let project of projects.projectList) {
      createProjectCard(project);
    }
    document
      .querySelector(`[data-id = "${activeProject.key}"]`)
      .classList.add("active-project");
  }
})();
