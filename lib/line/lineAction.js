/**
 *
 * @param label {string}
 * @param text {string}
 * @param actionName {string}
 * @param datas {[{key:string, value:string}]}
 */
export const createPostbackAction = (label, text, actionName, datas) => {
  let data = `action=${actionName}`;
  if (datas) {
    Object.keys(datas).forEach((key) => {
      data += `&${key}=${datas[key]}`;
    });
  }

  return {
    type: 'postback',
    text,
    label,
    data,
  };
};


export const createMessageAction = (lable, text) => ({
  lable,
  text,
  type: 'message',
});


export const createUriAction = (lable, uri) => ({
  lable,
  uri,
  type: 'uri',
});
