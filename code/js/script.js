const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('code'));
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Elmomo123!', // use your MySQL password if needed
  database: 'yaphub'
});

app.get('/hello-user', (req, res) => {
  const sql = 'SELECT * FROM users LIMIT 1';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.send('No users found');
    }

    const user = results[0];
    res.send(`Hello, ${user.first_name}!`);
  });
});

const crypto = require('crypto');

//route that creates user
app.post("/create-user", (req,res) => {
  //request sends all user info
  const { first_name, last_name, nickname, email, password } = req.body;
  const hashedPassword = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');
  //sql query to insert a new user into the db
  const sql = `
    INSERT INTO users (first_name, last_name, nickname, email, password) 
    VALUES (?, ?, ?, ?, ?) `;

  db.query(sql, [first_name, last_name, nickname, email, hashedPassword], (err,results) => {
  //if db error occurs, return server error
    if (err) {
      console.error(err);
      return res.status(500).send('Error User Creation');
    }
  //if successful, send success response
      res.send(`User successfully created!`);
    });
  });

// route that logins user
app.post('/login', (req, res) => {
  //gets email and pw from request
  const email = req.body.email;
  const hashedPassword = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');
//sql query to find user with matching email and pw in db
const sql = `
  SELECT * FROM users
  WHERE email = ? AND password = ? `;

db.query(sql, [email, hashedPassword], (err, results) => {
//if db error occurs, return server error
  if (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
}
//if email and pw match, success is true and then return success
//else returns success as false
  if (results.length > 0) {
    return res.status(200).json({ success: true });
      } else {
    return res.status(401).json({ success: false });
    }      

  });
});


app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
