// edit.js
const path = require("path");
const fs = require("fs");
const express = require("express");

module.exports = function (app) {
  app.use(express.urlencoded({ extended: true }));

  app.all("/admin/edit", (req, res) => {
    if (!req.session || !req.session.admin_logged_in) {
      return res.redirect("/admin");
    }

    const baseDir = path.resolve(__dirname, "..");
    const file = (req.method === "GET" ? req.query.file : req.body.file) || "";

    // Allow only simple filenames (no directory separators) and .html extension
    if (!/^[a-zA-Z0-9._-]+\.html$/.test(file)) {
      return res.status(400).send("Invalid file.");
    }

    const filePath = path.resolve(baseDir, file);

    // Ensure filePath is inside baseDir
    const relative = path.relative(baseDir, filePath);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
      return res.status(400).send("Invalid file.");
    }

    let msg = "";

    // CSRF check on POST if session token exists
    if (req.method === "POST") {
      if (req.session.csrf_token && req.body.csrf_token !== req.session.csrf_token) {
        return res.status(403).send("Invalid CSRF token.");
      }

      const newContent = req.body.content || "";
      try {
        fs.writeFileSync(filePath, newContent, "utf8");
        msg = "File saved!";
      } catch (err) {
        console.error(err);
        return res.status(500).send("Failed to save file.");
      }
    }

    let raw;
    try {
      raw = fs.readFileSync(filePath, "utf8");
    } catch (err) {
      return res.status(500).send("Unable to read file.");
    }

    const escapeHtml = (s) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const contentEscaped = escapeHtml(raw);
    const fileEscaped = escapeHtml(file);
    const csrfInput = req.session.csrf_token
      ? `<input type="hidden" name="csrf_token" value="${escapeHtml(req.session.csrf_token)}">`
      : "";

    res.send(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Edit ${fileEscaped}</title>
<style>
body{font-family:Arial,sans-serif;background:#f6f7fb;padding:20px}
.editor{background:white;padding:20px;border-radius:8px;max-width:900px;margin:0 auto;box-shadow:0 6px 18px rgba(0,0,0,.08)}
textarea{width:100%;height:500px;font-family:monospace;font-size:14px;white-space:pre}
button{padding:10px 14px;margin-top:10px}
a.back{display:inline-block;margin-top:15px;text-decoration:none;color:#4caf50}
.success{color:green;margin-bottom:10px}
</style>
</head>
<body>
<div class="editor">
  <h2>Editing: ${fileEscaped}</h2>
  ${msg ? `<div class="success">${escapeHtml(msg)}</div>` : ""}
  <form method="post" action="/admin/edit">
    <input type="hidden" name="file" value="${fileEscaped}">
    ${csrfInput}
    <textarea name="content">${contentEscaped}</textarea>
    <br>
    <button type="submit">💾 Save Changes</button>
  </form>
  <a class="back" href="/admin/dashboard">← Back to Dashboard</a>
</div>
</body>
</html>`);
  });
};
