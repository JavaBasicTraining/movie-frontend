class SpinnerService {
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

export const spinnerService = new SpinnerService();
