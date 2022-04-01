function addData(pageTitle, data) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle));
  storage = [...storage, data];
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

function deleteData(pageTitle, data) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle));
  storage = storage.filter(item => item.name !== data.name);
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

function updateData(pageTitle, data) {
  let storage = JSON.parse(window.localStorage.getItem(pageTitle));
  for (let i = 0; i < storage.length; i++) {
    if (storage[i].name === data.name) {
      storage[i] = JSON.parse(JSON.stringify(data));
    }
  }
  window.localStorage.setItem(pageTitle, JSON.stringify(storage));
}

function getData(pageTitle) {
  return JSON.parse(window.localStorage.getItem(pageTitle));
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
