// config.js
const crypto = require("crypto");

const ADMIN_PASSWORD_HASH =
  "$2y$10$iarLVO9DgN.Cr/b0S5.HPOWR4s44yxyD9/6RM9H7QxTauiCgwAlFe";

function ensureSession(req, res, next) {
  if (!req.session) return next(new Error("Session not initialized"));

  if (!req.session.csrf_token) {
    req.session.csrf_token = crypto.randomBytes(32).toString("hex");
  }

  next();
}

module.exports = {
  ADMIN_PASSWORD_HASH,
  ensureSession,
};
