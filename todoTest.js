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
  let currentListIndex = 0;

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

const delListsBtn = document.querySelector(".del-lists");
delListsBtn.addEventListener("click", () => {
  todoLists.swap([]);
  addDataToLocalStorage([], 0);
  render();
  listsContainer.innerHTML = "";
});

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
    window.localStorage.setItem("lists", JSON.stringify(todoLists.lists));


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

function renderListContent(listObject, listObjectIndex) {
  const tasksContainer = document.createElement("ul");
  tasksContainer.classList.add("tasks-container");
  const header = document.createElement("div");
  header.classList.add("list-header");
  header.textContent = listObject.name;

  const addTaskBtn = document.createElement("button");
  addTaskBtn.textContent = "add task";
  addTaskBtn.classList.add("add-task-btn");
  const newTaskInput = document.createElement("input");
  newTaskInput.classList.add("new-task-input");
  renderTasks(listObjectIndex, tasksContainer);

  addTaskBtn.addEventListener("click", () => {
    const newTaskInput = document.querySelector(".new-task-input");
    if (newTaskInput.value != "") {
      const newTask = createTask(newTaskInput.value, "", "", "", "", 1);
     
      todoLists.lists[listObjectIndex].appendTask(newTask);
      window.localStorage.setItem("lists", JSON.stringify(todoLists.lists));
      
      /* const newTaskContainer = createTaskContainer(newTask);
      tasksContainer.appendChild(newTaskContainer); */
      renderTasks(listObjectIndex, tasksContainer);
    }
  });
  listContent.appendChild(header);
  listContent.appendChild(tasksContainer);
  listContent.appendChild(newTaskInput);
  listContent.appendChild(addTaskBtn);
}

function renderTasks(listObjectIndex, tasksContainer) {
  tasksContainer.innerHTML = "";
  todoLists.lists[listObjectIndex].tasks.forEach((task) => {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task-container");
    renderTask(task, taskContainer);
    tasksContainer.appendChild(taskContainer);
  });
}

const modal = document.querySelector(".modal");

function renderTask(task, taskContainer) {
  const taskTitle = document.createElement("div");
  taskTitle.classList.add("task-title");
  taskTitle.textContent = task.title;
  const taskDetails = document.createElement("button");
  taskDetails.classList.add("task-details");
  taskDetails.textContent = "Details";

  taskDetails.addEventListener("click", () => {
    modal.textContent = task.details;
    modal.show();
  });

  const taskDueDate = document.createElement("div");
  taskDueDate.classList.add("task-date");
  taskDueDate.textContent = task.dueDate;
  const deleteTaskBTn = document.createElement("div");
  deleteTaskBTn.classList.add("delete-task-btn");
  deleteTaskBTn.textContent = "DELETE TASK";
  const editTask = document.createElement("div");
  editTask.classList.add("edit-task");
  editTask.textContent = "EDIT TASK";
  const checkList = document.createElement("input");
  checkList.type = "checkbox";
  checkList.classList.add("checklist");
  task.checkList === 1
    ? (checkList.checked = true)
    : (checkList.checked = false);
  taskContainer.appendChild(taskTitle);
  taskContainer.appendChild(taskDetails);
  taskContainer.appendChild(taskDueDate);
  taskContainer.appendChild(deleteTaskBTn);
  taskContainer.appendChild(editTask);
}

function addDataToLocalStorage(lists, currentListIndex) {
  window.localStorage.setItem("lists", JSON.stringify(lists));
  window.localStorage.setItem(
    "currentListIndex",
    JSON.stringify(currentListIndex),
  );
  console.log(window.localStorage);
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

function setLocalStorageDataToArray(localStorageArray){
  localStorageArray.forEach((list) =>{
    const newList = todoLists.createList(list.name,list.id);
    list.tasks.forEach((task) =>{
      newList.appendTask(task);
    })
    todoLists.appendList(newList);
  })

}

initializeTodoLists();
