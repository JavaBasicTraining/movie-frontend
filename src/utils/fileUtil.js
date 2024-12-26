export const fileUtil = {
  getUrl: (file) => {
    if (file.url) {
      return file.url;
    }
    if (file.originFileObj) {
      return URL.createObjectURL(file.originFileObj);
    }
    return '';
  },
};
