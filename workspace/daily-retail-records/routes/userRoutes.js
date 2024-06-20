const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Fetch user role
router.get('/role', authMiddleware.verifyToken, (req, res) => {
  try {
    // Utilize the user object added to the req by the authMiddleware
    const userRole = req.user.role;
    console.log('Fetching user role for:', req.user.id);
    res.json({ role: userRole });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Error fetching user role', error: error.message });
  }
});

module.exports = router;