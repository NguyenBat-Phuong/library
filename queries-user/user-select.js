const connection = require("../connect/db.js");

async function selectUsers() {
  try {
    const [results] = await connection.promise().query("SELECT * FROM users");
    console.log("USERS----------------------");
    console.log(results);
  } catch (err) {
    console.error("ERROR UPDATE USERS:" + err.stack);
  }
}

module.exports = {
  selectUsers,
};
