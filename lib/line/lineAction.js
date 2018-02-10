/**
 *
 * @param label {string}
 * @param text {string}
 * @param actionName {string}
 * @param datas {[{key:string, value:string}]}
 */
function createPostbackAction(label, text, actionName, datas) {
  let data = actionName;
  datas.forEach(d => {
    data += `&${d.key}=${d.value}`;
  });

  return {
    type: 'postback',
    text,
    label,
    data,
  };
}


function createMessageAction(lable, text) {
  return {
    lable,
    text,
    type: 'message',
  };
}

module.exports.createPostbackAction = createPostbackAction;
module.exports.createMessageAction = createMessageAction;
