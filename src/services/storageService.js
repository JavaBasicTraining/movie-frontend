class LocalStorageService {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key) {
    return localStorage.getItem(key);
  }

  remove(key) {
    localStorage.removeItem(key);
  }
}

export const storageService = new LocalStorageService();
