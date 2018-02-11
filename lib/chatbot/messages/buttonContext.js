// button context

export const createButtonContext = ({
                                      message, buttonActions, imgUrl, optionalTitle,
                                    }) => ({
  title: optionalTitle,
  message,
  actions: Array.isArray(buttonActions) ? buttonActions : [buttonActions],
  thumbnailImageUrl: imgUrl,
});


/**
 * @param type {string} ['post', 'message', 'uri']
 * @param label {string} shows on the template
 * @param actionName {string} actionName
 * @param text {string} type = 'message': <message will be sent>, type = 'uri': <uri>, not used when type = 'post'
 * @param datas {*} key value paris for extra data.
 * @return {{asMessage: string, lable: string, actionName: string, datas: *}}
 */
export const createButtonAction = ({
                                     type, label, actionName, text, datas,
                                   }) => ({
  type,
  label,
  actionName,
  text,
  datas,
});

