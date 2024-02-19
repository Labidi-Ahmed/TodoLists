function createTask(title, description, dueDate, priority, notes, checkList) {
  return {
    title,
    description,
    dueDate,
    priority,
    notes,
    checkList,
  };
}

const CreateTodoListsObject = () => {
  let lists = [];
 

  function swap(array) {
    lists.length = 0; // Clear the existing array without breaking references
    Array.prototype.push.apply(lists, array); // Copy elements from the new array to the existing one
  }
  



 
  function createList(name, id) {
    let tasks = [];
    const appendTask = (task) => {
      tasks.push(task);
    };

    function deleteTask(task) {
      tasks = tasks.filter((element) => {
        return task.name !== element.name;
      });
    }

    return { name, id, appendTask, tasks, deleteTask };
  }

  function appendList(newList) {
    lists.push(newList);
  }
 
  function checkExist(listName) {
    return lists.some((list) => {
      return list.name === listName;
    });
  }

  

  return {
    createList,
    appendList,
    
    swap,
    lists,
    checkExist,
  };
};

const todoLists = CreateTodoListsObject();

// looping through the todoLists array and displaying each list to the Dom;
function render() {
  listsContainer.innerHTML = "";
  todoLists.lists.forEach((list) => {
    const listContainer = document.createElement("li");
    listContainer.classList.add("list-container");
    const listName=document.createElement('div');
    listName.id="list-name"
    listName.textContent=list.name;
    listContainer.id = list.name;
    const delListBtn = document.createElement('div');
    delListBtn.textContent="x";
    delListBtn.id="delete-list";

    listContainer.appendChild(listName);
    listContainer.appendChild(delListBtn);
    
    listContainer.addEventListener('mouseover',()=>{
      delListBtn.style.display='inline';
    })
    listContainer.addEventListener('mouseleave',()=>{
      delListBtn.style.display='none';
    })

    
    listsContainer.appendChild(listContainer);
    selectedListStyle();
    listEventHandeler();
    deleteListEventHAndeler();
  });

  
}
// changing the list background and padding when clicked  
function selectedListStyle(){
  const lists=document.querySelectorAll('.list-container');
  lists.forEach((list)=>{
    list.addEventListener('click',()=>{
      const allLists = document.querySelectorAll('.active-list');
      allLists.forEach(item => {
        item.classList.remove('active-list');
      });
      list.classList.add('active-list');
    })
  })
  

  
}


function deleteListEventHAndeler(){
  const lists=document.querySelectorAll('.list-container');
  lists.forEach((list)=>{
    list.addEventListener('click',(e) =>{
      if(e.target.id==="delete-list"){
        console.log(e.target)
        console.log('yes');
        const newLists=deleteList(todoLists.lists,list.id);
        console.log(list.id);
        console.log(newLists);
        todoLists.swap(newLists);
        updateLocalStorageData();
        render();
      }
    })

  })
}


function deleteList(array, listname) {
  // Use the filter method to create a new array excluding the object with the specified title
  const newArray = array.filter((obj) => obj.name !== listname);
  return newArray
}





// delete all existing lists from
// the table of lists inside the todoLists object 
//and from the lists container in the DOM
const delListsBtn = document.querySelector(".del-lists");
delListsBtn.addEventListener("click", () => {
  todoLists.swap([]);
  updateLocalStorageData();
  render();
  listContent.innerHTML="no current tasks";
  listsContainer.innerHTML = "";
});

/**
 * Updates the local storage with the current state of the todoLists lists array.
 * This function serializes the todoLists.lists array into JSON format and
 * stores it in the browser's local storage under the key "lists".
 * This allows the todo lists data to persist even after the page is refreshed or closed.
 */
function updateLocalStorageData() {
  window.localStorage.setItem("lists", JSON.stringify(todoLists.lists));
}







function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("lists");
  if (data) {
    let lists = JSON.parse(data);

    return lists;
  } else {
    return [];
  }
}







const listContent = document.querySelector(".list-content");
const addListBtn = document.querySelector(".add-list-btn");
const listsContainer = document.querySelector(".lists-container");
const listsForm = document.querySelector(".lists-form");
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal-text");







