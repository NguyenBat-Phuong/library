const connection = require("../connect/db.js");

async function selectUsers() {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT username, email, created_at FROM users WHERE NOT role = 'admin';");
    console.log("USERS----------------------");
    console.log(results);
  } catch (err) {
    console.error("ERROR UPDATE USERS:" + err.stack);
  }
}
// selectUsers()
module.exports = {
  selectUsers,
};
