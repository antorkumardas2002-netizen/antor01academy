const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve signup.html, joy.css, etc.

app.use(session({
  secret: "replace_with_a_strong_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 15 } // 15 minutes
}));

// POST /signup  <-- equivalent of your signup.php
app.post("/signup", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Invalid Request!");
  }

  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const password = (req.body.password || ""); // will store in session for demo

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Save to session (you can later persist to DB)
  req.session.signup_name = name;
  req.session.signup_email = email;
  req.session.signup_password = password;
  req.session.signup_otp = otp;

  // In production you would send the OTP via email here (e.g., nodemailer)
  // For demo we just redirect to the verify page which shows OTP for testing
  return res.redirect("/verify-otp");
});

// Optional: simple GET signup form (if you want a tiny test page)
app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
  console.log(`POST signup at http://localhost:${PORT}/signup (or open /signup.html)`);
});
