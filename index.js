import express from 'express';
import mysql from 'mysql2';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mini_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Use middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Register a user
app.post('/signup', (req, res) => {
 

  const { username, password, email } = req.body;
  pool.query(
      'INSERT INTO users (userName, U_password, email) VALUES (?, ?, ?)',
      [username, password, email],
      (error) => {
          if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              res.redirect('/dashboard');
          }
      }
  );
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  pool.query(
      'SELECT * FROM users WHERE userName = ? AND U_password = ?',
      [username, password],
      (error, results) => {
          if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              if (results.length > 0) {
                  res.json({ success: true, message: 'Login successful' });
              } else {
                  res.status(401).json({ error: 'Invalid credentials' });
              }
          }
      }
  );
});



app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});


app.get('/transactions', (req, res) => {
  // Query to select all transactions from the user_transaction table
  const sql = 'SELECT * FROM user_transaction';

  // Execute the query
  pool.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Render the transactions.html file and pass the result to it
      res.render('transactions.ejs', { transactions: results });
    }
  });
});



app.get('/accounts', (req, res) => {
 // Query to select all transactions from the user_transaction table
 const sql = 'SELECT * FROM accounts';

 // Execute the query
 pool.query(sql, (error, results) => {
   if (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
   } else {
     // Render the transactions.html file and pass the result to it
     res.render('accounts.ejs', { accounts: results });
   }
 });
});

app.get('/blacklisted', (req, res) => {
  // Query to select all transactions from the user_transaction table
  const sql = 'SELECT * FROM blacklist;';
 
  // Execute the query
  pool.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Render the transactions.html file and pass the result to it
      res.render('blacklist.ejs', { blacklists: results });
    }
  });
 });

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
