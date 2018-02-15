// line template button

/**
 * @param title {string} the title display
 * @param imgInfo {
 *    {thumbnailImageUrl: string, imageAspectRatio: string, imageSize: string, imageBackgroundColor: string}}
 * @param actions
 * @param text {string} [optional]
 */
export const createButton = (text, actions, imgInfo, title) => {
  const {
    thumbnailImageUrl, imageAspectRatio, imageSize, imageBackgroundColor,
  } = imgInfo || {};

  return {
    type: 'buttons',
    title,
    text,
    thumbnailImageUrl,
    imageAspectRatio,
    imageSize,
    imageBackgroundColor,
    actions,
  };
};

/**
 * @param imgUrl {string} JPEG or PNG, Max width: 1024px
 * @param aspectRation {string} ['rectangle', 'square']
 * @param size {string} ['cover','contain']
 * @param backgroundColor {string} [color hex]
 * @return {{thumbnailImageUrl: string, imageAspectRatio: string, imageSize: string, imageBackgroundColor: string}}
 */
export const createThumbnail = (
  imgUrl, aspectRation, size, backgroundColor) => {
  return {
    thumbnailImageUrl: imgUrl,
    imageAspectRatio: aspectRation || 'rectangle',
    imageSize: size || 'cover',
    imageBackgroundColor: backgroundColor || '#FFFFFF',
  };
};

export const createConfirm = (text, lineActions) => {
  return {
    type: 'confirm',
    text,
    actions: lineActions,
  };
};

module.exports.createButton = createButton;
module.exports.createThumbnail = createThumbnail;
