async function createStorageManager() {
  const content = document.createElement('div');
  content.classList.add('d-flex', 'justify-content-between', 'mb-3');
  const switchingButton = document.createElement('button');
  switchingButton.classList.add('btn', 'btn-primary');
  content.append(switchingButton);

  let currentStorage = 'localStorage';

  if (window.localStorage.getItem('storageAddress')) currentStorage = JSON.parse(window.localStorage.getItem('storageAddress'));
  else window.localStorage.setItem('storageAddress', JSON.stringify(currentStorage));

  console.log('current storage now:', currentStorage);

  let server = null;
  async function getServer() {
    server = await import('./api.js');
  }
  if (server === null && currentStorage === 'server') {
    await getServer();
  }

  switchingButton.textContent = currentStorage;

  async function switchStorageManager() {
    if (currentStorage === 'localStorage') {
      currentStorage = 'server';
      console.log(currentStorage);
      if (server === null && currentStorage === 'server') {
        await getServer();
        console.log(server);
        console.log('api module loaded');
      }
    } else currentStorage = 'localStorage';
  }

  switchingButton.addEventListener(
    'click',
    async () => {
      await switchStorageManager();
      switchingButton.textContent = currentStorage;
      window.localStorage.setItem('storageAddress', JSON.stringify(currentStorage));
    }, {
      capture: true
    }
  )

  async function saveData(pageTitle, storage) {
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    }
  }

  async function addData(pageTitle, storage, data) {
    storage = [...storage, data];
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    } else {
      await server.createTodoItem(data);
    }
  }

  async function deleteData(pageTitle, storage, data) {
    storage = storage.filter(item => item.name !== data.name);
    if (currentStorage === 'localStorage') {
      window.localStorage.setItem(pageTitle, JSON.stringify(storage));
    } else {
      await server.deleteTodoItem(data.id);
    }
  }

  async function getData(pageTitle) {
    let storage = [];
    if (currentStorage === 'localStorage') {
      storage = JSON.parse(window.localStorage.getItem(pageTitle));
    } else {
      if (server===null) await getServer();
      storage = await server.loadTodoItems();
      storage = storage.filter(item => {
        return item.owner === pageTitle
      });
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

function configTasksStorage(taskAddButton, taskInput, tasksStorage, pageTitle){
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
