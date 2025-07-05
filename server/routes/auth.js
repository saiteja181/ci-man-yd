const express = require('express');
const router = express.Router();

// POST /api/auth/login (placeholder)
router.post('/login', (req, res) => {
  res.json({ 
    message: 'Auth endpoint ready',
    user: { name: 'Student', level: 'Beginner' }
  });
});

module.exports = router;