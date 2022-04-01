function addData(pageTitle, data) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle));
  if (storage) {
    storage = [...storage, data];
  } else {
    storage = [data];
  }
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

function deleteData(pageTitle, data) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle));
  if (storage) storage = storage.filter(item => item.name !== data.name);
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

function updateData(pageTitle, data) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle));
  if (storage) {
    for (let i = 0; i < storage.length; i++) {
      if (storage[i].name === data.name) {
        storage[i] = JSON.parse(JSON.stringify(data));
      }
    }
  } else storage = [];
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

function getData(pageTitle) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle))
  return storage ? storage : [];
}

function saveData(pageTitle, storage) {
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

export {
  addData,
  deleteData,
  updateData,
  getData,
  saveData
}
