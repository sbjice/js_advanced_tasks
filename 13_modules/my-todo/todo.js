import { createStorageManager, configTasksStorage} from "./storage.js";

const createAppHeader = headerText => {
  const headerElement = document.createElement('h2');
  headerElement.textContent = headerText;
  return headerElement;
};

const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add('container');
  return container;
};

const createInputGroup = () => {
  const inputDiv = document.createElement('div');
  inputDiv.classList.add('input-group', 'mb-3');
  const input = document.createElement('input');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';

  inputDiv.append(input, button);
  return {
    inputDiv,
    input,
    button
  }
}

const configTaskInput = (taskInput, taskAddButton) => {
  taskAddButton.disabled = (taskInput.value === '');
  taskInput.addEventListener(
    'input',
    event => {
      taskAddButton.disabled = (event.target.value === '');
    }
  )
}

const createTODOElement = (todoItem, tasksStorage) => {
  const itemLi = document.createElement('li');
  itemLi.classList.add('d-flex', 'p-4', 'flex-row', 'rounded');
  itemLi.classList.toggle('bg-success', todoItem.done);

  const itemInput = document.createElement('input');
  itemInput.classList.add('form-control', 'w-50');
  itemInput.value = todoItem.task;
  itemInput.addEventListener(
    'input',
    () => {
      todoItem.task = itemInput.value;
    }
  );

  const itemDone = document.createElement('button');
  itemDone.textContent = 'Готово';
  itemDone.classList.add('btn', 'btn-success', 'border');
  itemDone.addEventListener(
    'click',
    () => {
      todoItem.done = !todoItem.done;
      tasksStorage.updateTask(todoItem);
      let index = tasksStorage.getIndexOfTask(todoItem);
      if (index > -1) tasksStorage.itemList.children[index].classList.toggle('bg-success', todoItem.done);
    }
  );

  const itemSave = document.createElement('button');
  itemSave.textContent = 'Сохранить';
  itemSave.classList.add('btn', 'btn-primary', 'border');
  itemSave.addEventListener(
    'click',
    () => {
      tasksStorage.updateTask(todoItem);
    }
  );

  const itemDelete = document.createElement('button');
  itemDelete.textContent = 'Удалить';
  itemDelete.classList.add('btn', 'btn-danger', 'border');
  itemDelete.addEventListener(
    'click',
    () => {
      tasksStorage.deleteTask(todoItem);
      itemLi.remove();
    }
  )

  const btnGroup = document.createElement('div');
  btnGroup.classList.add('btn-group', 'w-50');

  btnGroup.append(itemDone, itemSave, itemDelete)
  itemLi.append(itemInput, btnGroup);
  return {
    itemLi,
    itemInput,
    itemDone,
    itemSave,
    itemDelete
  }
}

const createTaskListComponent = (pageTitle, storageManager) => {
  const itemList = document.createElement('ul');
  itemList.style.listStyleType = 'none';
  itemList.classList.add('d-flex', 'flex-column', 'p-0');

  return {
    storage: [],
    itemList: itemList,
    addNewTask(task) {
      storageManager.addData(pageTitle, this.storage, task);
      this.getDataFromStorage();
      this.clearItemList();
      this.fillItemList();
    },
    deleteTask(task) {
      storageManager.deleteData(pageTitle, this.storage, task);
      this.getDataFromStorage();
      this.clearItemList();
      this.fillItemList();
    },
    updateTask(task) {
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].id === task.id) this.storage[i] = JSON.parse(JSON.stringify(task));
      }
      this.clearItemList();
      this.fillItemList();
      this.saveDataToStorage();
    },
    clearItemList() {
      this.itemList.innerHTML = '';
    },
    fillItemList() {
      for (let item of this.storage) {
        const listItem = createTODOElement(item, this);
        this.itemList.append(listItem.itemLi);
      }
    },
    getIndexOfTask(task) {
      for (let i = 0; i < this.storage.length; i++) {
        if (task.id === this.storage[i].id) return i;
      }
      return -1;
    },
    saveDataToStorage() {
      storageManager.saveData(pageTitle, this.storage);
    },
    getDataFromStorage() {
      if (window.localStorage.getItem(pageTitle)) {
        this.storage = storageManager.getData(pageTitle);
        this.clearItemList();
        this.fillItemList();
      }
    }
  }
}


const createApp = (container = document.querySelector('.app'), headerText = 'Мои дела') => {
  const appContainer = createContainer();
  const appHeader = createAppHeader(headerText);
  const storageManager = createStorageManager();
  const taskListComponent = createTaskListComponent(headerText, storageManager);
  taskListComponent.getDataFromStorage();
  storageManager.switchingButton.addEventListener(
    'click',
    () => {
      taskListComponent.getDataFromStorage();
    }
  )


  const inputGroup = createInputGroup();
  configTaskInput(inputGroup.input, inputGroup.button);
  configTasksStorage(inputGroup.button, inputGroup.input, taskListComponent);

  appContainer.append(appHeader, inputGroup.inputDiv, storageManager.content, taskListComponent.itemList);
  container.classList.add('my-5');
  container.append(appContainer);
};

export {
  createApp
};
