// edit.js
const path = require("path");
const fs = require("fs");

module.exports = function (app) {
  app.use(require("express").urlencoded({ extended: true }));

  app.all("/admin/edit", (req, res) => {
    if (!req.session || !req.session.admin_logged_in) {
      return res.redirect("/admin");
    }

    const baseDir = path.resolve(__dirname, "..");
    const file = (req.method === "GET" ? req.query.file : req.body.file) || "";
    const filePath = path.resolve(baseDir, file);

    // Validate file path (must be inside baseDir and end with .html)
    if (!filePath || !filePath.startsWith(baseDir + path.sep) || !/\.html$/.test(file)) {
      return res.status(400).send("Invalid file.");
    }

    let msg = "";
    if (req.method === "POST") {
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

    // simple HTML escaping for textarea
    const escapeHtml = (s) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const contentEscaped = escapeHtml(raw);
    const fileEscaped = escapeHtml(file);

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
