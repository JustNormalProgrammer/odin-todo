import './style.css';
import addBtnImg from './assets/add-ellipse-svgrepo-com.svg'

class TodoItem {
    static id = 0;
    isComplete = false;
    constructor(title, desc, dueDate, priority) {
        this.id = TodoItem.id++;
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
    }
    switchStatus() {
        this.isComplete = !this.isComplete;
    }
    edit(title, desc, dueDate, priority) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
    }

}
class Project {
    static id = 0;
    isDone = false;
    constructor(name) {
        this.name = name;
        this.todoList = [];
        this.id = Project.id++;
    }
    addTodo(todoItem) {
        if (!todoItem instanceof TodoItem) {
            console.log('Unexpected item.');
            return -1;
        }
        this.todoList.push(todoItem);
        return 1;
    }
    removeTodo(todoItemIdx) {
        this.todoList.splice(todoItemIdx, 1);
    }
    getStatus() {
        for (let todo of this.todoList) {
            if (todo.isComplete !== true) {
                return false;
            }
        }
        return true;
    }
}
class ProjectList {
    constructor() {
        this.projectList = [new Project("Initial list")];
    }
    addProject(project) {
        if (!project instanceof Project) {
            throw new Error('Unexpected item.');
        }
        this.projectList.push(project);
        return 1;
    }
    remove(projectId) {
        this.projectList.splice(projectId, 1);
    }
}
const projects = new ProjectList();
function seedHelper() {
    for (let i = 0; i < 5; i++) {
        let project = new Project(`Project ${i}`);
        for (let j = 0; j < 5; j++) {
            let todo = new TodoItem(`Title:${i}`, `Description:${i}`, Date.now(), i, "notes!");
            project.addTodo(todo);
        }
        projects.addProject(project);
    }
}
const todoController = (function () {
    function createTodoCard(todo) {
        const card = document.createElement('div');
        card.classList.add('todo-item');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "isDone";
        checkbox.id = "isDone";
        const divInfo = document.createElement('div');
        divInfo.classList.add('todo-info');
        const divHeader = document.createElement('div');
        divHeader.textContent = todo.title;
        divHeader.classList.add('todo-header')
        const divDesc = document.createElement('div');
        divDesc.textContent = todo.desc;
        divDesc.classList.add('todo-desc')
        divInfo.appendChild(divHeader);
        divInfo.appendChild(divDesc);
        const divDate = document.createElement('div');
        const divPriority = document.createElement('div');
        divDate.textContent = todo.dueDate;
        divPriority.textContent = todo.priority;
        divDate.classList.add('todo-info-last');
        divPriority.classList.add('todo-info-last');
        card.appendChild(checkbox);
        card.appendChild(divInfo);
        card.appendChild(divDate);
        card.appendChild(divPriority);
        return card;
    }
    function buttonHandler(project){
        const dialog = document.querySelector('#todo-dialog');
        dialog.showModal();
    }
    function createAddTodoButton(project){
        const button = document.createElement('button');
        button.classList.add('add-todo-btn');
        const img = document.createElement('img');
        img.src= addBtnImg;
        button.appendChild(img);
        button.addEventListener('click', ()=>{
            buttonHandler(project);
        })
        return button;
    }
    return { createTodoCard, createAddTodoButton};
})();
const projectDisplayController = (function () {
    const addBtn = document.querySelector('.add-btn');
    const dialog = document.querySelector('#project-dialog');
    const form = document.querySelector('.add-form')
    const ul = document.querySelector('.project-list');
    const projectHeader = document.querySelector('.project-header');
    const main = document.querySelector('main');

    addBtn.addEventListener('click', () => {
        dialog.showModal();
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('#prj-name')
        let prjName = input.value;
        const project = new Project(prjName);
        projects.addProject(project);
        ul.appendChild(createProjectCard(project));
        input.value = '';
        dialog.close();
    })
    function createProjectCard(project) {
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.addEventListener('click', () => {
            displayActiveProject(project);

        });
        button.classList.add('list-btn');
        project.getStatus ? button.classList.add('list-btn-done') : button.classList.add('list-btn-todo');
        button.textContent = project.name;
        li.appendChild(button);
        return li;
    }
    function displayActiveProject(project) {
        const todoDisplayed = document.querySelector('.todo-list');
        displayActiveProjectHeader(project);
        while (todoDisplayed.firstChild) {
            todoDisplayed.removeChild(todoDisplayed.firstChild);
        }
        for (let todo of project.todoList) {
            todoDisplayed.appendChild(todoController.createTodoCard(todo));
        }
        main.appendChild(todoController.createAddTodoButton(project));
    }
    
    function displayActiveProjectHeader(project) {
        projectHeader.textContent = project.name;
    }
    function displayProjects() {
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        if (projects.projectList[0]) {
            displayActiveProject(projects.projectList[2])
        }
        for (let project of projects.projectList) {
            const card = createProjectCard(project);
            ul.appendChild(card);
        }
    }
    return { displayProjects };
})();

const ScreenController = (function () {
    const projectDisplay = projectDisplayController;
    seedHelper();
    projectDisplay.displayProjects();
})();
