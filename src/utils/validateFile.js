const validImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
];

const validVideoTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/mov',
  'video/avi',
  'video/flv',
  'video/mkv',
  'video/3gp',
];

export const allowVideoType = (fileType) => {
  return validVideoTypes.includes(fileType);
};

export const allowImageType = (fileType) => {
  return validImageTypes.includes(fileType);
};
