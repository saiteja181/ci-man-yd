const express = require('express');
const router = express.Router();

// GET /api/users/profile (placeholder)
router.get('/profile', (req, res) => {
  res.json({ 
    message: 'User profile endpoint ready',
    user: { name: 'Student', level: 'Beginner' }
  });
});

module.exports = router;