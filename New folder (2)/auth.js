// const express = require("express");
// // const db = require("../db");
// const router = express.Router();
// const { body, validationResult } = require("express-validator");
// const bcrypt = require(' ');
// const jwt = require('jsonwebtoken');
// const pool = require('../connection');

// const JWT_SECRET = 'YourSecretKey'; // Change this to your secret key
// // const pool = db.getPool(); // Assuming you have a function to get the SQL connection pool

// // Route 1: Create a user using: POST "/api/auth/createuser" no login required
// router.post("/createuser", [

//     body('name', 'Enter a valid name').isLength({ min: 3 }),
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password is too short').isLength({ min: 4 }),

// ], async (req, res) => {
    
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {

//         let user = await pool.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
//         if (user.length > 0) {
//             return res.status(400).json({ error: "Sorry, user already exists" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(req.body.password, salt);

//         await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [req.body.name, req.body.email, secPass]);

//         const data = {
//             user: {
//                 email: req.body.email,
//             }
//         };
//         const authtoken = jwt.sign(data, JWT_SECRET);

//         res.json({ authtoken });

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Some error occurred");
//     }
// });

// // Route 2: Authenticate a user using: POST "/api/auth/login" no login required
// router.post("/login", [

//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password cannot be blank').exists(),

// ], async (req, res) => {

//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     try {

//         let user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//         user = user[0];
//         if (!user) {
//             return res.status(400).json({ error: "Please login with correct credentials" });
//         }

//         const passwordCompare = await bcrypt.compare(password, user.password);
//         if (!passwordCompare) {
//             return res.status(400).json({ error: "Please login with correct credentials" });
//         }

//         const data = {
//             user: {
//                 email: user.email,
//             }
//         };
//         const authtoken = jwt.sign(data, JWT_SECRET);

//         res.json({ authtoken });
        
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal server error");
//     }
// });

// // Route 3: Get logged-in user details: POST "/api/auth/getuser" login required
// router.post("/getuser", async (req, res) => {

//     try {
//         // Verify the JWT token here (use middleware or manual verification)
//         const token = req.header('auth-token');
//         if (!token) {
//             return res.status(401).json({ error: 'Access denied. Please log in.' });
//         }

//         jwt.verify(token, JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: 'Access denied. Invalid token.' });
//             }
            
//             // Token is valid, you can access user information here
//             const email = decoded.user.email;
            
//             // Fetch user details from the SQL database using email
//             pool.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
//                 if (err || result.length === 0) {
//                     return res.status(500).json({ error: 'Internal server error.' });
//                 }
                
//                 const user = {
//                     name: result[0].name,
//                     email: result[0].email,
//                 };

//                 res.json(user);
//             });
//         });

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal server error");
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./connection');
const Fetchuser = require('./fetchuser');

const JWT_SECRET = 'YourSecretKey'; // Change this to your secret key

// Route 1: Create a user using: POST "/api/auth/createuser" no login required
router.post(
  '/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }).trim(),
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is too short').isLength({ min: 4 }).trim(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user already exists
      const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        req.body.name,
        req.body.email,
        hashedPassword,
      ]);

      // Create and send JWT token
      const tokenData = { email: req.body.email };
      const token = jwt.sign(tokenData, JWT_SECRET);

      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Route 2: Authenticate a user using: POST "/api/auth/login" no login required
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Password cannot be blank').exists().trim(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Check if the user exists
      const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (user.length === 0) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Compare the password
      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create and send JWT token
      const tokenData = { email: user[0].email };
      const token = jwt.sign(tokenData, JWT_SECRET);

      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Route 3: Get logged-in user details: POST "/api/auth/getuser" login required
router.post('/getuser', Fetchuser, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
