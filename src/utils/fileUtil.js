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

  getFileFromEvent(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  },
};
