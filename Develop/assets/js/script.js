// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; //added || [] to ensure code works when no tasks have been submitted
let nextId = JSON.parse(localStorage.getItem("nextId"));
const id = generateTaskId();

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let currentId = parseInt(localStorage.getItem('nextId')) || 1;
    currentId++

    if (currentId > 100) {
        currentId = 1;
    }

    localStorage.setItem('nextId', currentId);
    console.log(currentId);

    return currentId;
}

//create a task card from the modal
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'card task-card mb-2';
    card.id = 'task-' + task.id;
    card.innerHTML = `
        <div class ="card-body">
            <h5 class="card-body">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small class="text-muted">Due: ${task.date}</small></p>
            <button class="btn btn-danger" onclick="handleDeleteTask(${task.id})">Delete</button>
        </div>
        `;
        
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoCards = document.getElementById('todo-cards');
    todoCards.innerHTML = ''

    taskList.forEach(task => {
        const card = createTaskCard(task)
        todoCards.appendChild(card);
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); //preventing the form from submitting normally and resetting page

    const title = document.getElementById('task-name').value;
    const description = document.getElementById('description-text').value;
    const date = document.getElementById('date-picker').value;

    const id = generateTaskId(); //generating a unique ID for the added task

    const task = {id, title, description, date}; //task object

    //add to local storage
    taskList = taskList || [];
    taskList.push(task);
    localStorage.getItem('tasks', JSON.stringify(taskList));

    //Add the new task card to the kanban
    const card = createTaskCard(task);
    document.getElementById('todo-cards').appendChild(card);

    //clearing modal input fields after submission
    document.getElementById('task-name').value = '';
    document.getElementById('description-text').value = '';
    document.getElementById('date-picker').value = '';

    //closes modal
    $('#formModal').modal('hide');

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(id) {  //needed to change parameter from event to id to define the element
    taskList = taskList.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    document.getElementById('task-' + id).remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    $(".card").droppable({
        drop: handleDrop
    });

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () { 
    renderTaskList(); //render all task cards at start

    //make the lanes droppable
    $(".lane").droppable({
        drop: handleDrop
    });

    //activates the add task button
    document.getElementById('add-task-button').addEventListener('click', handleAddTask);
});

//event listener for the day picker
document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#date-picker", {
      enableTime: true, // Enable time selection
      dateFormat: "Y-m-d H:i", // Set the desired date format
      onChange: function(selectedDates, dateStr, instance) {
        // Example: use Day.js to format the selected date
        console.log(dayjs(dateStr).format("YYYY-MM-DD HH:mm"));
      }
    });
  });


  ////delete card from window
  //const card = document.getElementById('' + nextId);
  //card.parentElement.removeChild(card);

  //remove deleted task from local storage
  //taskList = taskList.filter(task => task.id !==id);
  //localStorage.setItem('tasks', JSON.stringify(taskList));