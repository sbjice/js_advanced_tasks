function createStorageManager() {
  return {
    storage: [],
    currentStorage: '',
    server: null,
    browserStorage: null,
    pageTitle: '',
    async getStorageManager() {
      if (this.currentStorage === 'server') {
        if (this.server === null) this.server = await import('./api.js');
      } else {
        if (this.browserStorage === null) this.browserStorage = await import('./localStorage.js');
      }
    },
    async saveData() {
      if (this.currentStorage === 'localStorage') {
        this.browserStorage.saveData(this.pageTitle, this.storage);
      } else {
        console.log('no such method for API');
      }
    },
    async switchStorageManager() {
      if (this.currentStorage === 'localStorage') {
        this.currentStorage = 'server';
      } else this.currentStorage = 'localStorage';
      this.changeStorageAddress();
      await this.getStorageManager();
    },
    async getData() {
      if (this.currentStorage === 'localStorage') {
        this.storage = this.browserStorage.getData(this.pageTitle);
      } else {
        this.storage = await this.server.loadTodoItems();
        this.storage = this.storage.filter(item => {
          return item.owner === this.pageTitle
        });
      }
      return this.storage;
    },
    async addData(data) {
      this.storage = [...this.storage, data];
      if (this.currentStorage === 'localStorage') {
        this.browserStorage.addData(this.pageTitle, data);
      } else {
        await this.server.createTodoItem(data);
      }
    },
    async deleteData(data) {
      this.storage = this.storage.filter(item => item.name !== data.name);
      if (this.currentStorage === 'localStorage') {
        this.browserStorage.deleteData(this.pageTitle, data);
      } else {
        await this.server.deleteTodoItem(data.id);
      }
    },
    async updateData(data) {
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].name === data.name) {
          this.storage[i] = JSON.parse(JSON.stringify(data));
        }
      }
      if (this.currentStorage === 'localStorage') {
        this.browserStorage.updateData(this.pageTitle, data);
      } else {
        await this.server.changeTodoItem(data);
      }
    },
    getCurrentStorage() {
      this.currentStorage = 'localStorage';
      if (window.localStorage.getItem('storageAddress')) this.currentStorage = JSON.parse(window.localStorage.getItem('storageAddress'));
      else window.localStorage.setItem('storageAddress', JSON.stringify(this.currentStorage));
    },
    async configStorageManager(pageTitle) {
      this.pageTitle = pageTitle;
      this.getCurrentStorage();
      await this.getStorageManager();
      this.getData(pageTitle);
    },
    changeStorageAddress() {
      window.localStorage.setItem('storageAddress', JSON.stringify(this.currentStorage));
    },
    getIndexOfData(data) {
      for (let i = 0; i < this.storage.length; i++) {
        if (data.id === this.storage[i].id) return i;
      }
      return -1;
    },
  }
}

export {
  createStorageManager
};
