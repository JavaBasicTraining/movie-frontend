class LoadingService {
  _callback = () => {};

  show() {
    this._callback(true);
  }

  hide() {
    this._callback(false);
  }

  subscribe(callback) {
    this._callback = callback;
  }

  unsubscribe() {
    this._callback = () => {};
  }
}

export const loadingService = new LoadingService();
