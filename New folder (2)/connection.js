
// const mysql = require('mysql2');
// const connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'yash',
// 	password: 'jayendra5',
// 	database: 'org',
//   });
  
//   // Establish the connection
//   connection.connect((err) => {
// 	if (err) {
// 	  console.error('Error connecting to the MySQL server:', err);
// 	  throw err;
// 	}
// 	console.log('Connected to the MySQL server.');
  
// 	// // Create the tables
// 	// createTables();
//   });
// const { Pool } = require('pg');

// const pool = new Pool({
//   host: "localhost",
//   user: "yash",
//   password: "jayendra5",
//   database: "org"
// });

// module.exports = pool;



const mysql = require('mysql2');
const pool = mysql.createConnection({
	host: 'localhost',
	user: 'yash',
	password: 'jayendra5',
	database: 'org',
});
// module.exports = router;

// // Establish the MySQL connection
// mysqlConnection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the MySQL server:', err);
//     throw err;
//   }
//   console.log('Connected to the MySQL server.');
// });

// const { Pool } = require('pg');

// const pool = new Pool({
// 	host: 'localhost',
// 	user: 'yash',
// 	password: 'jayendra5',
// 	database: 'org',
// });

// // // Export the PostgreSQL connection pool
// // module.exports = pool;
// const { Pool } = require('pg');

// const pool = new Pool({
//   host: 'localhost',
//   user: 'yash',
//   password: 'jayendra5',
//   database: 'org',
// });

// Export the PostgreSQL connection pool
module.exports = pool;