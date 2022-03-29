const createStorageManager = async () => {
  const content = document.createElement('div');
  content.classList.add('d-flex', 'justify-content-between', 'mb-3');
  const switchingButton = document.createElement('button');
  switchingButton.classList.add('btn', 'btn-primary');
  content.append(switchingButton);

  let currentStorage = 'localStorage';

  if (window.localStorage.getItem('storageAddress')) currentStorage = JSON.parse(window.localStorage.getItem('storageAddress'));
  else window.localStorage.setItem('storageAddress', JSON.stringify(currentStorage));

  let server = null;
  if (currentStorage === 'server') {
    server = await import('./api.js');
  }

  switchingButton.textContent = currentStorage;


  async function switchStorageManager() {
    if (currentStorage === 'localStorage') {
      if (server === null) server = await import('./api.js');
      currentStorage = 'server';
    } else currentStorage = 'localStorage';
  }

  switchingButton.addEventListener(
    'click',
    async () => {
      await switchStorageManager();
      switchingButton.textContent = currentStorage;
      window.localStorage.setItem('storageAddress', JSON.stringify(currentStorage));
    }
  )

  async function saveData(pageTitle, storage) {
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    } else {
      console.log('localStorage inactive');
    }
  }

  async function addData(pageTitle, storage, data) {
    storage = [...storage, data];
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    } else {
      await server.createTodoItem(data);
      console.log('localStorage inactive');
    }
  }

  async function deleteData(pageTitle, storage, data) {
    storage = storage.filter(item => item.name !== data.name);
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    } else {
      await server.deleteTodoItem(data.id);
      console.log('localStorage inactive');
    }
  }

  async function getData(pageTitle) {
    let storage = [];
    if (currentStorage === 'localStorage') {
      storage = JSON.parse(window.localStorage.getItem(pageTitle));
    } else {
      storage = await server.loadTodoItems();
      storage = storage.filter(item => {
        return item.owner === pageTitle
      });
      console.log('localStorage inactive');
    }
    return storage;
  }

  async function updateData(pageTitle, storage, data) {
    for (let i = 0; i < storage.length; i++) {
      if (storage[i].name === data.name) {
        storage[i] = JSON.parse(JSON.stringify(data));
      }
    }
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    } else {
      await server.changeTodoItem(data);
      console.log('localStorage inactive');
    }
  }

  return {
    content,
    switchingButton,
    saveData,
    getData,
    addData,
    deleteData,
    updateData
  }
}

const configTasksStorage = (taskAddButton, taskInput, tasksStorage, pageTitle) => {
  taskAddButton.addEventListener(
    'click',
    () => {
      tasksStorage.addNewTask({
        name: taskInput.value,
        done: false,
        owner: pageTitle,
      });
      taskAddButton.disabled = true;
      taskInput.value = '';
    }
  )
}

export {
  createStorageManager,
  configTasksStorage
};
