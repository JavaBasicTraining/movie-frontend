class LocalStorageService {
  set(key, value) {
    localStorage.setItem(key, value);
  }

  setObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getObject(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  get(key) {
    return localStorage.getItem(key);
  }

  remove(key) {
    localStorage.removeItem(key);
  }
}

export const storageService = new LocalStorageService();
