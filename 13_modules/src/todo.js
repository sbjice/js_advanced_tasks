import {
  createStorageManager
} from './storage.js';

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

const createNav = (navItems = [{
    href: 'index.html',
    text: 'Я',
  },
  {
    href: 'mom.html',
    text: 'Мама',
  },
  {
    href: 'dad.html',
    text: 'Папа',
  }
]) => {
  if (navItems !== undefined) {
    const nav = document.createElement('nav');
    nav.classList.add('d-flex', 'flex-row');
    for (let item of navItems) {
      const navItem = document.createElement('a');
      navItem.href = item.href;
      navItem.textContent = item.text;
      navItem.classList.add('nav-link');
      nav.append(navItem);
    }
    return nav;
  } else return undefined;
}

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

const createTODOElement = (parent, todoItem, tasksStorage) => {
  const itemLi = document.createElement('li');
  itemLi.classList.add('d-flex', 'p-4', 'flex-row', 'rounded', 'border');
  itemLi.classList.toggle('bg-success', todoItem.done);

  const itemInput = document.createElement('div');
  itemInput.classList.add('w-50', 'p-1');
  itemInput.textContent = todoItem.name;
  itemInput.addEventListener(
    'input',
    () => {
      todoItem.task = itemInput.value;
    }
  );

  const itemDone = document.createElement('button');
  itemDone.textContent = 'Готово';
  itemDone.classList.add('btn', 'btn-success', 'border', 'rounded');
  itemDone.addEventListener(
    'click',
    () => {
      todoItem.done = !todoItem.done;
      tasksStorage.updateData(todoItem);
      let index = tasksStorage.getIndexOfData(todoItem);
      if (index > -1) parent.itemList.children[index].classList.toggle('bg-success', todoItem.done);
    }
  );


  const itemDelete = document.createElement('button');
  itemDelete.textContent = 'Удалить';
  itemDelete.classList.add('btn', 'btn-danger', 'border', 'rounded');
  itemDelete.addEventListener(
    'click',
    () => {
      tasksStorage.deleteData(todoItem);
      itemLi.remove();
    }
  )

  const btnGroup = document.createElement('div');
  btnGroup.classList.add('btn-group', 'w-50');

  btnGroup.append(itemDone, itemDelete)
  itemLi.append(itemInput, btnGroup);
  return {
    itemLi,
    itemInput,
    itemDone,
    itemDelete
  }
}

const createTaskListComponent = (pageTitle, storageManager) => {
  const itemList = document.createElement('ul');
  itemList.style.listStyleType = 'none';
  itemList.classList.add('d-flex', 'flex-column', 'p-0');

  return {
    itemList: itemList,
    storageManager: storageManager,
    async addNewTask(task) {
      await this.storageManager.addData(task);
      this.getDataFromStorage();
    },
    async deleteTask(task) {
      await this.storageManager.deleteData(pageTitle, task);
      this.getDataFromStorage();
    },
    async updateTask(task) {
      await this.storageManager.updateData(pageTitle, task);
      this.clearItemList();
      this.fillItemList();
    },
    clearItemList() {
      this.itemList.innerHTML = '';
    },
    fillItemList() {
      for (let item of this.storageManager.storage) {
        const listItem = createTODOElement(this, item, this.storageManager);
        this.itemList.append(listItem.itemLi);
      }
    },
    getIndexOfTask(task) {
      for (let i = 0; i < this.storageManager.storage.length; i++) {
        if (task.id === this.storageManager.storage[i].id) return i;
      }
      return -1;
    },
    async saveDataToStorage() {
      await this.storageManager.saveData(pageTitle);
    },
    async getDataFromStorage() {
      await this.storageManager.getData(pageTitle);
      this.clearItemList();
      this.fillItemList();
    }
  }
}

const createSwitchingButtonContainer = () => {
  const content = document.createElement('div');
  content.classList.add('d-flex', 'justify-content-between', 'mb-3');
  const switchingButton = document.createElement('button');
  switchingButton.classList.add('btn', 'btn-primary');
  content.append(switchingButton);

  return {
    content,
    switchingButton
  }
}

const createApp = async (container = document.querySelector('.app'), headerText = 'Я') => {
  const appContainer = createContainer();
  const appHeader = createAppHeader(headerText);
  const storageManager = createStorageManager();
  await storageManager.configStorageManager(headerText);

  const nav = createNav();

  const taskListComponent = createTaskListComponent(headerText, storageManager);
  await taskListComponent.getDataFromStorage();

  const inputGroup = createInputGroup();
  configTaskInput(inputGroup.input, inputGroup.button);
  // configTasksStorage(inputGroup.button, inputGroup.input, storageManager, headerText);
  inputGroup.button.addEventListener(
    'click',
    async () => {
      await taskListComponent.addNewTask({
        name: inputGroup.input.value,
        done: false,
        owner: headerText,
      });
      inputGroup.button.disabled = true;
      inputGroup.input.value = '';
      // await taskListComponent.getDataFromStorage();;
    }
  )

  const switchingButtonKit = createSwitchingButtonContainer();
  switchingButtonKit.switchingButton.textContent = storageManager.currentStorage;
  switchingButtonKit.switchingButton.addEventListener(
    'click',
    async () => {
      await storageManager.switchStorageManager();
      switchingButtonKit.switchingButton.textContent = storageManager.currentStorage;
      await taskListComponent.getDataFromStorage();
    }
  );

  if (nav !== undefined) {
    appContainer.append(nav);
  }

  appContainer.append(appHeader, inputGroup.inputDiv, switchingButtonKit.content, taskListComponent.itemList);
  container.classList.add('my-5');
  container.append(appContainer);
};

export {
  createApp
};