function handleListsFormSubmit(event) {
  event.preventDefault();

  // Get the new list name and error message element
  const newListName = document.querySelector(".new-list-name");
  const listNameErrorMsg = document.querySelector(".listname-error");

  // Check if the new list name is not empty and does not already exist
  if (newListName.value !== "" && !todoLists.checkExist(newListName.value)) {
    newListName.classList.remove("invalid-input");
    listNameErrorMsg.textContent = "";

    // Create a new list and append it to the todo lists container
    const newList = todoLists.createList(
      newListName.value,
    );
    todoLists.appendList(newList);
    updateLocalStorageData();

    // Render the updated lists data
    render();
    listsForm.reset();

    // Increment the current available lists table index
/*     todoLists.increment();
 */   /*  updateLocalStorageCurrentIndex();
 */
    // Add event listener for the newly appended lists
  } else {
    // Display error message if the list name is empty or already exists
    listNameErrorMsg.textContent = "List already exists!";
    newListName.classList.add("invalid-input");
  }
}

// Event listener for the submission of the lists form
listsForm.addEventListener("submit", handleListsFormSubmit);




// adding click event listener for each list to display her content  
function listEventHandeler() {
  const lists = document.querySelectorAll(".list-container");
  lists.forEach((list) => {
    list.addEventListener("click", () => {
      listContent.innerHTML = "";
      const listObjectName = list.id;
      let listObject;
      let listObjectIndex;
      for (i=0;i<todoLists.lists.length;i++){
        if(todoLists.lists[i].name === listObjectName){
          listObject = todoLists.lists[i];
          listObjectIndex = i;
        }
      }
      renderListContent(listObject, listObjectIndex);
    });
  });
}





function renderListContent(listObject, listObjectIndex) {
  if(listObject){
    
  
  const tasksContainer = document.createElement("ul");
  tasksContainer.classList.add("tasks-container");
  const listHeader = document.createElement("div");
  listHeader.classList.add("list-header");
  listHeader.textContent = listObject.name;

  const createTaskForm = document.createElement("form");
  createTaskForm.classList.add("create-task-form");
  createTaskForm.appendChild ( tasksFormCreator("") );

  renderTasks(listObjectIndex, tasksContainer);
  // adding task when sumbitting the form 
  createTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskTitle = document.querySelector("#new-todo-title");
    let isExist = false;
    todoLists.lists[listObjectIndex].tasks.forEach((task) => {
      if (task.title === taskTitle.value) {
        isExist = true;
      }
    });
    if (isExist) {
      return false;
    }
    const taskDetails = document.querySelector("#new-todo-details");
    const dueDate = document.querySelector("#new-todo-date");
    const priorityBtns = document.getElementsByName("create-new-priority");
    let priorityBtn;
    priorityBtns.forEach((btn) => {
      if (btn.checked) {
        priorityBtn = btn;
      }
    });
  
    const notes = document.querySelector("#new-todo-note");
    const newTask = createTask(
      taskTitle.value,
      taskDetails.value,
      dueDate.value,
      priorityBtn.value,
      notes.textContent,
      0,
    );

    todoLists.lists[listObjectIndex].appendTask(newTask);
    updateLocalStorageData();

    renderTasks(listObjectIndex, tasksContainer);
  });
  listContent.appendChild(listHeader);
  listContent.appendChild(tasksContainer);
  
  
  const newTaskFormBtn = document.createElement('button');
  newTaskFormBtn.id="new-task-form";
  newTaskFormBtn.textContent="Add Task"
  newTaskFormBtn.addEventListener('click',() =>{
    modalText.innerHTML="";
    modalText.appendChild(createTaskForm);
    modal.show();
  })
  listContent.appendChild(newTaskFormBtn);
}
}



/**
 * Creates and returns a form for creating or editing a task.
 * If a task title is provided, the form is configured for editing mode,
 * displaying the title and changing the submit button text to "Edit Task".
 * Otherwise, it is configured for creating mode with a blank title
 * and the submit button text set to "Add Task".
 * The form includes input fields for the task title, description, notes, due date,
 * and priority level, along with radio buttons for selecting priority.
 * @param {string} taskTitle - The title of the task (if in edit mode).
 * @returns {HTMLDivElement} - The HTML div element containing the task form.
 */
