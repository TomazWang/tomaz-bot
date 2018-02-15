// line template message

// eslint-disable-next-line import/prefer-default-export
/**
 * Create template message
 * @param altText
 * @param template
 * @return {{type: string, altText: *, template: *}}
 */
export const createTempMsg = (altText, template) => ({
  type: 'template',
  altText,
  template,
});
