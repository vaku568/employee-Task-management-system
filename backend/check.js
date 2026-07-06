const bcrypt = require("bcryptjs");

const hash =
"$2b$10$OQFwm2tvVewmQCUREmXuF.3gv7MjSd8P8MlhSAjC/uj5CbAt30pZ.";

bcrypt.compare(
  "admin123",
  hash
).then(result => {
  console.log(result);
});