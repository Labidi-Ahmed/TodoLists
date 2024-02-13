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
  let currentListIndex = 0;

  function swap(array) {
    lists.length = 0; // Clear the existing array without breaking references
    Array.prototype.push.apply(lists, array); // Copy elements from the new array to the existing one
  }
  

  function getList(index) {
    return lists[index];
  }

  function increment() {
    currentListIndex += 1;
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
  function getCurrentIndex() {
    return currentListIndex;
  }
  function checkExist(listName) {
    return lists.some((list) => {
      return list.name === listName;
    });
  }

  function changeCurrentListIndex(newIndex) {
    currentListIndex = newIndex;
  }

  return {
    increment,
    createList,
    appendList,
    getList,
    swap,
    lists,
    getCurrentIndex,
    currentListIndex,
    checkExist,
    changeCurrentListIndex,
  };
};

const todoLists = CreateTodoListsObject();
// rendering the lists 
function render() {
  listsContainer.innerHTML = "";
  todoLists.lists.forEach((list) => {
    const listContainer = document.createElement("li");
    listContainer.classList.add("list-container");
    listContainer.textContent = list.name;
    listContainer.id = list.id;
    listsContainer.appendChild(listContainer);
  });
}

// delete all existing lists 
const delListsBtn = document.querySelector(".del-lists");
delListsBtn.addEventListener("click", () => {
  todoLists.swap([]);
  addDataToLocalStorage([], 0);
  render();
  listsContainer.innerHTML = "";
});


function updateLocalStorageData() {
  window.localStorage.setItem("lists", JSON.stringify(todoLists.lists));
}



const listContent = document.querySelector(".list-content");
const addListBtn = document.querySelector(".add-list-btn");
const listsContainer = document.querySelector(".lists-container");
const listsForm = document.querySelector(".lists-form");

// apending the lists to the list container
listsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //getting the new list name
  const newListName = document.querySelector(".new-list-name").value;
  if (newListName != "" && todoLists.checkExist(newListName) === false) {
    // pushing the new list into our lists table
    const newList = todoLists.createList(
      newListName,
      todoLists.getCurrentIndex(),
    );
    todoLists.appendList(newList);
    updateLocalStorageData();

    //rendering the lists data from the lists array
    render();
    listsForm.reset();
    // incrementing the current available lists table index
    todoLists.increment();
    window.localStorage.setItem(
      "currentListIndex",
      JSON.stringify(todoLists.getCurrentIndex()),
    );
    listEventHandeler();

    //adding event listener on the appended lists
  }
});





function renderListContent(listObject, listObjectIndex) {
  const tasksContainer = document.createElement("ul");
  tasksContainer.classList.add("tasks-container");
  const listHeader = document.createElement("div");
  listHeader.classList.add("list-header");
  listHeader.textContent = listObject.name;

  const createTaskForm = document.createElement("form");
  createTaskForm.classList.add("create-task-form");
  createTaskForm.innerHTML = `
  <div>
            
        
                <div>
                    <textarea placeholder="Title: Pay bills" id="new-todo-title" name="new-todo" maxlength="40" required=""></textarea>
                    <textarea placeholder="Details: e.g internet, phone, rent." id="new-todo-details" name="new-todo" ></textarea>
                    <textarea placeholder="notes" id="new-todo-note" name="new-todo" ></textarea>
                    <div>
                        <div>Due Date:</div>
                        <input type="date" id="new-todo-date" name="new-todo" required="">
                    </div>
        
                    <div>
                        <div>Priority:</div>
                        <input type="radio" id="create-new-low" name="create-new-priority" value="low" required="">
                        <label for="create-new-low">Low</label>
        
                        <input type="radio" id="create-new-medium" name="create-new-priority" value="medium" required="">
                        <label for="create-new-medium">Medium</label>
        
                        <input type="radio" id="create-new-high" name="create-new-priority" value="high">
                        <label for="create-new-high">High</label>
                    </div>
        
                    <input type="submit" value="Add To Do">
                </div>
            </div>
  `;

  renderTasks(listObjectIndex, tasksContainer);
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
  listContent.appendChild(createTaskForm);
}




