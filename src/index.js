import './style.css';
import {format} from 'date-fns';
import addBtnImg from './assets/add-ellipse-svgrepo-com.svg'
import greenCircle from './assets/priority/green-circle-svgrepo-com.svg'
import yellowCircle from './assets/priority/yellow-circle-svgrepo-com.svg'
import redCircle from './assets/priority/red-circle-svgrepo-com.svg'
import deleteBtnImg from './assets/delete-3-svgrepo-com.svg'
import editBtnImg from './assets/edit-svgrepo-com.svg'
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
    removeTodo(todoItem) {
        console.log(this.todoList);
        this.todoList.splice(this.todoList.indexOf(todoItem), 1);
        console.log(this.todoList);
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

function seedHelper(projects) {
    for (let i = 0; i < 5; i++) {
        let project = new Project(`Project ${i}`);
        for (let j = 0; j < 5; j++) {
            let todo = new TodoItem(`Title:${i}`, `Description:${i}`, Date.now(), Math.floor(Math.random()*3+1));
            project.addTodo(todo);
        }
        projects.addProject(project);
    }
}


const ScreenController = (function () {
    const formTodo = document.querySelector('#todo-form');
    const dialogTodo = document.querySelector('#todo-dialog');
    const main = document.querySelector('main');
    const addBtn = document.querySelector('.add-btn');
    const dialog = document.querySelector('#project-dialog');
    const formProject = document.querySelector('#project-form');
    const ul = document.querySelector('.project-list');
    const projectHeader = document.querySelector('.project-header');

    
    
    let activeProject = null;
    const projects = new ProjectList();

    seedHelper(projects);
    displayProjects();
    
    formTodo.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.querySelector('#todo-title').value;
        const desc = document.querySelector('#todo-desc').value;
        const date = document.querySelector('#todo-dueDate').valueAsDate;
        const priority = document.querySelector('input[name="todo-priority"]:checked').value;
        const todo = new TodoItem(title,desc,date,priority);
        formTodo.reset();
        activeProject.addTodo(todo);
        displayActiveProject();
        dialogTodo.close();
    })

    function createTodoCard(todo) {
        const card = document.createElement('div');
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');
        card.classList.add('todo-item');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "isDone";
        checkbox.id = "isDone";
        checkbox.addEventListener('click', () => {
            todo.switchStatus();
        })
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
        const priority = document.createElement('img');
        divDate.textContent = `Due date: ${format(todo.dueDate, 'MM/dd/yyyy')}`;
        divDate.classList.add('todo-info-last');
        let priorityImgArr = [greenCircle, yellowCircle, redCircle];
        priority.src = priorityImgArr[todo.priority-1];
        priority.classList.add('todo-priority');
        card.appendChild(checkbox);
        card.appendChild(divInfo);
        card.appendChild(divDate);
        card.appendChild(priority);
        const btnGroup = document.createElement('div');
        const delBtn = document.createElement('button');
        const editBtn = document.createElement('button');
        delBtn.addEventListener('click', ()=> {
            activeProject.removeTodo(todo);
            displayActiveProject();
        })
        const delBtnInner = document.createElement('img');
        const editBtnInner = document.createElement('img');
        delBtnInner.src = deleteBtnImg;
        editBtnInner.src = editBtnImg;
        delBtn.appendChild(delBtnInner);
        editBtn.appendChild(editBtnInner);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(delBtn);
        btnGroup.classList.add('card-btn-group')        
        cardWrapper.appendChild(card);
        cardWrapper.appendChild(btnGroup);
        return cardWrapper;
    }
    
    function createAddTodoButton(){
        if(document.querySelector('.add-todo-btn')) return;
        const button = document.createElement('button');
        button.classList.add('add-todo-btn');
        const img = document.createElement('img');
        img.src= addBtnImg;
        button.appendChild(img);
        button.addEventListener('click', ()=>{
            dialogTodo.showModal();
        })
        main.appendChild(button);
    }
    
    addBtn.addEventListener('click', () => {
        dialog.showModal();
    })
    formProject.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('#prj-name')
        let prjName = input.value;
        const project = new Project(prjName);
        projects.addProject(project);
        ul.appendChild(createProjectCard(project));
        formProject.reset();    
        dialog.close();
    })
    
    function createProjectCard(project) {
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.addEventListener('click', () => {
            activeProject = project;
            displayActiveProject();
        });
        button.classList.add('list-btn');
        project.getStatus ? button.classList.add('list-btn-done') : button.classList.add('list-btn-todo');
        button.textContent = project.name;
        li.appendChild(button);
        return li;
    }
    function displayActiveProject() {
        const todoDisplayed = document.querySelector('.todo-list');
        displayActiveProjectHeader();
        while (todoDisplayed.firstChild) {
            todoDisplayed.removeChild(todoDisplayed.firstChild);
        }
        for (let todo of activeProject.todoList) {
            todoDisplayed.appendChild(createTodoCard(todo));
        }
        createAddTodoButton();
    }
    
    function displayActiveProjectHeader() {
        projectHeader.textContent = activeProject.name;
    }
    function displayProjects() {
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        if (projects.projectList[1]) {
            activeProject = projects.projectList[1];
            displayActiveProject()
        }
        for (let project of projects.projectList) {
            const card = createProjectCard(project);
            ul.appendChild(card);
        }
    }
})();
