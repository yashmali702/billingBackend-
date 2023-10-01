// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const cors = require('cors');
const routes = require('./routes'); // Import the routes

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// Use the routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}.`);
});