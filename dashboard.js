// dashboard.js
const path = require("path");
const fs = require("fs");

module.exports = function (app) {
  app.get("/admin/dashboard", (req, res) => {
    if (!req.session.admin_logged_in) {
      return res.redirect("/admin");
    }

    const baseDir = path.resolve(__dirname, "..");
    const files = fs.readdirSync(baseDir).filter(f => f.endsWith(".html"));

    let list = "";
    files.forEach(f => {
      list += `<a href="/admin/edit?file=${encodeURIComponent(f)}">${f}</a>`;
    });

    res.send(`
      <!doctype html>
      <html>
      <head>
      <meta charset="utf-8">
      <title>Admin Dashboard</title>
      <link rel="stylesheet" href="/joy.css">
      <style>
      body{font-family:Arial,sans-serif;background:#f6f7fb;padding:20px}
      .panel{background:white;padding:24px;border-radius:8px;max-width:800px;margin:0 auto;box-shadow:0 6px 18px rgba(0,0,0,.08)}
      .panel h2{margin-top:0}
      .file-list a{display:block;padding:10px;margin:6px 0;background:#4caf50;color:#fff;text-decoration:none;border-radius:6px}
      .logout{background:#b00020!important;display:inline-block;margin-top:20px;padding:10px 14px;color:white;text-decoration:none;border-radius:6px}
      </style>
      </head>
      <body>
      <div class="panel">
        <h2>Welcome, Admin</h2>
        <p>Edit any page below:</p>
        <div class="file-list">
          ${list}
        </div>
        <a href="/admin/logout" class="logout">Log out</a>
      </div>
      </body>
      </html>
    `);
  });
};
