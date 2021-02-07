/** @type {HTMLDivElement} */

//lists
let unfinishedChores = [];
let finishedChores = [];

//Html Elements
let newChoreInput = document.querySelector(".list__container__newNote");
let checkAllChores = document.querySelector(".list__container__checkNotes");

let chorePrefab = document.querySelector(".prefab");
let choreContainer = document.querySelector(".list__container>main");

//footer filters and notifications
let remainingDisplay = document.querySelector(".remainingChores");
let clearFinished = document.querySelector(".clearCompleated");

let allFilter = document.querySelector(".filters__all");
let activeFilter = document.querySelector(".filters__active");
let completedFilter = document.querySelector(".filters__compleated");

let selectedFilter = allFilter;

//checks or unchecks all chores
checkAllChores.addEventListener("change", function () {
  if (this.checked) {
    CheckAllChores();
  } else {
    UnCheckAllChores();
  }
});

//detect if a new chore is submitted
newChoreInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    let value = newChoreInput.value;
    if (value.length > 0) NewChore(value);
    newChoreInput.value = "";
  }
});

//clears all the finished chores
clearFinished.addEventListener("click", function () {
  ClearCompleatedChanges();
});

//filters that decides which chores are gonna ba rendered
allFilter.addEventListener("click", function () {
  RenderAllChores();

  allFilter.classList.add("selected");
  activeFilter.classList.remove("selected");
  completedFilter.classList.remove("selected");
});

activeFilter.addEventListener("click", function () {
  RenderActiveChores();

  allFilter.classList.remove("selected");
  activeFilter.classList.add("selected");
  completedFilter.classList.remove("selected");
});

completedFilter.addEventListener("click", function () {
  RenderFinishedChores();

  allFilter.classList.remove("selected");
  activeFilter.classList.remove("selected");
  completedFilter.classList.add("selected");
});

function NewChore(choreName) {
  let newChore = chorePrefab.cloneNode(true);
  newChore.classList.remove("invisible");
  newChore.classList.remove("prefab");
  newChore.children[1].textContent = choreName;
  choreContainer.appendChild(newChore);
  unfinishedChores.push(newChore);

  NotifyChoreChanges();

  //chore listeners
  let checkBox = newChore.children[0];
  checkBox.addEventListener("change", function () {
    if (this.checked) {
      CheckChore(newChore);
    } else {
      UnCheckChore(newChore);
    }
  });

  let deleteBtn = newChore.children[2];
  deleteBtn.addEventListener("click", function () {
    DeleteChore(newChore);
  });
} //closes NewChore method

function CheckChore(chore) {
  let checkBox = chore.children[0];
  checkBox.checked = true;

  chore.classList.add("checked");

  let index = unfinishedChores.indexOf(chore);
  unfinishedChores.splice(index, 1);
  finishedChores.push(chore);

  NotifyChoreChanges();
} //closes CheckChore method

function UnCheckChore(chore) {
  let checkBox = chore.children[0];
  checkBox.checked = false;
  chore.classList.remove("checked");

  let index = finishedChores.indexOf(chore);
  finishedChores.splice(index, 1);
  unfinishedChores.push(chore);

  NotifyChoreChanges();
} //closes UnCheckChore method

function CheckAllChores() {
  let arrayCopy = unfinishedChores.slice();
  arrayCopy.forEach((chore) => {
    CheckChore(chore);
  });
} //closes CheckAllChores method

function UnCheckAllChores() {
  let arrayCopy = finishedChores.slice();
  arrayCopy.forEach((chore) => {
    UnCheckChore(chore);
  });
} //closes UnCheckAllChores method

function DeleteChore(chore) {
  let index = finishedChores.indexOf(chore);
  if (index > -1) finishedChores.splice(index, 1);

  index = unfinishedChores.indexOf(chore);
  if (index > -1) unfinishedChores.splice(index, 1);

  chore.remove();

  NotifyChoreChanges();
} //closes DeleteChore method

function NotifyChoreChanges() {
  //evaluates the CheckAllChores input state
  if (finishedChores.length == 0 && unfinishedChores.length == 0) {
    checkAllChores.checked = false;
  } else if (finishedChores.length > 0 && unfinishedChores.length == 0) {
    checkAllChores.checked = true;
  } else if (unfinishedChores.length > 0) {
    checkAllChores.checked = false;
  }

  //updates the remaining chores amount
  remainingDisplay.textContent = unfinishedChores.length + " items left";

  //shows or hides the clear finished chores if the case aplies
  if (finishedChores.length > 0) clearFinished.classList.remove("invisible");
  else clearFinished.classList.add("invisible");

  //updates the list rendered by the filters
  switch (selectedFilter) {
    case allFilter:
      RenderAllChores();
      break;

    case completedFilter:
      RenderFinishedChores();
      break;

    case activeFilter:
      RenderActiveChores();
      break;
  }
} //closes UpdateCheckAllChoresInput method

function ClearCompleatedChanges() {
  let arrayCopy = finishedChores.slice();
  arrayCopy.forEach((chore) => {
    DeleteChore(chore);
  });
} //closes ClearCompleatedChanges method

function RenderAllChores() {
  unfinishedChores.forEach((chore) => {
    chore.classList.remove("invisible");
  });

  finishedChores.forEach((chore) => {
    chore.classList.remove("invisible");
  });
  selectedFilter = allFilter;
} //closes RenderAllChores method

function RenderFinishedChores() {
  unfinishedChores.forEach((chore) => {
    chore.classList.add("invisible");
  });

  finishedChores.forEach((chore) => {
    chore.classList.remove("invisible");
  });

  selectedFilter = completedFilter;
} //closes RenderFinishedChores method

function RenderActiveChores() {
  unfinishedChores.forEach((chore) => {
    chore.classList.remove("invisible");
  });

  finishedChores.forEach((chore) => {
    chore.classList.add("invisible");
  });

  selectedFilter = activeFilter;
} //closes RenderActiveChores method
