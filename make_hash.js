// hash.js
const bcrypt = require("bcryptjs");

bcrypt.hash("Antor123", 10).then(hash => {
  console.log(hash);
});
