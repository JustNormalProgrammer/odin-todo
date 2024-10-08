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
}
class ProjectList {
    constructor(){
        this.projectList = [];
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