function tasksFormCreator(taskTitle) {
  const div = document.createElement('div');
  let buttonKeyword = "Add";
  const formContent = document.createElement('div');
  if (taskTitle != ""){
    buttonKeyword = "Edit";
    const header = document.createElement('h1');
    header.id = "edit-task";
    header.textContent = ` Edit ${taskTitle}`
    div.appendChild(header)
    
  }
 
  formContent.innerHTML = `

      <div>
          <input type="text" placeholder="Title of the task" id="new-todo-title" name="new-todo" maxlength="20" required="">
          <input type="text" placeholder="Description" id="new-todo-details" name="new-todo">
          <input type="text" placeholder="Notes" id="new-todo-note" name="new-todo">
      </div>
      <div>
          <div class="taskform-label">Due Date</div>
          <input type="date" id="new-todo-date" name="new-todo" required="">
      </div>
      <div>
          <div class="taskform-label">Priority</div>
          <input type="radio" id="create-new-low" name="create-new-priority" value="low" required="">
          <label for="create-new-low">Low</label>

          <input type="radio" id="create-new-medium" name="create-new-priority" value="medium" required="">
          <label for="create-new-medium">Medium</label>

          <input type="radio" id="create-new-high" name="create-new-priority" value="high">
          <label for="create-new-high">High</label>
      </div>
      <input type="submit" value="${buttonKeyword} Task" class="taskform-btn">
  `;

  div.appendChild(formContent);
  return div ;
}




function renderTasks(listObjectIndex, tasksContainer) {
  tasksContainer.innerHTML = "";
  todoLists.lists[listObjectIndex].tasks.forEach((task) => {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task-container");
    renderTask(task, taskContainer);
    taskContainerEventHandeler(
      task,
      taskContainer,
      listObjectIndex,
      tasksContainer,
    );
    tasksContainer.appendChild(taskContainer);
  });
}



function removeObjectByTitle(array, titleToRemove) {
  // Use the filter method to create a new array excluding the object with the specified title
  const newArray = array.filter((obj) => obj.title !== titleToRemove);
  array.length = 0;
  Array.prototype.push.apply(array, newArray);
}





/**
 * Handles click events on buttons within a task container.
 * Displays task details or notes in a modal when clicked.
 * Allows deletion of tasks, editing of task details, and updating task completion status.
 * @param {object} task - The task object associated with the task container.
 * @param {HTMLElement} taskContainer - The HTML element representing the task container.
 * @param {number} listObjectIndex - The index of the task list in the todoLists array.
 * @param {HTMLElement} tasksContainer - The HTML element containing all task containers.
 */

function taskContainerEventHandeler(
  task,
  taskContainer,
  listObjectIndex,
  tasksContainer,
) {
  taskContainer.addEventListener("click", (e) => {
    const taskContainerElement = e.target;
// Show task description in modal when task details are clicked
    if (taskContainerElement.classList.contains("task-details")) {
      modalText.textContent = task.description === "" ? "no description here" : task.description;
      modal.show();
      return;
    }
    // Show task notes in modal when task notes are clicked
    if (taskContainerElement.classList.contains("task-notes")) {
      modalText.textContent = task.notes === "" ? "no notes here" : task.notes;
      modal.show();
      return;
    }
    // Delete task when delete button is clicked
    if (taskContainerElement.classList.contains("delete-task-btn")) {
      console.log("work");
      removeObjectByTitle(todoLists.lists[listObjectIndex].tasks, task.title);
      console.log(todoLists.lists[listObjectIndex]);
      updateLocalStorageData();
      renderTasks(listObjectIndex, tasksContainer);
      return;
    }
    // Show the form for editing the task when edit button clicked  
    if (taskContainerElement.classList.contains("edit-task")) {
      modalText.innerHTML = "";
      const createTaskForm = document.createElement("form");
      createTaskForm.classList.add("create-task-form");
      createTaskForm.appendChild(tasksFormCreator(task.title));
      modalText.appendChild(createTaskForm);
      modal.show();
      // Editing the task when the form submit 
      createTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskTitle = document.querySelector("#new-todo-title");
        let isExist = todoLists.lists[listObjectIndex].tasks.some(
          (task) => task.title === taskTitle.value
        );
        if (isExist) return;

        const taskDetails = document.querySelector("#new-todo-details");
        const dueDate = document.querySelector("#new-todo-date");
        const priorityBtns = document.getElementsByName("create-new-priority");
        let priorityBtn;
        priorityBtns.forEach((btn) => {
          if (btn.checked) priorityBtn = btn;
        });

        const notes = document.querySelector("#new-todo-note");
        const editedTask = createTask(
          taskTitle.value,
          taskDetails.value,
          dueDate.value,
          priorityBtn.value,
          notes.value,
          0,
        );
        
        let taskIndex = getTaskIndex(listObjectIndex, task);
        todoLists.lists[listObjectIndex].tasks[taskIndex] = editedTask;
        updateLocalStorageData();
        renderTasks(listObjectIndex, tasksContainer);
        modal.close();
      });
      return;
    }
  // Update task completion status when the checkbox is clicked
    if (taskContainerElement.id === 'is-done-btn') {
      let taskIndex = getTaskIndex(listObjectIndex, task);
      if (taskContainerElement.checked) {
        taskContainer.id = "task-done";
      } else {
        taskContainer.id = "task-not-done";
      }
      todoLists.lists[listObjectIndex].tasks[taskIndex].checkList = taskContainerElement.checked;
      updateLocalStorageData();
    }
  });
}





