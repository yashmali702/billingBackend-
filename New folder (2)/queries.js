const pool = require('../connection');

const createVen = (req, res) => {
    // Table creation queries
    const createVendorTable = `
    CREATE TABLE IF NOT EXISTS Vendor (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL
    );`;

  const createProductTable = `
    CREATE TABLE IF NOT EXISTS Product (
      id INT PRIMARY KEY AUTO_INCREMENT,
      Product VARCHAR(100) NOT NULL,
      product_id INT,
      Price INT,
      Quantity INT,
      FOREIGN KEY (product_id) REFERENCES Vendor(id)
    );`;

  // Execute the queries
  pool.query(createVendorTable, (err) => {
    if (err) {
      console.error('Error creating Vendor table:', err);
      res.status(500).json({ error: 'Error creating Vendor table' });
    } else {
      console.log('Vendor table created.');

      pool.query(createProductTable, (err) => {
        if (err) {
          console.error('Error creating Product table:', err);
          res.status(500).json({ error: 'Error creating Product table' });
        } else {
          console.log('Product table created.');
          res.json({ message: 'Tables created successfully' });
        }
      });
    }
  });
}



const getItems = (req, res) => {
    // SQL query to select all products from the Product table
    const selectQuery = 'SELECT * FROM Product';
  
    // Execute the SQL query to fetch all products
    pool.query(selectQuery, (error, results) => {
      if (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
      } else {
        console.log('Products fetched successfully:', results);
        res.json({ products: results }); 
      }
    });
  };


  const getItemsById = (req, res) => {
    // Extract the product name from the URL parameters
    const productName = req.params.Name; // Use req.params instead of req.body
  
    // SQL query to select products with a specific name from the Product table
    const selectQuery = 'SELECT * FROM Product WHERE Product = ?';
  
    // Execute the SQL query to fetch products by name
    pool.query(selectQuery, [productName], (error, results, fields) => {
      if (error) {
        console.error('Error fetching products by name:', error);
        res.status(500).json({ error: 'Error fetching products by name' });
      } else {
        console.log(`Products with name "${productName}" fetched successfully:`, results);
        res.json({ products: results }); // Send the retrieved products as a JSON response
      }
    });
  };

  const createItems = (req, res) => {
    // Extract JSON data from the request body
    const newProduct = req.body;
  
    // SQL query to insert the new product data into the Product table
    const insertQuery = 'INSERT INTO Product SET ?';
  
    // Execute the SQL query to insert the data
    pool.query(insertQuery, newProduct, (error, results, fields) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          // Handle duplicate entry error
          console.error('Error inserting product:', error);
          res.status(400).json({ error: 'Duplicate product name. Product names must be unique.' });
        } else {
          // Handle other errors
          console.error('Error inserting product:', error);
          res.status(500).json({ error: 'Error inserting product' });
        }
      } else {
        console.log('Product added successfully:', results);
        res.json({ message: 'Product added successfully' });
      }
    });
  };

  const updateItems = (req, res) => {
    // Extract the product name from the URL parameters
    const productName = req.params.Name;
  
    // Extract the updated product data from the request body
    const updatedProductData = req.body;
  
    // SQL query to update the product with a specific name in the Product table
    const updateQuery = 'UPDATE Product SET ? WHERE Product = ?';
  
    // Execute the SQL query to update the product
    pool.query(updateQuery, [updatedProductData, productName], (error, results, fields) => {
      if (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
      } else if (results.affectedRows === 0) {
        // No rows were affected, indicating that the product doesn't exist
        res.status(404).json({ error: `Product with name "${productName}" not found` });
      } else {
        console.log(`Product with name "${productName}" updated successfully:`, results);
        res.json({ message: `Product with name "${productName}" updated successfully` });
      }
    });
};

const deleteItems = (req, res) => {
    // Extract the product ID from the URL parameters
    const productId = req.params.Name;
  
    // SQL query to delete the product with a specific ID from the Product table
    const deleteQuery = 'DELETE FROM Product WHERE Product = ?';
  
    // Execute the SQL query to delete the product
    pool.query(deleteQuery, productId, (error, results, fields) => {
      if (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
      } else {
        console.log(`Product with ID ${productId} deleted successfully`);
        res.json({ message: `Product with ID ${productId} deleted successfully` });
      }
    });
  };

module.exports = {
    getItems,
    getItemsById,
    createItems,
    updateItems,
    deleteItems,
    createVen,
}