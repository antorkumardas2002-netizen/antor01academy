// test-password.js
const path = require("path");
const bcrypt = require("bcryptjs");
const { ADMIN_PASSWORD_HASH } = require("./config");

// Some Node bcrypt libraries need $2y$ → $2a$ conversion.
// bcryptjs supports $2y$ directly, but replace if needed.
const hashFixed = ADMIN_PASSWORD_HASH.replace(/^\$2y\$/, "$2a$");

(async () => {
  console.log("Testing password: Antor123\n");

  console.log("Hash in config.js:");
  console.log(ADMIN_PASSWORD_HASH + "\n");

  const result = await bcrypt.compare("Antor123", hashFixed);

  console.log("bcrypt.compare('Antor123') result:", result, "\n");

  console.log("Real path of config.js:");
  console.log(path.resolve(__dirname, "config.js"));
})();
