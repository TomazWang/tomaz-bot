// line template message

export const createTempMsg = (title, template) => ({
  type: 'template',
  altText: title,
  template,
});