function getTaskIndex(listObjectIndex, task) {
  let i = 0;
  let taskIndex = -1; 
  while (i < todoLists.lists[listObjectIndex].tasks.length && taskIndex === -1) {
    if (todoLists.lists[listObjectIndex].tasks[i].title === task.title) {
      taskIndex = i;
    } else {
      i += 1;
    }
  }
  return taskIndex;
}




/**
 * Renders the content of a task within the provided task container.
 * Displays the task title, due date, priority level, and buttons for managing the task.
 * Allows users to view task content and notes, delete the task, or edit the task.
 * Also includes a checkbox for marking the task as done or not done.
 * @param {object} task - The task object containing details to be rendered.
 * @param {HTMLElement} taskContainer - The HTML element representing the container for displaying the task content.
 */
function renderTask(task, taskContainer) {

  taskContainer.id=("task-not-done");
  taskContainer.innerHTML = `
  <div class="task-wrapper">
      <div class="task-info">
          <div class="task-title"><div>${task.title}</div></div>
          <div class="task-date">${task.dueDate}</div>
          <button class="task-details">Details</button>
          <button class="task-notes">Notes</button>
          <div id="priority">${task.priority} priority</div>
      </div>
      <div class="task-actions">
          <button class="delete-task-btn">Delete</button>
          <button class="edit-task">Edit</button>
      </div>
  </div>
`;

// Create and prepend the isDoneBtn checkbox
const isDoneBtn = document.createElement('input');
isDoneBtn.type = "checkbox";
isDoneBtn.id = "is-done-btn";
if (task.checkList === true) {
  isDoneBtn.checked = true;
  taskContainer.id = "task-done";
}

const taskWrapper = taskContainer.querySelector('.task-wrapper');
const taskInfo=taskWrapper.querySelector('.task-info');
const taskTitle = taskInfo.querySelector('.task-title');

if (taskWrapper) {
  taskTitle.insertBefore(isDoneBtn, taskTitle.firstChild);
}
}








async function initializeTodoLists() {
  const listsData = await getDataFromLocalStorage();
  loadListsDataFromLocalStorage(listsData);

  render();
  listEventHandeler();
}



function loadListsDataFromLocalStorage(localStorageArray) {
  localStorageArray.forEach((list) => {
    const newList = todoLists.createList(list.name, list.id);
    list.tasks.forEach((task) => {
      newList.appendTask(task);
    });
    todoLists.appendList(newList);
  });
}

initializeTodoLists();























var dialog = document.querySelector('dialog');

document.querySelector('.close-modal').onclick = function() {
    dialog.classList.add('hide');
    dialog.addEventListener('webkitAnimationEnd', function(){
        dialog.classList.remove('hide');
        dialog.close();
        dialog.removeEventListener('webkitAnimationEnd',  arguments.callee, false);
    }, false);
};


































