const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve joy.css from public/
app.use(session({
  secret: "replace_with_a_strong_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 15 } // 15 minutes
}));

// --- Demo helper route: simulate signup that sets session values ---
// Use this route to set signup_email and signup_otp for testing.
// In your real signup flow, set these in the signup POST handler instead.
app.get("/demo-start-signup", (req, res) => {
  req.session.signup_email = "student@example.com";
  req.session.signup_otp = "123456"; // in real world generate random and email it
  res.send("Demo signup started. Now go to <a href='/verify-otp'>Verify OTP</a>.");
});

// GET /verify-otp -> show the page only if signup_email exists
app.get("/verify-otp", (req, res) => {
  if (!req.session.signup_email) {
    // Redirect to signup page (you can change path to your actual signup page)
    return res.redirect("/signup.html");
  }

  // HTML response — mirrors your PHP page and shows the OTP for demo
  const otp = req.session.signup_otp || "";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify OTP</title>
      <link rel="stylesheet" href="/joy.css" />
    </head>
    <body>
      <section class="section">
        <h2>Verify OTP</h2>
        <p>We sent an OTP to your email (for demo showing here: <b>${otp}</b>)</p>
        <form action="/verify" method="post">
          <input type="text" name="otp" placeholder="Enter OTP" required />
          <button type="submit">Verify</button>
        </form>
      </section>
    </body>
    </html>
  `);
});

// POST /verify -> check submitted OTP against session
app.post("/verify", (req, res) => {
  if (!req.session.signup_email) {
    return res.redirect("/signup.html");
  }

  const submittedOtp = (req.body.otp || "").trim();
  const expectedOtp = req.session.signup_otp || "";

  if (submittedOtp === expectedOtp && expectedOtp !== "") {
    // OTP correct — proceed with whatever you do after verification
    // e.g., create user account, clear signup session values, set authenticated flag, etc.
    // Example: set a flag and redirect to welcome page
    req.session.verified = true;
    // Optionally clear signup otp from session
    delete req.session.signup_otp;
    res.send(`OTP verified! Welcome. <a href="/index.html">Go to Home</a>`);
  } else {
    res.send("Invalid OTP. <a href='/verify-otp'>Try again</a>");
  }
});

// Static pages for demo (optional)
// Ensure you have public/signup.html and public/index.html as needed, or change paths above.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`For demo: visit http://localhost:${PORT}/demo-start-signup to begin`);
});
