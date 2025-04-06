export const validatorUtil = {
  validateFileType: (value, fileType) => {
    if (value && value.length > 0) {
      const isImage = value[0].type.startsWith(fileType);
      if (!isImage) {
        return Promise.reject(new Error());
      }
    }
    return Promise.resolve();
  },
};
