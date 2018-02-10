// line template message

function createTempMsg(title, template) {
  return {
    type: 'template',
    altText: title,
    template,
  };
}

module.exports = createTempMsg;
