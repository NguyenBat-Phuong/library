const connection = require("../connect/db.js");

async function selectUsers() {
  try {
    const [results] = await connection.promise().query("SELECT * FROM books");
    console.log("BOOKS----------------------");
    console.log(results);
  } catch (err) {
    console.error("ERROR UPDATE BOOKS:" + err.stack);
  }
}

module.exports = {
  selectBooks,
};