function listEventHandeler() {
  const lists = document.querySelectorAll(".list-container");
  lists.forEach((list) => {
    list.addEventListener("click", () => {
      listContent.innerHTML = "";
      const listObjectIndex = list.id;
      const listObject = todoLists.lists[listObjectIndex];
      renderListContent(listObject, listObjectIndex);
    });
  });
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


const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal-text");
const closeModalBTn = document.querySelector(".close-modal");

function taskContainerEventHandeler(
  task,
  taskContainer,
  listObjectIndex,
  tasksContainer,
) {
  taskContainer.addEventListener("click", (e) => {
    const taskContainerElement = e.target;

    if (taskContainerElement.classList.contains("task-details")) {
      modalText.textContent = task.description;

      modal.show();
    } else if (taskContainerElement.classList.contains("task-notes")) {
      if (task.notes === "") {
        modalText.textContent = "no notes here ";
      } else {
        modalText.textContent = task.notes;
      }

      modal.show();
    } else {
      if (taskContainerElement.classList.contains("delete-task-btn")) {
        console.log("work");
        removeObjectByTitle(todoLists.lists[listObjectIndex].tasks, task.title);
        console.log(todoLists.lists[listObjectIndex]);
        updateLocalStorageData();

        renderTasks(listObjectIndex, tasksContainer);
      } else {
        if (taskContainerElement.classList.contains("edit-task")) {
          modalText.innerHTML = `
          <h1> Edit ${task.title}</h1>
          <form id="edit-form">
                    <textarea placeholder="Title: Pay bills" id="edit-todo-title" name="edit-todo" maxlength="40" required=""></textarea>
                    <textarea placeholder="Details: e.g internet, phone, rent." id="edit-todo-details" name="edit-todo" ></textarea>
                    <textarea placeholder="notes" id="edit-todo-note" name="edit-todo" ></textarea>
                    <div>
                        <div>Due Date:</div>
                        <input type="date" id="edit-todo-date" name="edit-todo" required="">
                    </div>
        
                    <div>
                        <div>Priority:</div>
                        <input type="radio" id="edit-low" name="edit-priority" value="low" required="">
                        <label for="edit-low">Low</label>
        
                        <input type="radio" id="edit-medium" name="edit-priority" value="medium" required="">
                        <label for="edit-medium">Medium</label>
        
                        <input type="radio" id="edit-high" name="edit-priority" value="high">
                        <label for="edit-high">High</label>
                    </div>
        
                    <input type="submit" value="Edit To Do">
                </form>`
                
                modal.show();
                const editTaskForm = document.querySelector("#edit-form");
                editTaskForm.addEventListener("submit", (e) => {
                  e.preventDefault();
                  const taskTitle = document.querySelector("#edit-todo-title");
                  let isExist = false;
                  todoLists.lists[listObjectIndex].tasks.forEach((task) => {
                    if (task.title === taskTitle.value) {
                      isExist = true;
                    }
                  });
                  if (isExist) {
                    return false;
                  }
                  const taskDetails = document.querySelector("#edit-todo-details");
                  const dueDate = document.querySelector("#edit-todo-date");
                  const priorityBtns = document.getElementsByName("edit-priority");
                  let priorityBtn;
                  priorityBtns.forEach((btn) => {
                    if (btn.checked) {
                      priorityBtn = btn;
                    }
                  });
                
                  const notes = document.querySelector("#edit-todo-note");
                  console.log(taskTitle.value)
                  const editedTask = createTask(
                    taskTitle.value,
                    taskDetails.value,
                    dueDate.value,
                    priorityBtn.value,
                    notes.value,
                    0,
                  );
                  
                  let  taskIndex = getTaskIndex(listObjectIndex , task);
             
                  console.log(taskIndex)
                  console.log(editedTask)
                  todoLists.lists[listObjectIndex].tasks[taskIndex] = (editedTask);
                  updateLocalStorageData();
              
                  renderTasks(listObjectIndex, tasksContainer);
                });

        }
        else{
          if(taskContainerElement.id === 'is-done-btn'){
            let  taskIndex = getTaskIndex(listObjectIndex , task);
            console.log(taskIndex);
            if(taskContainerElement.checked === true){
              taskContainer.id="task-done";
              console.log(todoLists.lists[listObjectIndex].tasks[taskIndex].checkList);
              todoLists.lists[listObjectIndex].tasks[taskIndex].checkList = true;
              console.log(todoLists.lists[listObjectIndex].tasks[taskIndex].checkList);
              updateLocalStorageData();
            }
            else{
              console.log("le")
              console.log(taskContainerElement)
              taskContainer.id="task-not-done";
              todoLists.lists[listObjectIndex].tasks[taskIndex].checkList = false;
              updateLocalStorageData();
              
            }
       

          }
        }
      }
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


closeModalBTn.addEventListener("click", () => {
  modal.close();
});


function renderTask(task, taskContainer) {
  /*  taskDetails.addEventListener("click", () => {
    modal.textContent = task.details;
    modal.show();
  }); */
  taskContainer.id=("task-not-done");
  taskContainer.innerHTML = `

            <div class="task-title">${task.title}</div>
            <div class="task-date">${task.dueDate}</div>
            <button class="task-details">Details</button>
            <button class="task-notes">notes</button>
            <button class="delete-task-btn">DELETE TASK</button>
            <div id="priority">${task.priority} priority</div>
            <button class="edit-task">EDIT TASK</button>
            
          `;
          const isDoneBtn = document.createElement('input')
          isDoneBtn.type="checkbox";

           isDoneBtn.id=("is-done-btn");
          if(task.checkList === true){
          isDoneBtn.checked = true;
          taskContainer.id="task-done";
        }
        taskContainer.appendChild(isDoneBtn);
        console.log(isDoneBtn)
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




function getCurrentIndexFromLocalStorage() {
  let currentListIndexData = window.localStorage.getItem("currentListIndex");
  if (currentListIndexData) {
    let currentListIndex = JSON.parse(currentListIndexData);
    return currentListIndex;
  } else {
    return 0;
  }
}



// not used in this APP 
function addDataToLocalStorage(lists, currentListIndex) {
  window.localStorage.setItem("lists", JSON.stringify(lists));
  window.localStorage.setItem(
    "currentListIndex",
    JSON.stringify(currentListIndex),
  );
  console.log(window.localStorage);
}




// ...

async function initializeTodoLists() {
  const listsData = await getDataFromLocalStorage();

  const currentListIndex = await getCurrentIndexFromLocalStorage();

  setLocalStorageDataToArray(listsData);

  todoLists.changeCurrentListIndex(currentListIndex);

  render();
  listEventHandeler();
}

// Call initializeTodoLists function

function setLocalStorageDataToArray(localStorageArray) {
  localStorageArray.forEach((list) => {
    const newList = todoLists.createList(list.name, list.id);
    list.tasks.forEach((task) => {
      newList.appendTask(task);
    });
    todoLists.appendList(newList);
  });
}

initializeTodoLists();
