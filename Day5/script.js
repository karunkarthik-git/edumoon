let tasks = [];

const LOCAL_STORAGE_KEY = 'taskList';

// Dom selectors
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('tasksList');
const filterTasksElement = document.getElementById('filterTasks');
const searchTask = document.getElementById('searchTask');
const taskCount = document.getElementById('taskCount');
const clearCompletedButton = document.getElementById('clear-completed');
const taskTemplate = document.getElementById('taskTemplate');

const Task = {
    create: function(text) {
        return {
            id: Date.now(), // number unique
            text: text, // string
            completed: false, // boolean
            createdAt: new Date() // date object
        }
    }
}


function addTask(text) {
    if (text.trim() === '') return;
    // create a new task
    const newTask = Task.create(text);
    tasks.push(newTask);
    saveTasks(); // save to local storage
    renderTasks(); // render the tasks
    taskInput.value = '';
}

function saveTasks() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY); // stringified json
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function filterTasks() {
    const filter = filterTasksElement.value;
    const searchText = searchTask.value.toLowerCase();

    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (searchText) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.text.toLowerCase().includes(searchText);
        })
    }


    return filteredTasks;
}

function updateTaskCount() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function renderTasks() {
    // filter tasks based on search and filter criteria
    const tasksToRender = filterTasks();
    taskList.innerHTML = '';

    tasksToRender.forEach(i => {
        const taskElement = taskTemplate.content.cloneNode(true);
        const taskItem = taskElement.querySelector('.task-item');
        const taskCheckbox = taskElement.querySelector('.task-checkbox');
        const taskText = taskElement.querySelector('.task-text');
        const taskDeleteButton = taskElement.querySelector('.delete-task');

        taskCheckbox.checked = i.completed;
        taskText.textContent = i.text;

        if (i.completed) {
            taskItem.classList.add('completed');
        }

        taskCheckbox.addEventListener('change', () => toggleTask(i.id));
        taskDeleteButton.addEventListener('click', () => deleteTask(i.id));

        taskList.appendChild(taskElement);
    });

    updateTaskCount();
}


addTaskButton.addEventListener('click', function() {
    addTask(taskInput.value);
});

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask(taskInput.value);
    }
});

filterTasksElement.addEventListener('change', function() {
    renderTasks();
});

searchTask.addEventListener('input', function() {
    renderTasks();
});

clearCompletedButton.addEventListener('click', function() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// Load tasks from local storage on page load
loadTasks();
// Initial render of tasks
renderTasks();