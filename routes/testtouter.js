const express = require('express');
const router = express.Router();




/* GET home page. */
router.get('/', function (req, res, next) {

  db.collection('users').get()
    .then(snap => {
      snap.forEach((doc) => {
        res.send(`${doc.id} -> ${JSON.stringify(doc.data())}`);
      })
    }).catch(err => {
    console.log(err);
  })


});

module.exports = router;
