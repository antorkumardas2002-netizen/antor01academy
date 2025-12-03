const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // for your HTML

// POST route for form submission
app.post("/admission", async (req, res) => {
  const { name, email, phone } = req.body;

  // Email settings
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "antor2002das@gmail.com", // Your email
      pass: "YOUR_APP_PASSWORD_HERE"  // Gmail App Password (not normal password)
    }
  });

  const mailOptions = {
    from: "noreply@yourdomain.com",
    to: "antor2002das@gmail.com",
    subject: "New Admission Form Submission",
    text: `Student Name: ${name}\nEmail: ${email}\nPhone: ${phone}`
  };

  try {
    await transporter.sendMail(mailOptions);

    res.send(`
      <h2>✅ Thank you ${name}! Your form has been submitted successfully.</h2>
      <a href="index.html">Go Back to Home</a>
    `);
  } catch (error) {
    console.error(error);
    res.send(`
      <h2>❌ Sorry! Something went wrong. Please try again.</h2>
    `);
  }
});


// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
