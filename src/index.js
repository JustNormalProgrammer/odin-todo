import './style.css';

class TodoItem {
    static id = 0;
    isComplete = false;
    constructor(title, desc,dueDate,priority,notes){
        this.id = TodoItem.id++;
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority; 
        this.notes = notes;
    }
    switchStatus(){
        this.isComplete = !this.isComplete;
    }
    edit(title, desc,dueDate,priority,notes){
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
    constructor(name){
        this.name = name;
        this.todoList = [];
        this.id = Project.id++;
    }
    addTodo(todoItem){
        if(!todoItem instanceof TodoItem){
            console.log('Unexpected item.');
            return -1;
        }
        this.todoList.push(todoItem);
        return 1;
    }
    removeTodo(todoItemIdx){
        this.todoList.splice(todoItemIdx, 1);
    }
    getStatus(){
        for(let todo of this.todoList){
            if(todo.isComplete !== true) {
                return false;
            }
        }
        return true;
    }
}
class ProjectList {
    constructor(){
        this.projectList = [new Project("Initial list")];
    }
    addProject(project){
        if(!project instanceof Project){
            console.log('Unexpected item.');
            return -1;
        }
        this.projectList.push(project);
        return 1;
    }
    remove(projectId){
        this.projectList.splice(projectId,1);
    }
}
const ScreenController = (function(){
    const projects = new ProjectList();

    const addBtn = document.querySelector('.add-btn');
    const dialog = document.querySelector('dialog');
    const form = document.querySelector('.add-form')
    addBtn.addEventListener('click', ()=>{
        dialog.showModal();
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const input = document.querySelector('#prj-name')
            let prjName = input.value;
            const project = new Project(prjName);
            dialog.close();
        })
    })


    
    function createProjectCard(project){
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.addEventListener('click', () => {
            console.log('test')
        });
        button.classList.add('list-btn');
        project.getStatus ? button.classList.add('list-btn-done') : button.classList.add('list-btn-todo')
        button.textContent = project.name;
        li.appendChild(button);
        return li;
    }
    function displayProjects(){
        const ul = document.querySelector('.project-list');
        for(let project of projects){
            const card = createProjectCard(project);
            ul.appendChild(card);
        }
    }
})();
