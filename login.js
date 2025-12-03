const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_site",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// Login route
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const user = result[0];

      // Check password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (isMatch) {
          req.session.username = user.name;

          res.send(
            `Welcome, ${req.session.username}! <a href="index.html">Go to Home</a>`
          );
        } else {
          res.send("Invalid password!");
        }
      });
    } else {
      res.send("No account found with this email.");
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
