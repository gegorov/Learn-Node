const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {

  const wes = {
    name: 'gg',
    cool: true,
  }
  // res.send('Hey! It works!');
  // res.send('LALALALA works');
  console.log(req.query);
  res.json(req.query);
});

router.get('/reverse/:name', (req, res) => {
  console.log(`======>>>>> ${typeof req.params.name}`);
  const reverse = [...req.params.name].reverse().join('')
  res.send(reverse);
})

module.exports = router;
