// routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Protected API routes
router.get('/protected-resource', authenticate, (req, res) => {
  // Your protected route logic here
  res.json({ message: 'Protected resource accessed successfully' });
});

router.post('/create-product', authenticate, (req, res) => {
  // Your create product logic here
  res.json({ message: 'Product created successfully' });
});

router.put('/update-product/:id', authenticate, (req, res) => {
  // Your update product logic here
  res.json({ message: 'Product updated successfully' });
});

router.delete('/delete-product/:id', authenticate, (req, res) => {
  // Your delete product logic here
  res.json({ message: 'Product deleted successfully' });
});

// Other API routes
// ...

module.exports = router;