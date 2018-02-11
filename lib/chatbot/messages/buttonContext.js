// button context
export const BUTTON_ACTION_TYPE_MESSAGE = 'message';
export const BUTTON_ACTION_TYPE_POST = 'post';
export const BUTTON_ACTION_TYPE_URI = 'uri';

/**
 *
 * Creates a action that will be triggered when button is clicked.
 *
 * Usage:
 *  createButtonAction({
 *    type: BUTTON_ACTION_TYPE_POST,
 *    label: 'some label',
 *    actionName: 'myAction',
 *    text: 'message or uri',
 *    datas:{
 *      key1: 'value1',
 *      key2: 'value2',
 *      ...
 *    },
 *  });
 *
 * @param {string} actionInfo.type
 *    [{@link BUTTON_ACTION_TYPE_POST}, {@link BUTTON_ACTION_TYPE_MESSAGE}, {@link BUTTON_ACTION_TYPE_URI}]
 * @param {string} actionInfo.label shows on the template
 * @param {string} actionInfo.actionName actionName
 * @param {string} actionInfo.text
 *    type = {@link BUTTON_ACTION_TYPE_MESSAGE}: <message will be sent>,
 *    type = {@link BUTTON_ACTION_TYPE_URI}: <uri>,
 *    type = {@link BUTTON_ACTION_TYPE_POST}: not used.
 * @param actionInfo.datas key value paris for extra data.
 * @return {{
    type: string,
    label: string,
    actionName: string,
    text: string,
    datas,
  }}
 */
export const createButtonAction = (actionInfo) => {
  const {
    type, label, actionName, text, datas,
  } = actionInfo;

  // check type is validate
  if (![
    BUTTON_ACTION_TYPE_URI, BUTTON_ACTION_TYPE_MESSAGE,
    BUTTON_ACTION_TYPE_POST].includes(type)) {
    throw new Error(`error when createButtonAction: Type was not recognized, ${type}`);
  }

  // in button template, label is required with max 20 chars.
  if (!label || label.trim().length <= 0 || label.length > 20) {
    throw new Error(`error when createButtonAction: Label format is incorrect, ${label}`);
  }


  // check datas
  if (type === BUTTON_ACTION_TYPE_URI || type === BUTTON_ACTION_TYPE_MESSAGE) {
    if (!text || text.trim().length <= 0) {
      throw new Error(`error occurs when createButtonAction: no text found when type = ${type}`);
    }
  }


  return {
    type,
    label,
    actionName,
    text,
    datas,
  };
};

export const createButtonContext = ({
  message, buttonActions, imgUrl, optionalTitle,
}) => ({
  title: optionalTitle,
  message,
  actions: Array.isArray(buttonActions) ? buttonActions : [buttonActions],
  thumbnailImageUrl: imgUrl,
});

