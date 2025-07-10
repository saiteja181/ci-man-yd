const express = require('express');
const router = express.Router();
const questions = require('../services/striverData');

router.get('/', (req, res) => {
  const { shuffle } = req.query;
  let data = [...questions];
  if (shuffle === 'true') {
    data.sort(() => Math.random() - 0.5);
  }
  res.json(data);
});

module.exports = router;
