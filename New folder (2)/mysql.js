// const mysql = require('mysql2');
// const bodyParser = require('body-parser');

// // Create a connection to the MySQL database
// const connection = mysql.createConnection({
//   host:"localhost",
//   user: "yash",
//   password:"jayendra5" ,
//   database:"org" 
// });

// // Establish the connection
// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to the MySQL server.');

//   // Create the tables
//   createTables();
// });

// // Function to create tables
// function createTables() {
//   // Table creation queries
//   const createAuthorTable = `
//     CREATE TABLE IF NOT EXISTS Vendor (
//       id INT PRIMARY KEY AUTO_INCREMENT,
//       name VARCHAR(100) NOT NULL
//     );`;

//   const createitemTable = `
//     CREATE TABLE IF NOT EXISTS Product (
//       id INT PRIMARY KEY AUTO_INCREMENT,
//       Product VARCHAR(100) NOT NULL,
//       product_id INT,
//       Price INT,
//       Quantity INT,
//       FOREIGN KEY (product_id) REFERENCES Vendor(id)
//     );`;

//   // Execute the queries
//   connection.query(createAuthorTable, (err) => {
//     if (err) throw err;
//     console.log('Vendor table created.');

//     connection.query(createitemTable, (err) => {
//       if (err) throw err;
//       console.log('Product table created.');

//       // Close the 
//       const newVendorName = {
//         name : 'vishal'
//       };
//     });
//   });

// const insert = 'INSERT INTO Vendor (name) VALUES (?)';

// connection.query(insert, newVendorName, (error, results, fields) => {
//   if (error) {
//     console.error('Error inserting vendor:', error);
//   } else {
//     console.log('Vendor added successfully:', results);
//   }
// });
// const requestBody = JSON.stringify(req.body);
//       // const newProduct = {
//       //   Product: 'ladu',
//       //   product_id: 1,
//       //   Price: 25.99,
//       //   Quantity: 10,
//       // };

//       console.log('Received form data:', requestBody);
      
//       const insertQuery = 'INSERT INTO Product SET ?';
      
//       connection.query(insertQuery, newProduct, (error, results, fields) => {
//         if (error) {
//           console.error('Error inserting item:', error);
//         } else {
//           console.log('item added successfully:', results);
//         }
//       });
      
    
  


//   // Update a product
// const updateProduct = (productId, newData) => {
//   const updateQuery = 'UPDATE Product SET ? WHERE id = ?';

//   connection.query(updateQuery, [newData, productId], (error, results, fields) => {
//     if (error) {
//       console.error('Error updating product:', error);
//     } else {
//       console.log('Product updated successfully:', results);
//     }
//   });
// };

// // Usage example:
// const formData = req.body.JSON.stringify(updatedProductData);
// const requestBody = JSON.strinzzzzz

// updateProduct(1, updatedProductData); 

// // Delete a product
// const deleteProduct = (productId) => {
//   const deleteQuery = 'DELETE FROM Product WHERE id = ?';

//   connection.query(deleteQuery, productId, (error, results, fields) => {
//     if (error) {
//       console.error('Error deleting product:', error);
//     } else {
//       console.log('Product deleted successfully:', results);
//     }
//   });
// };

// // Usage example:
// deleteProduct(1); // Delete product with id 1






const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yash',
  password: 'jayendra5',
  database: 'org',
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL server:', err);
    throw err;
  }
  console.log('Connected to the MySQL server.');

  // Create the tables
  createTables();
});

// Function to create tables
function createTables() {
  // Table creation queries (same as in your code)
  const createVendorTable = `CREATE TABLE IF NOT EXISTS Vendor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
  );`;

  const createProductTable = `CREATE TABLE IF NOT EXISTS Product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Product VARCHAR(100) NOT NULL,
    product_id INT,
    Price INT,
    Quantity INT,
    FOREIGN KEY (product_id) REFERENCES Vendor(id)
  );`;

  // Execute the queries
  connection.query(createVendorTable, (err) => {
    if (err) {
      console.error('Error creating Vendor table:', err);
    } else {
      console.log('Vendor table created.');
    }

    connection.query(createProductTable, (err) => {
      if (err) {
        console.error('Error creating Product table:', err);
      } else {
        console.log('Product table created.');
      }
    });
  });
}

// Define Express.js route handlers for handling HTTP requests
app.post('/create-vendor', (req, res) => {
  const newVendorName = req.body.name;
  const insertQuery = 'INSERT INTO Vendor (name) VALUES (?)';

  connection.query(insertQuery, [newVendorName], (error, results, fields) => {
    if (error) {
      console.error('Error inserting vendor:', error);
      res.status(500).json({ error: 'Error inserting vendor' });
    } else {
      console.log('Vendor added successfully:', results);
      res.json({ message: 'Vendor added successfully' });
    }
  });
});

app.post('/create-product', (req, res) => {
  // Extract JSON data from the request body
  const newProduct = req.body;

  // SQL query to insert the new product data into the Product table
  const insertQuery = 'INSERT INTO Product SET ?';

  // Execute the SQL query to insert the data
  connection.query(insertQuery, newProduct, (error, results, fields) => {
    if (error) {
      console.error('Error inserting product:', error);
      res.status(500).json({ error: 'Error inserting product' });
    } else {
      console.log('Product added successfully:', results);
      res.json({ message: 'Product added successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
