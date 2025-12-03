const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection (same as db.php)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_site"
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// POST /verify-otp  → same as your PHP verify.php
app.post("/verify-otp", (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const sql = "SELECT * FROM users WHERE email = ? AND otp = ?";

  db.query(sql, [email, otp], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // OTP matched → verify account
      const updateSql = "UPDATE users SET is_verified = 1, otp = NULL WHERE email = ?";
      db.query(updateSql, [email], (err2) => {
        if (err2) throw err2;

        res.send(`
          <h2>✅ Account verified successfully!</h2>
          <a href="login.html">Login Now</a>
        `);
      });
    } else {
      res.send(`
        <h2>❌ Invalid OTP. Try again.</h2>
        <a href="otp.html">Back</a>
      `);
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
